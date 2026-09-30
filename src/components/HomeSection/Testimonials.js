import styles from "./testimonials.module.css";

const testimonials = [
  {
    name: "Ananya Mehra",
    title: "Product Designer, Berlin",
    quote:
      "I walked into IIDAD with imposter syndrome and left with a portfolio that finally felt like me. The mentor critiques were sharp, actionable, and kind.",
    badge: "Career switch",
    score: "Hired in 6 weeks",
    cohort: "Cohort 2024",
  },
  {
    name: "Ravi Kulkarni",
    title: "Full-Stack Engineer, Bengaluru",
    quote:
      "The studio sprints forced me to design, code, and pitch under real constraints. It mirrors client work so closely that onboarding at my new role was easy.",
    badge: "Studio sprint",
    score: "3 shipped demos",
    cohort: "Advanced Track",
  },
  {
    name: "Sophia Martins",
    title: "Brand Strategist, Lisbon",
    quote:
      "IIDAD pulled me out of the template trap. We prototyped unusual formats, tested with actual users, and the feedback loop was immediate.",
    badge: "Research first",
    score: "+42% engagement",
    cohort: "Brand Lab",
  },
];

export default function HomeSection3() {
  return (
    <section
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
      id="testimonials"
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.lede}>
        <p className={styles.kicker}>People-first outcomes</p>
        <h2 id="testimonials-title" className={styles.heading}>
          Stories from the IIDAD community
        </h2>
        <p className={styles.description}>
          Curated notes from learners who tested bold ideas, shipped real work,
          and grew in public with mentors who tell it straight.
        </p>
        <div className={styles.statRow}>
          <span className={styles.statChip}>98% project completion</span>
          <span className={styles.statChip}>Global cohorts in 12 cities</span>
          <span className={styles.statChip}>Mentors from product teams</span>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {testimonials.map((item) => (
          <article key={item.name} className={styles.card} data-reveal-child="">
            <div className={styles.cardHeader}>
              <div className={styles.initial}>{item.name.charAt(0)}</div>
              <div className={styles.meta}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.title}>{item.title}</p>
              </div>
              <span className={styles.badge}>{item.badge}</span>
            </div>
            <p className={styles.quote}>{item.quote}</p>
            <div className={styles.cardFooter}>
              <span className={styles.score}>{item.score}</span>
              <span className={styles.cohort}>{item.cohort}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
