import styles from "./campusSection.module.css";

const campusShots = [
  { src: "/center/IMG_4066.webp", label: "Reception" },
  { src: "/center/IMG_4072.webp", label: "Collab lounge" },
  { src: "/center/IMG_4076.webp", label: "Design studio" },
  { src: "/center/IMG_4077.webp", label: "Learning bays" },
  { src: "/center/IMG_4078.webp", label: "Workshop zone" },
  { src: "/center/IMG_4081.webp", label: "Breakout" },
  { src: "/center/IMG_4068.webp", label: "Mentor pod" },
  { src: "/center/IMG_4071.webp", label: "Library nook" },
  { src: "/center/7.webp", label: "Studio hall" },
];

export default function CampusSection() {
  return (
    <section className={styles.wrapper} id="campus">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Our campus</p>
          <h2 className={styles.heading}>Built for making and mentoring</h2>
          <p className={styles.body}>
            Acoustic-treated studios, breakouts for quick huddles, and dedicated bays for
            sprints and critiques. Visit to see how we learn, prototype, and film demos.
          </p>
          <div className={styles.ctaRow}>
            <span className={styles.ctaMain}>See how we take you from beginner to job-ready</span>
            <span className={styles.ctaSub}>Structured. Simple. Effective.</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>Greater Kailash center</span>
            <span className={styles.metaChip}>Book a tour any day</span>
            <span className={styles.metaChip}>Labs, lounge, library</span>
          </div>
          <div className={styles.ctaButtons}>
            <button className={`${styles.primaryBtn} demoButtonForm`}>Book a Campus Tour</button>
          </div>
        </div>

        <div className={styles.grid}>
          {campusShots.map((shot) => (
            <figure key={shot.src} className={styles.card} data-reveal-child="">
              <div className={styles.imageWrap}>
                <img src={shot.src} alt={shot.label} className={styles.image} loading="lazy" />
                <div className={styles.tag}>{shot.label}</div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
