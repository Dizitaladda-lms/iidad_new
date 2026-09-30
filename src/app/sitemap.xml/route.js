import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import courses from "@/data/courses.json";
import { getBaseUrl } from "@/lib/base-url";

export const revalidate = 3600;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET(request) {
  let baseUrl = "";
  try {
    baseUrl = await getBaseUrl();
  } catch {
    baseUrl = "";
  }

  if (!baseUrl) {
    baseUrl = new URL(request.url).origin;
  }

  baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  let blogs = [];
  try {
    blogs = await prisma.blog.findMany({
      select: { slug: true, updatedAt: true, createdAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
  } catch {
    blogs = [];
  }

  const now = new Date();
  const staticPages = [
    "",
    "/about",
    "/courses",
    "/3-year-program",
    "/degree-program-software",
    "/post-graduation-software",
    "/contact-us",
    "/blog",
    "/faq",
    "/thank-you",
    "/privacy-policy",
    "/terms-and-conditions",
    "/sitemap",
  ];

  const entries = [];

  for (const path of staticPages) {
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: now,
    });
  }

  if (Array.isArray(courses)) {
    for (const course of courses) {
      if (!course?.slug) continue;
      entries.push({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: now,
      });
    }
  }

  if (Array.isArray(blogs)) {
    for (const blog of blogs) {
      if (!blog?.slug) continue;
      entries.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt ?? blog.createdAt ?? now,
      });
    }
  }

  const body = entries
    .map((entry) => {
      const lastmod = new Date(entry.lastModified).toISOString();
      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
