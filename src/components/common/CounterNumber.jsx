"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Animated Counter that counts up to a target number when in view.
 * Handles prefixes/suffixes (e.g. "96%", "120+", "INR 9.8 LPA", "25,000+").
 */
export default function CounterNumber({ value, duration = 1.8, className = "" }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    // Parse value: e.g. "96%" -> prefix="", number=96, suffix="%"
    // "120+" -> prefix="", number=120, suffix="+"
    // "INR 9.8 LPA" -> prefix="INR ", number=9.8, suffix=" LPA"
    // "25,000+" -> prefix="", number=25000, suffix="+"
    const strVal = String(value || "");
    const match = strVal.match(/^([^\d.]*)(\d+(?:,\d+)*(?:\.\d+)?)(.*)$/);

    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const rawNumStr = match[2].replace(/,/g, "");
    const isFloat = rawNumStr.includes(".");
    const targetNum = parseFloat(rawNumStr);
    const suffix = match[3] || "";
    const decimals = isFloat ? (rawNumStr.split(".")[1] || "").length : 0;
    const hasCommas = match[2].includes(",");

    // Initially show starting number 0
    setDisplayValue(`${prefix}${isFloat ? "0.0" : "0"}${suffix}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(node);

          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Ease out cubic: 1 - pow(1 - progress, 3)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = targetNum * easeProgress;

            let formattedNum = isFloat
              ? currentNum.toFixed(decimals)
              : Math.floor(currentNum).toString();

            if (hasCommas) {
              formattedNum = formattedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            setDisplayValue(`${prefix}${formattedNum}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Ensure exact target value at the end
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
