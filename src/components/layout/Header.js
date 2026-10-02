"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import CountrySelector from "./CountrySelector";
import "./header.css";

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const menus = document.querySelectorAll(".delay-dropdown");
    const handlers = [];

    menus.forEach((menu) => {
      let hideTimer;
      const handleMouseEnter = () => {
        clearTimeout(hideTimer);
        menu.classList.add("open-now");
      };
      const handleMouseLeave = () => {
        hideTimer = setTimeout(() => {
          menu.classList.remove("open-now");
        }, 200);
      };

      menu.addEventListener("mouseenter", handleMouseEnter);
      menu.addEventListener("mouseleave", handleMouseLeave);

      handlers.push({ menu, handleMouseEnter, handleMouseLeave });
    });

    // Cleanup on unmount
    return () => {
      handlers.forEach(({ menu, handleMouseEnter, handleMouseLeave }) => {
        menu.removeEventListener("mouseenter", handleMouseEnter);
        menu.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <header ref={headerRef} className="header">
      <nav className="nav">
        {/* Country & Language Selector */}
        <CountrySelector />
        
        <div className="divider"></div>

        {/* Courses link - direct to /courses (no dropdown) */}
        <div className="dropdown-wrapper">
          <Link href="/courses" className="nav-btn">
            Our Courses
          </Link>
        </div>

        <div className="menu-wrapper">
          <Link href="/" className="menu-btn">
            Home
          </Link>
        </div>
        <div className="divider"></div>
        {/* Contact Button (link to contact page) */}
        <Link href="/contact-us" className="contact-btn">
          <div className="circle">
            <span className="arrow">→</span>
          </div>
          <span className="contact-text">Contact</span>
        </Link>
      </nav>
    </header>
  );
}
