
"use client";
import React, { useRef } from 'react';
import styles from "./homeSection2.module.css";
import CounterNumber from "@/components/common/CounterNumber";

export default function HomeSection2() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className={styles.sectionWrapper}>
      <div className={styles.leftCol} data-reveal-child="">
        <h2 className={styles.bigTitle}>Innovation Through Education</h2>
        <p className={styles.heroDesc}>
            IIDAD Has Been Created About <span style={{color:"#57d773", fontWeight: 700}}><CounterNumber value="25" /></span> Thousand+ Developer in last <span style={{color:"#57d773", fontWeight: 700}}><CounterNumber value="12" /></span> Years between the Age of <span style={{color:"#57d773", fontWeight: 700}}>10</span> years to <span style={{color:"#57d773", fontWeight: 700}}>55</span> Years with Exellent Placement Rate With Average <span style={{color:"#57d773", fontWeight: 700}}><CounterNumber value="12" /></span> LPA Salary.</p>
        <div className={styles.ctaRow}>
          <span className={styles.ctaMain}>Why 25,000+ Learners Chose Us</span>
        </div>
        <div className={styles.ctaButtons}>
          <button className={`${styles.primaryBtn} demoButtonForm`}>Book My Free Counseling Call</button>
          <button className={`${styles.ghostBtn} demoButtonForm`}>Help Me Choose the Right Course</button>
        </div>
      </div>

      <div className={styles.rightCol} data-reveal-child="">
        <div className={styles.card3DWrapper}>
          {/* Ambient Glow Backdrop */}
          <div className={styles.glowBackdrop} aria-hidden="true" />
          
          {/* Glass Card Container */}
          <div className={styles.card3DBody}>
            {/* Background Branding Elements */}
            <div className={styles.cardWatermark}>iidad.</div>
            <div className={styles.cardBadge}>
              <span className={styles.badgeDot} /> Industry Lead Mentor
            </div>

            {/* Pop-out Trainer 3D Image */}
            <img
              src="/trainer_man.png"
              alt="IIDAD Senior Tech Mentor"
              className={styles.trainerImage3D}
              loading="eager"
            />

            {/* Bottom Info Floating Pill */}
            <div className={styles.floatingInfoPill}>
              <div className={styles.pillAvatar}>
                <span className={styles.pillStar}>★</span>
              </div>
              <div className={styles.pillTextGroup}>
                <span className={styles.pillTitle}>Senior Mentor</span>
                <span className={styles.pillSub}>Hands-On Mentorship &amp; Live Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
