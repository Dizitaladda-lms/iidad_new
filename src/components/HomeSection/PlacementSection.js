import styles from "./placementSection.module.css";

const stats = [
  {
    value: "96%",
    label: "Placement success",
    detail: "Learners securing interviews within 90 days of graduating.",
  },
  {
    value: "120+",
    label: "Hiring touchpoints",
    detail: "Product teams, agencies, and startups interviewing our talent bench.",
  },
  {
    value: "INR 9.8 LPA",
    label: "Average package",
    detail: "Across design and development cohorts placed through IIDAD.",
  },
  {
    value: "30 days",
    label: "Portfolio to interview",
    detail: "Typical timeline from final review to first interview invite.",
  },
];

const companies = [
  { name: "Razorpay", focus: "Fintech" },
  { name: "Freshworks", focus: "SaaS" },
  { name: "Swiggy", focus: "Product Design" },
  { name: "Meesho", focus: "Full-Stack Engineering" },
  { name: "CRED", focus: "Mobile & Growth" },
  { name: "PhonePe", focus: "Payments" },
  { name: "Zomato", focus: "Consumer Apps" },
  { name: "Flipkart", focus: "E-commerce" },
];

export default function PlacementSection() {
  return (
    <section className={styles.wrapper} id="placements">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copyColumn}>
          <p className={styles.kicker}>Placements & companies</p>
          <h2 className={styles.heading}>
            See Where Our Students Are Working
          </h2>
          <p className={styles.body}>
            We focus on placement, not just completion. Career coaches, portfolio sprints,
            and employer showcases help you convert offers faster.
          </p>
          <div className={styles.statsGrid}>
            {stats.map((item) => (
              <div key={item.label} className={styles.statCard} data-reveal-child="">
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statDetail}>{item.detail}</span>
              </div>
            ))}
          </div>
          <div className={styles.ctaButtons}>
            <button className={`${styles.primaryBtn} demoButtonForm`}>Book My Free Counseling Call</button>
            <button className={styles.ghostBtn}>See Our Latest Placements</button>
          </div>
        </div>

        <div className={styles.partnerPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.kicker}>Alumni placements</p>
              <h3 className={styles.subheading}>Where our learners now build</h3>
            </div>
            <span className={styles.tag}>Verified offers | 2024-25</span>
          </div>

          <div className={styles.partnerGrid}>
            {companies.map((company) => (
              <div key={company.name} className={styles.partnerCard}>
                <div className={styles.avatar}>{company.name.charAt(0)}</div>
                <div className={styles.partnerMeta}>
                  <span className={styles.partnerName}>{company.name}</span>
                  <span className={styles.partnerFocus}>{company.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
