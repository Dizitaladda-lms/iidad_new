"use client";

import React, { useEffect, useState } from "react";

/**
 * Interactive cursor spotlight effect.
 * Smoothly follows mouse movement with ambient glow (Linear/Stripe style).
 */
export default function MouseSpotlight() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only enable on pointer/mouse devices, not mobile touchscreens
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    let rafId = null;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const onPointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      // Smooth interpolation for silky lag-free movement
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      document.documentElement.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`);

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        rafId = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
        background: `radial-gradient(650px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(159, 255, 139, 0.08), rgba(98, 120, 237, 0.04) 40%, transparent 80%)`,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
