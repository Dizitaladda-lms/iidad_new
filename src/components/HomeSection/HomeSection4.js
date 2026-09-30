import styles from "./homeSection4.module.css";

const cardData = [
  {
    video: "/image-vid/flying secoya_1 (1).mp4",
    label: "UI/UX Design Program",
    source: "Design Excellence",
  },
  {
    video: "/image-vid/Weem_1.mp4",
    label: "Web Development",
    source: "Code & Create",
  },
  {
    video: "/image-vid/Lemlist_1.mp4",
    label: "Graphic Design",
    source: "Visual Arts",
  },
  {
    video: "/image-vid/LGM_1.mp4",
    label: "Product Design",
    source: "Innovation Lab",
  },
];

export default function HomeSection4() {
  return (
    <section className={styles.section4}>
      <h2 className={styles.heading}>
        Comprehensive Programs<br />
        For Your Creative Career
      </h2>
      <div className={styles.ctaButtons}>
        <button className={`${styles.primaryBtn} demoButtonForm`}>Reserve Your Seat</button>
        <button className={`${styles.ghostBtn} demoButtonForm`}>Lock Your Price Today</button>
      </div>
      <div className={styles.cardsGrid}>
        {cardData.map((card, idx) => (
          <div key={card.label + idx} className={styles.cardItem} data-reveal-child="">
            <div className={styles.cardImgBox}>
              <video
                src={card.video}
                className={styles.cardImg}
                loop
                muted
                autoPlay
                playsInline
              />
            </div>
            <div className={styles.cardLabelSourceRow}>
              <span className={styles.cardLabel}>{card.label}</span>
              <span className={styles.cardSource}>{card.source}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
