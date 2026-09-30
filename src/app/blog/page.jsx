import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import prisma from "@/lib/prisma";

const DEFAULT_LIMIT = 9;

const fetchBlogs = async (params = {}) => {
  try {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(Math.max(Number(params.limit) || DEFAULT_LIMIT, 1), 24);
    const search = params.search?.trim();
    const tag = params.tag?.trim();

    const filters = [];
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

    return {
      data: items,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.max(1, Math.ceil(count / limit)),
      },
    };
  } catch (error) {
    console.error("fetchBlogs direct query failed:", error);
    return { data: [], pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 1 } };
  }
};

export const metadata = {
  title: "iidad Developer Hub – Coding Energy, Creative Logic & New-Age Tech",
  description: "iidad Developer Hub gives you everything you need to grow—coding lessons, trending technologies, student-focused resources, and future-ready development knowledge.",
  keywords: [
    "IIDAD blog",
    "design blog India",
    "design education articles",
    "student design projects",
    "design trends",
    "IIDAD news",
    "design insights",
    "creative education blog",
    "design institute updates",
    "web development",
    "designing and development",
    "web development blog",
    "programming blog",
    "full stack developer",
    "full stack",
    "mern stack developer",
    "python developer"
  ],
  openGraph: {
    title: "IIDAD Blog - Design Insights, News & Updates | Indian Institute of Design and Development",
    description: "Read the latest from IIDAD - design trends, student showcases, industry insights, campus events, and educational resources from India's premier design institute.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "IIDAD Blog - Design Insights and News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IIDAD Blog - Design Insights, News & Updates",
    description: "Explore design trends, student projects, and insights from India's leading design institute.",
    images: ["/twitter-blog.jpg"],
  },
  alternates: {
    canonical: "https://www.iidad.com/blog",
  },
};

export default async function BlogPage({ searchParams }) {
  const params = (await searchParams) || {};
  const resolvedParams = { ...params };
  const page = Number(resolvedParams.page) || 1;
  const searchQuery = resolvedParams.search || "";

  let data;
  try {
    data = await fetchBlogs({ ...resolvedParams, page });
  } catch (error) {
    console.error(error);
    data = { data: [], pagination: { page: 1, totalPages: 1, limit: 0, total: 0 } };
  }

  return (
    <main className="blog-index" role="main">
      <div className="blog-index__hero">
        <div>
          <p className="blog-index__eyebrow">Stories &amp; Updates</p>
          <h1>Blog</h1>
          <p>Search by title, keywords, or tags. Everything is backed by Prisma and PostgreSQL.</p>
        </div>
        <div>
          <form className="blog-search" action="/blog" method="GET" role="search" aria-label="Blog search">
            <input
              type="search"
              name="search"
              placeholder="Search title, content, or tags..."
              defaultValue={searchQuery}
              aria-label="Search blog posts"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>

      {data?.data?.length ? (
        <div className="blog-grid">
          {data.data.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <div className="blog-empty__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p>No posts yet. Head to the admin area to create one.</p>
        </div>
      )}

      {data?.pagination?.totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          {Array.from({ length: data.pagination.totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === data.pagination.page;
            const paramsClone = new URLSearchParams(resolvedParams);
            paramsClone.set("page", pageNumber.toString());

            return (
              <Link
                key={pageNumber}
                href={`/blog?${paramsClone.toString()}`}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "is-active" : undefined}
              >
                {pageNumber}
              </Link>
            );
          })}
        </nav>
      )}
    </main>
  );
}
