import Link from "next/link";
import courses from "@/data/courses.json";

export const dynamic = "force-static";
export const revalidate = 86400;

export default async function HtmlSitemapPage() {
  let blogs = [];
  try {
    const { default: prisma } = await import("@/lib/prisma");
    blogs = await prisma.blog.findMany({
      select: { slug: true, title: true, updatedAt: true, createdAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
  } catch {
    blogs = [];
  }

  const staticPages = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/3-year-program", label: "3-Year Program (Skilling with Schooling)" },
    { href: "/degree-program-software", label: "Degree Program in Software Development" },
    { href: "/post-graduation-software", label: "Post Graduation in Software Development" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact-us", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
  ];

  const courseLinks = Array.isArray(courses)
    ? courses.filter((course) => course?.slug).map((course) => ({
        href: `/courses/${course.slug}`,
        label: course.title || course.slug,
      }))
    : [];

  const blogLinks = Array.isArray(blogs)
    ? blogs.filter((blog) => blog?.slug).map((blog) => ({
        href: `/blog/${blog.slug}`,
        label: blog.title || blog.slug,
        lastModified: blog.updatedAt ?? blog.createdAt ?? null,
      }))
    : [];

  return (
    <main className="container" style={{ padding: "2rem 1rem" }}>
      <h1>Sitemap</h1>
      <p>
        HTML sitemap for visitors. XML sitemap is available at{" "}
        <a href="/sitemap.xml">/sitemap.xml</a>.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Pages</h2>
        <ul>
          {staticPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href}>{page.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Courses</h2>
        {courseLinks.length ? (
          <ul>
            {courseLinks.map((course) => (
              <li key={course.href}>
                <Link href={course.href}>{course.label}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No course links available.</p>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Blogs</h2>
        {blogLinks.length ? (
          <ul>
            {blogLinks.map((blog) => (
              <li key={blog.href}>
                <Link href={blog.href}>{blog.label}</Link>
                {blog.lastModified ? (
                  <small style={{ marginLeft: ".5rem", opacity: 0.7 }}>
                    ({new Date(blog.lastModified).toLocaleDateString()})
                  </small>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No blog links available.</p>
        )}
      </section>
    </main>
  );
}
