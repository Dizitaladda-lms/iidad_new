"use client";
import Link from "next/link";
import styles from "./homeDegreePrograms.module.css";

const CARDS = [
  {
    href: "/degree-program-software",
    category: "Degree Program",
    badge: "3 Years",
    title: "Degree in Software Development",
    subtitle: "B.Sc. Software Development",
    duration: "3 Years · 36 Modules",
    desc: "Build, deploy, and architect software from scratch. Graduate with a university B.Sc. degree alongside IIDAD's industry certification.",
    highlights: ["DU SOL or Amity University", "100% Placement", "36 Real Projects"],
    cta: "Explore Program",
  },
  {
    href: "/post-graduation-software",
    category: "Post Graduation Program",
    badge: "2 Years",
    title: "Post Graduation in Software Development",
    subtitle: "M.Sc. Software Development",
    duration: "2 Years · 24 Advanced Modules",
    desc: "Become a software architect and engineering leader. M.Sc. degree, AI integration, cloud systems, and an advanced placement pipeline.",
    highlights: ["DU SOL or Amity University", "Startup Incubation Access", "Advanced AI Track"],
    cta: "Explore Program",
  },
];

export default function HomeSectionDegreePrograms() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.kicker}>University-Backed Learning</p>
          <h2 className={styles.heading}>
            Degree &amp; Post Graduation<br />
            <span className={styles.accent}>Programs.</span>
          </h2>
          <p className={styles.subtitle}>
            Earn a recognized university degree while mastering real software skills — all under one roof. Choose DU SOL or Amity University, paired with IIDAD's live industry training.
          </p>
        </div>

        {/* 2-column card grid */}
        <div className={styles.grid}>
          {CARDS.map((card) => (
            <div key={card.href} className={styles.card} data-reveal-child="">
              <div className={styles.cardTop}>
                <span className={styles.cardCategory}>{card.category}</span>
                <span className={styles.cardBadge}>{card.badge}</span>
              </div>
              <div className={styles.cardDuration}>{card.duration}</div>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
              <div className={styles.cardHighlights}>
                {card.highlights.map((h) => (
                  <span key={h} className={styles.cardHighlight}>{h}</span>
                ))}
              </div>
              <Link href={card.href} className={styles.cardCta}>
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
