import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { normalizeTags } from "@/lib/tags";
import { ensureAdminApi } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/request-info";

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
  if (input === undefined) return undefined;
  if (input === null) return null;
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
  if (schemas === undefined) return undefined;
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

const resolveLookup = async (handle, lookup) => {
  if (lookup === "id") {
    return prisma.blog.findUnique({ where: { id: handle } });
  }

  return prisma.blog.findUnique({ where: { slug: handle } });
};

export async function GET(request, context) {
  const params = await context?.params;
  if (!params) {
    return NextResponse.json({ error: "Missing route params" }, { status: 400 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const lookup = searchParams.get("lookup") === "id" ? "id" : "slug";

    if (lookup === "id" && !(await ensureAdminApi(request, { requireCsrf: false }))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blog = await resolveLookup(params.handle, lookup);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(`GET /api/blog/${params?.handle ?? "unknown"} failed`, error);
    return NextResponse.json({ error: "Unable to fetch blog" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const params = await context?.params;
  if (!params) {
    return NextResponse.json({ error: "Missing route params" }, { status: 400 });
  }
  try {
    const session = await ensureAdminApi(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const { title, content, coverImg, ogImage, metaTitle, metaDescription, tags, keywords, slug, schemas } = payload;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const exists = await prisma.blog.findUnique({ where: { id: params.handle } });
    if (!exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const resolvedSlug = await generateUniqueSlug(slug || title, params.handle);
    const preparedTags = normalizeTags(tags);
    const preparedKeywords = keywords === undefined ? undefined : normalizeTags(keywords);
    
    let preparedSchemas = undefined;
    try {
      preparedSchemas = parseSchemasArray(schemas);
    } catch (error) {
      return NextResponse.json({ error: error.message || "Invalid schemas" }, { status: 400 });
    }

    // Sanitize content: strip scripts, dangerous tags, inline styles, and event handlers before update
    const sanitizeContent = (html) => {
      if (!html || typeof html !== "string") return "";
      return html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
        .replace(/<embed\b[^>]*>/gi, "")
        .replace(/<applet\b[^>]*>[\s\S]*?<\/applet>/gi, "")
        .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1=""')
        .replace(/\sstyle=\"[^\"]*\"/gi, "")
        .replace(/\sstyle='[^']*'/gi, "")
        .replace(/<\/?font[^>]*>/gi, "")
        .replace(/\sid=\"docs-internal-guid-[^\"]*\"/gi, "");
    };

    const data = {
      title: title.trim(),
      content: sanitizeContent(content),
      coverImg: coverImg?.trim() || null,
      ogImage: ogImage?.trim() || null,
      metaTitle: metaTitle?.trim() || null,
      metaDescription: metaDescription?.trim() || null,
      tags: preparedTags,
      slug: resolvedSlug,
    };

    if (preparedKeywords !== undefined) {
      data.keywords = preparedKeywords;
    }

    if (preparedSchemas !== undefined) {
      data.schemas = preparedSchemas;
    }

    const updated = await prisma.blog.update({
      where: { id: params.handle },
      data,
    });

    const ip = await getClientIp(request);
    await recordAudit("blog.update", {
      actor: session.sub,
      entity: "Blog",
      entityId: updated.id,
      ip,
      metadata: { title: updated.title, slug: updated.slug },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PUT /api/blog/${params?.handle ?? "unknown"} failed`, error);
    return NextResponse.json({ error: "Unable to update blog" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context?.params;
  if (!params) {
    return NextResponse.json({ error: "Missing route params" }, { status: 400 });
  }
  try {
    const session = await ensureAdminApi(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await prisma.blog.delete({ where: { id: params.handle } });
    const ip = await getClientIp(request);
    await recordAudit("blog.delete", {
      actor: session.sub,
      entity: "Blog",
      entityId: deleted.id,
      ip,
      metadata: { title: deleted.title, slug: deleted.slug },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/blog/${params?.handle ?? "unknown"} failed`, error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete blog" }, { status: 500 });
  }
}
