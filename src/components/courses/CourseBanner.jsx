"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './courseBanner.module.css'

const computePrices = (duration) => {
  const monthly = 10000;
  const months = Number(duration) || 0;
  const base = months * monthly;
  let discount = 0;
  if (months === 12) discount = 10000;
  else if (months === 6 || months === 3 || months === 4) discount = 5000;
  const price = Math.max(0, base - discount);
  return { price, oldPrice: base };
};

const formatPrice = (n) => {
  if (n == null) return '';
  return `₹${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

const buildModules = (duration, includeGenAI = false) => {
  const topicsFullstack = [
    {
      title: 'HTML from Beginner to Advanced',
      weeks: [
        'Week 1: Structure, tags, and accessibility basics + mini project: multi-section webpage',
        'Week 2: Forms, inputs, validation patterns + mini project: signup page with validation',
        'Week 3: Semantic HTML for SEO, ARIA roles + mini project: blog article with semantic layout',
        'Week 4: Media embedding, tables, responsive meta tags + mini project: product detail page',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Modern CSS and Layouts',
      weeks: [
        'Week 1: Cascade, selectors, variables + mini project: style system tokens',
        'Week 2: Flexbox patterns + mini project: responsive navbar & cards',
        'Week 3: Grid layouts + mini project: multi-column landing page',
        'Week 4: Transitions, animations, dark mode + mini project: interactive hero section',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'JavaScript Foundations',
      weeks: [
        'Week 1: Types, scope, functions + mini project: utility helpers',
        'Week 2: DOM APIs, events + mini project: interactive to-do list',
        'Week 3: Async/await, fetch, promises + mini project: API-powered gallery',
        'Week 4: Modules, bundling concepts + mini project: small modular app',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Advanced JavaScript Patterns',
      weeks: [
        'Week 1: Closures, prototypes, classes + mini project: stateful widgets',
        'Week 2: Error handling, retries, debouncing + mini project: resilient search UI',
        'Week 3: Performance profiling + mini project: optimize list rendering',
        'Week 4: Testing fundamentals + mini project: unit tests for utilities',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'React Fundamentals',
      weeks: [
        'Week 1: Components, JSX, props + mini project: reusable UI kit',
        'Week 2: State, events, hooks + mini project: interactive dashboard widgets',
        'Week 3: Data fetching, effects + mini project: API-driven listings',
        'Week 4: Routing basics + mini project: multi-page React app',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'React Advanced & Performance',
      weeks: [
        'Week 1: Context, reducers + mini project: global state notes app',
        'Week 2: Code-splitting, Suspense patterns + mini project: lazy-loaded sections',
        'Week 3: Forms, validation + mini project: multi-step form',
        'Week 4: Testing React components + mini project: tested component suite',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Backend Basics (Node/Express)',
      weeks: [
        'Week 1: REST APIs, routing + mini project: basic CRUD API',
        'Week 2: Middleware, auth flow basics + mini project: protected routes',
        'Week 3: Validation, error handling + mini project: robust API layer',
        'Week 4: Logging, config, env management + mini project: production-ready API',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Databases & ORM',
      weeks: [
        'Week 1: Relational concepts, modeling + mini project: schema design',
        'Week 2: CRUD with ORM (e.g., Prisma) + mini project: data layer for app',
        'Week 3: Relations, migrations + mini project: relational features',
        'Week 4: Performance & indexing basics + mini project: query tuning exercise',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Auth, Security & Sessions',
      weeks: [
        'Week 1: Sessions vs JWT, cookies + mini project: auth skeleton',
        'Week 2: RBAC, guards + mini project: role-based dashboard',
        'Week 3: OWASP basics, input hardening + mini project: secure form flow',
        'Week 4: Rate limiting, CSRF basics + mini project: hardened API endpoints',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'APIs & Integrations',
      weeks: [
        'Week 1: REST patterns, pagination + mini project: API consumer app',
        'Week 2: Webhooks, retries + mini project: webhook receiver',
        'Week 3: Third-party integrations + mini project: external API mashup',
        'Week 4: File uploads, signed URLs + mini project: media upload flow',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Testing, Quality & CI',
      weeks: [
        'Week 1: Unit testing patterns + mini project: tested utilities',
        'Week 2: Component/e2e testing + mini project: UI test flow',
        'Week 3: Linting, formatting, type checks + mini project: quality pipeline',
        'Week 4: CI setup basics + mini project: CI workflow',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Deployment & DevOps Basics',
      weeks: [
        'Week 1: Environments, configs + mini project: env-aware app',
        'Week 2: Docker fundamentals + mini project: containerized service',
        'Week 3: Hosting options, CDNs + mini project: deployed app',
        'Week 4: Monitoring, logs, alerts + mini project: basic observability',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Capstone & Performance Tuning',
      weeks: [
        'Week 1: Project scoping + mini project: capstone plan',
        'Week 2: Implementation sprint + mini project: feature build',
        'Week 3: Performance passes (frontend/backend) + mini project: perf fixes',
        'Week 4: Polish, docs, handoff + mini project: final demo prep',
        'Monthly test & practical assessment',
      ],
    },
  ];

  const topicsGenAI = [
    topicsFullstack[0],
    topicsFullstack[1],
    topicsFullstack[2],
    {
      title: 'Generative AI & LLM Foundations',
      weeks: [
        'Week 1: Tokens, embeddings, prompting basics + mini project: prompt library',
        'Week 2: LLM APIs (OpenAI etc.) + mini project: Q&A assistant',
        'Week 3: Context windows, chunking + mini project: doc chunking pipeline',
        'Week 4: Safety, guardrails + mini project: moderated assistant',
        'Monthly test & practical assessment',
      ],
    },
    {
      title: 'Retrieval-Augmented Generation (RAG)',
      weeks: [
        'Week 1: Vector stores, embeddings + mini project: semantic search',
        'Week 2: Indexing strategies + mini project: RAG over docs',
        'Week 3: Evaluation for RAG + mini project: eval harness',
        'Week 4: Caching, costs, latency + mini project: optimized RAG pipeline',
        'Monthly test & practical assessment',
      ],
    },
    topicsFullstack[5],
    {
      title: 'LLM Apps with Next.js & Node',
      weeks: [
        'Week 1: Server actions/API routes for LLM calls + mini project: chat endpoint',
        'Week 2: Streaming responses + mini project: streaming chat UI',
        'Week 3: Tool calling/functions + mini project: agent with tools',
        'Week 4: Auth + usage metering + mini project: gated LLM app',
        'Monthly test & practical assessment',
      ],
    },
    topicsFullstack[6],
    topicsFullstack[7],
    topicsFullstack[8],
    topicsFullstack[9],
    topicsFullstack[10],
    topicsFullstack[11],
  ];

  const topics = includeGenAI ? topicsGenAI : topicsFullstack;

  const count = Math.max(1, Number(duration) || 1);
  return Array.from({ length: count }, (_, idx) => {
    const topic = topics[idx] || topics[topics.length - 1];
    return {
      title: `Module ${idx + 1}: ${topic.title}`,
      summary: `Month ${idx + 1} milestones`,
      bullets: topic.weeks,
    };
  });
};

export default function CourseBanner({ course, recommendedCourses = [] }) {
  const { price, oldPrice } = computePrices(course.duration);
  const saved = oldPrice > 0 ? oldPrice - price : 0;
  const pct = oldPrice > 0 ? Math.round((saved / oldPrice) * 100) : 0;
  const installmentMonths = Math.max(1, Number(course.duration) || 1);

  const includeGenAI = /generative\s*ai/i.test(`${course.title || ''} ${course.slug || ''} ${(course.tags || []).join(' ')}`);
  const modules = useMemo(() => buildModules(course.duration, includeGenAI), [course.duration, includeGenAI]);
  const [openIndex, setOpenIndex] = useState(0);

  const defaultTrainer = {
    name: course.trainerName || 'Manjeet Singh',
    bio: course.trainerBio || 'Multidisciplinary developer with 4+ years of industry experience; finalist/semifinalist at GSSoC 2024, Flipkart Grid 6.0, and DoraHacks Buildathon; has collaborated with 20+ brands and actively contributes to open source.',
    image: course.trainerImage || '/teamPic/manjeet3-removebg-preview.webp',
    highlights: ['Industry projects', 'Mentorship support', 'Career-focused feedback'],
    socials: {
      github: course.trainerGithub || 'https://github.com/',
      linkedin: course.trainerLinkedin || 'https://www.linkedin.com/',
    },
  };

  const genAISecondaryTrainer = {
    name: 'Shagun Shrivastava',
    bio: 'AI expert with 3+ years of experience building and optimizing models; semifinalist in competitions including Flipkart Grid 6.0; worked with 10+ brands and delivered 30+ production-grade models.',
    image: course.trainerImageSecondary || '',
    highlights: ['AI model performance', 'Competition experience', 'Industry-grade deployments'],
    socials: {
      github: course.trainerGithubSecondary || 'https://github.com/',
      linkedin: course.trainerLinkedinSecondary || 'https://www.linkedin.com/',
    },
  };

  const trainers = useMemo(() => {
    if (course.slug === 'diploma-in-fullstack-development-with-generative-ai') {
      return [defaultTrainer, genAISecondaryTrainer];
    }
    return [defaultTrainer];
  }, [course.slug, defaultTrainer, genAISecondaryTrainer]);

  const primaryTrainerName = trainers[0]?.name || defaultTrainer.name;

  // Prefer course-specific image if provided; otherwise, fall back to slug-based thumbnail.
  const thumbnailPath = course.img || `/courseThumbnail/${course.slug}.jpg`;

  return (
    <>
      <section className={styles.bannerWrapper}>
        <div className={styles.container}>
          <Link href="/courses" className={styles.backLink}>← Back to all courses</Link>

          <div className={styles.grid}>
            <div className={styles.mainContent}>
            <div className={styles.heroCard}>
              <div className={styles.imageWrapper}>
                <img src={thumbnailPath} alt={course.title} className={styles.courseImage} />
                {course.tags && course.tags.includes('Bestseller') && (
                  <span className={styles.bestsellerBadge}>Bestseller</span>
                )}
              </div>

              <div className={styles.courseInfo}>
                <h1 className={styles.courseTitle}>{course.title}</h1>
                <p className={styles.courseDescription}>{course.description}</p>

                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span>{course.duration} months</span>
                  </div>
                  <div className={styles.metaItem}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span>{course.rating} ({course.ratingsCount})</span>
                  </div>
                  <div className={styles.metaItem}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{primaryTrainerName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contentCard}>
              <h2 className={styles.sectionHeading}>What you&apos;ll learn</h2>
              <div className={styles.learnGrid}>
                <div className={styles.learnItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Hands-on projects and real-world examples</span>
                </div>
                <div className={styles.learnItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Industry best practices and modern architecture</span>
                </div>
                <div className={styles.learnItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Portfolio-ready assignments and mentorship</span>
                </div>
                <div className={styles.learnItem}>
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Certificate of completion upon finishing</span>
                </div>
              </div>
            </div>

            <div className={styles.moduleCard}>
              <div className={styles.moduleHeaderRow}>
                <h2 className={styles.sectionHeading}>Modules by Month</h2>
                <span className={styles.moduleBadge}>{modules.length} modules</span>
              </div>
              <div className={styles.moduleList}>
                {modules.map((mod, idx) => {
                  const open = openIndex === idx;
                  return (
                    <div key={mod.title} className={`${styles.moduleItem} ${open ? styles.moduleOpen : ''}`}>
                      <button
                        type="button"
                        className={styles.moduleToggle}
                        aria-expanded={open}
                        onClick={() => setOpenIndex(open ? -1 : idx)}
                      >
                        <div className={styles.moduleTitle}>{mod.title}</div>
                        <div className={styles.moduleSummary}>{mod.summary}</div>
                        <span className={styles.moduleChevron} aria-hidden="true">{open ? '▾' : '▸'}</span>
                      </button>
                      {open && (
                        <div className={styles.moduleBody}>
                          <ul>
                            {mod.bullets.map((bullet, bIdx) => (
                              <li key={bIdx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.priceCard}>
              <div className={styles.cardThumbnail}>
                <img src={thumbnailPath} alt={course.title} className={styles.cardImage} />
              </div>

              <div className={styles.compactInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Duration</span>
                  <span className={styles.infoValue}>{course.duration} months</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Rating</span>
                  <span className={styles.infoValue}>⭐ {course.rating} ({course.ratingsCount})</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Instructor</span>
                  <span className={styles.infoValue}>{primaryTrainerName}</span>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.priceHeader}>
                <div className={styles.priceOption}>
                  <div className={styles.priceLabel}>Full Payment</div>
                  <div className={styles.currentPrice}>{formatPrice(price)}</div>
                  <div className={styles.priceRow}>
                    <div className={styles.originalPrice}>{formatPrice(oldPrice)}</div>
                    {pct > 0 && <div className={styles.discount}>{pct}% off</div>}
                  </div>
                </div>
                
                <div className={styles.priceOption}>
                  <div className={styles.priceLabel}>Easy Installments</div>
                  <div className={styles.installmentPrice}>{formatPrice(Math.ceil(price / installmentMonths))}<span className={styles.perMonth}>/month</span></div>
                  <div className={styles.installmentNote}>{installmentMonths} monthly payments</div>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href={`/courses/${course.slug}/enroll`} className={styles.primaryButton}>Enroll now</Link>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.includes}>
                <h3 className={styles.includesTitle}>This course includes:</h3>
                <ul className={styles.includesList}>
                  <li>
                    <svg className={styles.includeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    <span>Lifetime access</span>
                  </li>
                  <li>
                    <svg className={styles.includeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                  <li>
                    <svg className={styles.includeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Community support</span>
                  </li>
                  <li>
                    <svg className={styles.includeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span>Progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section className={styles.trainerSection}>
      <div className={styles.container}>
        <h2 className={styles.trainerSectionHeading}>Meet Your Trainers</h2>
        <div className={styles.trainerGrid}>
          {trainers.map((trainer) => (
            <div className={styles.trainerCard} key={trainer.name}>
              <div className={styles.trainerContent}>
                <div className={styles.trainerText}>
                  <div className={styles.trainerHeader}>
                    <div className={styles.trainerAvatar}>
                      {trainer.image ? (
                        <img src={trainer.image} alt={trainer.name} />
                      ) : (
                        <span>{trainer.name?.[0] || 'T'}</span>
                      )}
                    </div>
                    <div>
                      <p className={styles.trainerLabel}>About the trainer</p>
                      <div className={styles.trainerNameRow}>
                        <h3 className={styles.trainerName}>{trainer.name}</h3>
                        <div className={styles.trainerSocials}>
                          <a
                            href={trainer.socials?.github || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.socialLink}
                            aria-label={`GitHub profile of ${trainer.name}`}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.94c.58.11.8-.25.8-.56l-.01-2.02c-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.26 1.2-3.06-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11 11 0 0 1 5.8 0c2.2-1.48 3.17-1.17 3.17-1.17.64 1.58.24 2.75.12 3.04.75.8 1.2 1.81 1.2 3.06 0 4.41-2.69 5.38-5.25 5.66.42.36.8 1.07.8 2.16l-.01 3.2c0 .31.22.68.81.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                            </svg>
                          </a>
                          <a
                            href={trainer.socials?.linkedin || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.socialLink}
                            aria-label={`LinkedIn profile of ${trainer.name}`}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5Zm-.9 6.26h3.8v11.01h-3.8V9.76Zm6.48 0h3.64v1.5h.05c.51-.96 1.77-1.97 3.64-1.97 3.89 0 4.61 2.56 4.61 5.88v6.1h-3.8v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5h-3.8V9.76Z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={styles.trainerBio}>{trainer.bio}</p>
                  <div className={styles.trainerHighlights}>
                    {trainer.highlights.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                {trainer.image && (
                  <div className={styles.trainerPhoto}>
                    <img src={trainer.image} alt={trainer.name} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {recommendedCourses.length > 0 && (
      <section className={styles.recoSection}>
        <div className={styles.container}>
          <div className={styles.recoHeader}>
            <h2>Recommended courses</h2>
            <p>Continue your path with related programs tailored for you.</p>
          </div>
          <div className={styles.recoGrid}>
            {recommendedCourses.map((c) => {
              const { price: recPrice, oldPrice: recOld } = computePrices(c.duration);
                const recMonths = Math.max(1, Number(c.duration) || 1);
              return (
                <article key={c.slug} className={styles.recoCard}>
                  <Link href={`/courses/${c.slug}`} className={styles.recoCardLink}>
                    <div className={styles.recoBody}>
                      <div className={styles.recoTopRow}>
                        {c.tags?.includes('Bestseller') ? (
                          <span className={styles.badgeInline}>Bestseller</span>
                        ) : (
                          <span className={styles.programPill}>
                            {c.duration >= 12 ? 'Diploma' : c.duration >= 6 ? 'Advanced' : 'Certification'}
                          </span>
                        )}
                        <span className={styles.recoDuration}>{c.duration} months</span>
                      </div>

                      <h3 className={styles.recoTitle}>{c.title}</h3>
                      <p className={styles.recoAuthor}>{c.author}</p>

                      <div className={styles.recoRatingRow}>
                        <span className={styles.ratingStar}>★</span>
                        <span className={styles.recoRatingValue}>{c.rating}</span>
                        <span className={styles.recoRatingCount}>({c.ratingsCount})</span>
                      </div>

                      <div className={styles.recoPriceRow}>
                        <span className={styles.recoPrice}>{formatPrice(recPrice)}</span>
                        <span className={styles.recoOldPrice}>{formatPrice(recOld)}</span>
                        <span className={styles.recoInstallment}>or {formatPrice(Math.ceil(recPrice / recMonths))}/month</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    )}
    </>
  );
}
