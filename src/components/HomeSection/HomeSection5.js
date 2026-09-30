import styles from "./homeSection5.module.css";

function PillArrow({ size = 120 }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 60"
      fill="none"
      className={styles.pillArrow}
    >
      {/* Blue pill shape */}
      <rect x="10" y="5" width="90" height="50" rx="25" fill="#6278ed" />
      {/* Black circle + glowing + rotated arrow */}
      <g className={styles.circleGroup}>
        <circle
          cx="38"
          cy="30"
          r="22"
          fill="#111"
          className={styles.circleGlow}
        />
        <path
          d="M32 36 L38 30 L44 36 M38 30 V43"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.arrowPath}
        />
      </g>
    </svg>
  );
}

const cards = [
  {
    title: "Industry-Ready",
    desc: "Curriculum designed with industry experts to ensure you're job-ready from day one.",
  },
  {
    title: "Hands-On Learning",
    desc: "Real projects, live briefs, and practical assignments that build your portfolio.",
  },
  {
    title: "Expert Faculty",
    desc: "Learn from experienced professionals who bring years of industry expertise to the classroom.",
  },
  {
    title: "Modern Tools",
    desc: "Master the latest design and development tools used by leading companies worldwide.",
  },
  {
    title: "Career Support",
    desc: "Dedicated placement assistance and career guidance to help you land your dream job.",
  },
  {
    title: "Flexible Learning",
    desc: "Choose from full-time, part-time, and online learning options that fit your schedule.",
  },
];

export default function HomeSection5() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>
        Why Choose <span className={styles.webflow}>IIDAD</span>
      </h2>
      <div className={styles.grid}>
        {cards.map((card, i) => (
          <div className={styles.card} key={card.title + i} data-reveal-child="">
            <div className={styles.pillArrowWrapper}>
              <PillArrow size={120} />
            </div>
            <div className={styles.cardTitle}>{card.title}</div>
            <div className={styles.cardDesc}>{card.desc}</div>
          </div>
        ))}
      </div>
      <div className={styles.ctaBar}>
        <span className={styles.ctaMain}>Choose the Skill That Gets You Hired</span>
        <span className={styles.ctaSub}>Not sure? We’ll guide you.</span>
      </div>
      <div className={styles.ctaButtons}>
        <button className={`${styles.primaryBtn} demoButtonForm`}>Reserve Your Seat Before It’s Gone</button>
        <button className={`${styles.ghostBtn} demoButtonForm`}>Help Me Choose the Right Course</button>
      </div>
    </section>
  );
}
