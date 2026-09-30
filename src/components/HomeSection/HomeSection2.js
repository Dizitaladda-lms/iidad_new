
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
        <div className={styles.videoWrapper}>
          <img
            src="/teamIIDAD.png"
            alt="Team IIDAD"
            className={styles.showcaseImage}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
