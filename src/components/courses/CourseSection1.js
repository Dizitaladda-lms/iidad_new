// CourseSection1.js
"use client"
import React, { useEffect, useRef } from 'react';
import styles from './courseSection1.module.css';

const CourseSection1 = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return;

    const images = Array.from(root.querySelectorAll('img'));
    if (images.length === 0) {
      window.dispatchEvent(new CustomEvent('courseSection1:loaded'));
      return;
    }

    let remaining = images.length;
    const onLoaded = () => {
      remaining -= 1;
      if (remaining <= 0) {
        window.dispatchEvent(new CustomEvent('courseSection1:loaded'));
      }
    };

    const listeners = [];
    images.forEach((img) => {
      if (img.complete) {
        onLoaded();
        return;
      }
      const onLoad = () => onLoaded();
      const onError = () => onLoaded();
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);
      listeners.push([img, onLoad, onError]);
    });

    return () => {
      listeners.forEach(([img, onLoad, onError]) => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      });
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.heroSection}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.leftContent}>
          <div className={styles.logo}>
            <img 
              src="/g10.png" 
              alt="IIDAD Logo"
            />
          </div>

          <h1 className={styles.heading}>
            Achieve your career goals with iidad
          </h1>

          <p className={styles.subtitle}>
            Subscribe to build job-ready skills from world-class institutions.
          </p>

          <p className={styles.pricing}>
            ₹2,099/month, cancel anytime
          </p>

          <button className={`${styles.ctaButton} ${styles.demoButtonForm} demoButtonForm`}>
            Start 7-day Free Trial
          </button>

          <p className={styles.guarantee}>
            best courses at affordable prices
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightContent}>
          <div className={styles.graphicWrapper}>
            <img
              src="/uploads/graphic (1).png"
              alt="IIDAD Typography"
              className={styles.bgGraphic}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseSection1;