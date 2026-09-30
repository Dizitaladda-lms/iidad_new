"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.css";

/**
 * ScrollReveal Component
 * Smoothly animates content into view as user scrolls down the page.
 * Uses IntersectionObserver for 60fps+ hardware-accelerated animations.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {('fade-up'|'fade-down'|'fade-left'|'fade-right'|'zoom-in'|'fade-in')} [props.animation='fade-up'] - Animation variant
 * @param {number} [props.duration=0.8] - Duration in seconds
 * @param {number} [props.delay=0] - Initial delay in seconds
 * @param {number} [props.threshold=0.1] - IntersectionObserver threshold (0 to 1)
 * @param {string} [props.rootMargin='0px 0px -50px 0px'] - IntersectionObserver root margin
 * @param {boolean} [props.once=true] - Only trigger animation once
 * @param {boolean} [props.stagger=false] - Whether to stagger child elements
 * @param {number} [props.staggerDelay=0.1] - Delay between staggered children (seconds)
 * @param {string} [props.className=''] - Extra classes
 * @param {React.CSSProperties} [props.style={}] - Inline styles
 * @param {string} [props.as='div'] - Element tag to render
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  stagger = false,
  staggerDelay = 0.12,
  className = "",
  style = {},
  as: Component = "div",
  ...props
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    // SSR or no IntersectionObserver fallback
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    // Check if element is already within viewport on initial load
    const rect = node.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      setIsVisible(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  // Apply stagger delay to direct children if stagger=true
  useEffect(() => {
    if (!stagger || !ref.current) return;
    const childrenNodes = ref.current.querySelectorAll("[data-reveal-child]");
    childrenNodes.forEach((child, index) => {
      child.style.setProperty("--child-delay", `${delay + index * staggerDelay}s`);
    });
  }, [stagger, delay, staggerDelay, children]);

  const animStyle = styles[animation] || styles["fade-up"];
  const stateClass = isVisible ? styles.visible : styles.hidden;

  return (
    <Component
      ref={ref}
      className={`${styles.revealWrapper} ${animStyle} ${stateClass} ${className}`}
      style={{
        "--reveal-duration": `${duration}s`,
        "--reveal-delay": `${delay}s`,
        ...style,
      }}
      data-stagger={stagger ? "true" : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
