"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import styles from "./homeBlogSection.module.css";

const MAX_POSTS = 3;

export default function HomeBlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`/api/blog?limit=${MAX_POSTS}`);
        if (!res.ok) throw new Error("Failed to load blog posts");
        const json = await res.json();
        if (!active) return;
        setBlogs(json?.data?.slice(0, MAX_POSTS) || []);
      } catch (err) {
        console.error(err);
        if (active) setError("Unable to load posts right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const showEmpty = !loading && !error && blogs.length === 0;

  return (
    <section className={styles.blogSection} aria-labelledby="home-blog-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Insights & stories</p>
          <h2 id="home-blog-title">From the IIDAD blog</h2>
          <p className={styles.lead}>
            Explore the latest updates from our community—industry insights, campus news,
            and student projects curated by the IIDAD team.
          </p>
        </div>
        <Link href="/blog" className={styles.viewAll} aria-label="View all blog posts">
          View all posts
        </Link>
      </div>

      {loading ? (
        <p className={styles.status}>Loading stories…</p>
      ) : error ? (
        <p className={styles.status}>{error}</p>
      ) : showEmpty ? (
        <p className={styles.status}>No posts yet. Check back soon.</p>
      ) : (
        <div className={`blog-grid ${styles.grid}`}>
          {blogs.map((blog) => (
            <div key={blog.id} data-reveal-child="" style={{ height: '100%' }}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
