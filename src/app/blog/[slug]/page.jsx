
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getBaseUrl } from "@/lib/base-url";
import BlogCard from "@/components/BlogCard";

export const dynamic = "force-dynamic";

// Fetch a single blog by slug directly from database
const fetchBlog = async (slug) => {
  try {
    return await prisma.blog.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("fetchBlog error:", error);
    return null;
  }
};

const normalizeBlogHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/&nbsp;/g, " ").replace(/\u00A0/g, " ");
};

// Fetch related blogs directly from database
const fetchRelated = async (slug, tags = []) => {
  try {
    const filters = [{ slug: { not: slug } }];
    if (Array.isArray(tags) && tags.length > 0) {
      filters.push({ tags: { hasSome: tags } });
    }
    const related = await prisma.blog.findMany({
      where: { AND: filters },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    if (related && related.length > 0) return { data: related };

    const fallback = await prisma.blog.findMany({
      where: { slug: { not: slug } },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    return { data: fallback || [] };
  } catch (error) {
    console.error("fetchRelated error:", error);
    return { data: [] };
  }
};

export async function generateMetadata(props) {
  const params = await props?.params;
  const slug = params?.slug;
  const blog = slug ? await fetchBlog(slug) : null;

  if (!blog) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = await getBaseUrl();
  
  // Use metaTitle if available, otherwise use title
  const metaTitle = blog.metaTitle?.trim() || blog.title;
  
  // Use metaDescription if available, otherwise extract from content
  const normalizedContent = normalizeBlogHtml(blog.content);
  const metaDescription =
    blog.metaDescription?.trim() ||
    normalizedContent.replace(/<[^>]+>/g, " ").trim().slice(0, 160);
  
  // Use ogImage if available, otherwise use coverImg
  const imageUrl = blog.ogImage?.trim() || blog.coverImg?.trim();
  const isExternalImage = Boolean(imageUrl && /^(https?:)?\/\//i.test(imageUrl));
  const ogImage = imageUrl
    ? isExternalImage
      ? imageUrl
      : new URL(imageUrl, baseUrl).toString()
    : undefined;
  
  const canonical = new URL(`/blog/${blog.slug}`, baseUrl).toString();
  
  // Generate image alt text
  const imageAlt = `Cover image for ${blog.title}`;

  const resolvedKeywords = Array.isArray(blog.keywords) && blog.keywords.length ? blog.keywords : blog.tags || [];

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [
        {
          url: ogImage,
          alt: imageAlt,
        }
      ] : undefined,
      type: "article",
      url: canonical,
      siteName: "IIDAD - Indian Institute of Design and Development",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author ? [blog.author] : ["IIDAD"],
      tags: blog.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [
        {
          url: ogImage,
          alt: imageAlt,
        }
      ] : undefined,
      creator: "@iidad",
    },
    keywords: resolvedKeywords,
    authors: blog.author ? [{ name: blog.author }] : [{ name: "IIDAD" }],
    publisher: "Indian Institute of Design and Development",
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default async function BlogDetails(props) {
  const params = await props?.params;
  const slug = params?.slug;
  const blog = slug ? await fetchBlog(slug) : null;

  if (!blog) {
    notFound();
  }

  const contentHtml = normalizeBlogHtml(blog.content);

  const related = await fetchRelated(slug, blog.tags);
  const cover = blog.coverImg?.trim();
  const isExternalCover = Boolean(cover && /^(https?:)?\/\//i.test(cover));
  const hasCover = Boolean(cover);
  const imageSrc = hasCover ? cover : "/placeholder.svg";
  const isPlaceholder = !hasCover;

  // Process schemas array (plus backward-compatible fields)
  const schemas = [];
  if (Array.isArray(blog.schemas)) {
    for (const schema of blog.schemas) {
      if (schema && typeof schema === "object") schemas.push(schema);
    }
  }
  if (blog.schema && typeof blog.schema === "object") schemas.push(blog.schema);
  if (blog.faqSchema && typeof blog.faqSchema === "object") schemas.push(blog.faqSchema);

  return (
    <main id="main-content" className="blog-detail" role="main">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <div className="blog-detail__layout">
        <article className="blog-detail__main" aria-labelledby="blog-title">
          <div className={`cover${isPlaceholder ? " cover--placeholder" : ""}`}>
            <Image
              src={imageSrc}
              alt={blog.title}
              fill
              sizes="(max-width: 900px) 100vw, 840px"
              priority
              style={{ objectFit: "cover" }}
              unoptimized={isExternalCover}
            />
            {isPlaceholder ? <span className="cover__hint">Upload a cover image from the admin panel to replace this default artwork.</span> : null}
          </div>

          <header>
            <p className="eyebrow">{new Date(blog.createdAt).toLocaleDateString()}</p>
            <h1 id="blog-title">{blog.title}</h1>
            {blog.tags?.length ? <p className="tags">{blog.tags.join(" / ")}</p> : null}
          </header>

          <div className="content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>

        {related?.data?.length ? (
          <aside className="blog-detail__sidebar" aria-label="Recommended blogs">
            <div className="related">
              <h3>Recommended blogs</h3>
              <div className="blog-grid blog-grid--sidebar">
                {related.data.map((item) => (
                  <BlogCard key={item.id} blog={item} />
                ))}
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
