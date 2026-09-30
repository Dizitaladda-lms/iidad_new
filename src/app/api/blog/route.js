import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { normalizeTags } from "@/lib/tags";
import { ensureAdminApi } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/request-info";

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 24;

const extractJsonLdFromScriptTag = (raw) => {
  const trimmed = raw.trim();
  if (!/^<script\b/i.test(trimmed)) return trimmed;

  const matches = [...trimmed.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  if (matches.length > 1) {
    throw new Error("Multiple <script> blocks found. Add each JSON-LD as a separate schema entry.");
  }
  if (matches.length === 1) {
    return (matches[0][1] || "").trim();
  }

  return trimmed
    .replace(/^<script\b[^>]*>/i, "")
    .replace(/<\/script>\s*$/i, "")
    .trim();
};

const parseSchemaJson = (input) => {
  if (input === undefined || input === null) return null;
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const normalized = extractJsonLdFromScriptTag(trimmed);
    if (/"image"\s*:\s*,/.test(normalized)) {
      throw new Error('Invalid schema JSON: "image" is missing a value. Remove the "image" line or set it to a URL string.');
    }
    try {
      return JSON.parse(normalized);
    } catch (error) {
      throw new Error(`Invalid schema JSON: ${error.message || "Unable to parse"}`);
    }
  }
  if (typeof input === "object") {
    return input;
  }
  throw new Error("Invalid schema JSON");
};

const parseSchemasArray = (schemas) => {
  if (!Array.isArray(schemas)) return [];
  
  const parsed = [];
  for (let i = 0; i < schemas.length; i++) {
    const schema = schemas[i];
    if (!schema || (typeof schema === 'string' && !schema.trim())) {
      continue; // Skip empty schemas
    }
    
    try {
      const parsedSchema = parseSchemaJson(schema);
      if (parsedSchema) {
        parsed.push(parsedSchema);
      }
    } catch (error) {
      throw new Error(`Schema ${i + 1}: ${error.message}`);
    }
  }
  
  return parsed;
};

// Strip scripts, dangerous tags, inline styles, and event handlers from rich text HTML before saving
const sanitizeContent = (html) => {
  if (!html || typeof html !== "string") return "";
  return html
    // Remove script tags and contents
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove object, embed, applet tags
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<applet\b[^>]*>[\s\S]*?<\/applet>/gi, "")
    // Remove inline event handlers (onerror, onload, onclick, onmouseover, etc.)
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Remove javascript: pseudo-protocol in href/src
    .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1=""')
    // Remove style attributes (double and single quoted)
    .replace(/\sstyle=\"[^\"]*\"/gi, "")
    .replace(/\sstyle='[^']*'/gi, "")
    // Remove deprecated font tags entirely
    .replace(/<\/?font[^>]*>/gi, "")
    // Remove Google Docs internal GUID ids
    .replace(/\sid=\"docs-internal-guid-[^\"]*\"/gi, "");
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limitParam = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
    const limit = Math.min(Math.max(limitParam, 1), MAX_LIMIT);
    const search = searchParams.get("search")?.trim();
    const tag = searchParams.get("tag")?.trim();
    const relatedTo = searchParams.get("relatedTo")?.trim();
    const excludeId = searchParams.get("excludeId")?.trim();

    const filters = [];
    const excludedIds = [];

    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { tags: { has: search.toLowerCase() } },
          { keywords: { has: search.toLowerCase() } },
        ],
      });
    }

    if (tag) {
      filters.push({ tags: { has: tag.toLowerCase() } });
    }

    if (excludeId) {
      excludedIds.push(excludeId);
    }

    if (relatedTo) {
      const reference = await prisma.blog.findUnique({
        where: { slug: relatedTo },
        select: { id: true, tags: true },
      });

      if (reference) {
        const relatedTags = reference.tags?.length ? reference.tags : undefined;
        excludedIds.push(reference.id);
        if (relatedTags) {
          filters.push({ tags: { hasSome: relatedTags } });
        }
      }
    }

    if (excludedIds.length) {
      filters.push({ id: { notIn: excludedIds } });
    }

    const where = filters.length ? { AND: filters } : undefined;

    const skip = (page - 1) * limit;

    const [items, count] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.max(1, Math.ceil(count / limit)),
      },
    });
  } catch (error) {
    console.error("GET /api/blog failed", error);
    return NextResponse.json({ error: "Unable to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await ensureAdminApi(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const {
      title,
      content,
      coverImg,
      ogImage,
      metaTitle,
      metaDescription,
      tags,
      keywords,
      slug,
      schemas,
      // Backward compat (older UI)
      schema,
      faqSchema,
    } = payload;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const finalSlug = await generateUniqueSlug(slug || title);
    const preparedTags = normalizeTags(tags);
    const preparedKeywords = normalizeTags(keywords);
    let preparedSchemas = [];
    let preparedSchema = null;
    let preparedFaqSchema = null;

    try {
      preparedSchemas = parseSchemasArray(schemas);
      preparedSchema = parseSchemaJson(schema);
      preparedFaqSchema = parseSchemaJson(faqSchema);

      // Store legacy fields inside schemas[] too, so the page can render all scripts.
      if (preparedSchema) preparedSchemas.push(preparedSchema);
      if (preparedFaqSchema) preparedSchemas.push(preparedFaqSchema);
    } catch (error) {
      return NextResponse.json({ error: error.message || "Invalid schemas" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        content: sanitizeContent(content),
        coverImg: coverImg?.trim() || null,
        ogImage: ogImage?.trim() || null,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        tags: preparedTags,
        keywords: preparedKeywords,
        schema: preparedSchema,
        faqSchema: preparedFaqSchema,
        schemas: preparedSchemas,
        slug: finalSlug,
      },
    });

    const ip = await getClientIp(request);
    await recordAudit("blog.create", {
      actor: session.sub,
      entity: "Blog",
      entityId: blog.id,
      ip,
      metadata: { title: blog.title, slug: blog.slug },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog failed", error);
    return NextResponse.json({ error: "Unable to create blog" }, { status: 500 });
  }
}
