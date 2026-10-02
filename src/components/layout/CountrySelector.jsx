"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const COUNTRIES = [
  {
    id: "in-en",
    countryCode: "in",
    lang: "en",
    label: "India (English)",
    flag: "https://flagcdn.com/w40/in.png",
  },
  {
    id: "in-hi",
    countryCode: "in",
    lang: "hi",
    label: "India (हिन्दी)",
    flag: "https://flagcdn.com/w40/in.png",
  },
  {
    id: "us",
    countryCode: "us",
    lang: "en",
    label: "USA (English)",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    id: "gb",
    countryCode: "gb",
    lang: "en",
    label: "UK (English)",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    id: "es",
    countryCode: "es",
    lang: "es",
    label: "Spain (Español)",
    flag: "https://flagcdn.com/w40/es.png",
  },
  {
    id: "fr",
    countryCode: "fr",
    lang: "fr",
    label: "France (Français)",
    flag: "https://flagcdn.com/w40/fr.png",
  },
  {
    id: "de",
    countryCode: "de",
    lang: "de",
    label: "Germany (Deutsch)",
    flag: "https://flagcdn.com/w40/de.png",
  },
  {
    id: "jp",
    countryCode: "jp",
    lang: "ja",
    label: "Japan (日本語)",
    flag: "https://flagcdn.com/w40/jp.png",
  },
  {
    id: "ae",
    countryCode: "ae",
    lang: "ar",
    label: "UAE (العربية)",
    flag: "https://flagcdn.com/w40/ae.png",
  },
  {
    id: "cn",
    countryCode: "cn",
    lang: "zh-CN",
    label: "China (中文)",
    flag: "https://flagcdn.com/w40/cn.png",
  },
  {
    id: "ru",
    countryCode: "ru",
    lang: "ru",
    label: "Russia (Русский)",
    flag: "https://flagcdn.com/w40/ru.png",
  },
  {
    id: "br",
    countryCode: "br",
    lang: "pt",
    label: "Brazil (Português)",
    flag: "https://flagcdn.com/w40/br.png",
  },
  {
    id: "it",
    countryCode: "it",
    lang: "it",
    label: "Italy (Italiano)",
    flag: "https://flagcdn.com/w40/it.png",
  },
  {
    id: "kr",
    countryCode: "kr",
    lang: "ko",
    label: "South Korea (한국어)",
    flag: "https://flagcdn.com/w40/kr.png",
  },
];

export default function CountrySelector() {
  const [selected, setSelected] = useState(COUNTRIES[0]); // Default India (EN)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load saved country from localStorage
    const savedId = localStorage.getItem("iidad_selected_country");
    if (savedId) {
      const found = COUNTRIES.find((c) => c.id === savedId);
      if (found) {
        setSelected(found);
      }
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (country) => {
    setSelected(country);
    setIsOpen(false);

    // Save choice in localStorage
    localStorage.setItem("iidad_selected_country", country.id);

    // Set cookie for Google Translate
    const targetLang = country.lang;
    const cookieValue = `/en/${targetLang}`;

    // Set cookie on domain and path
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    if (window.location.hostname !== "localhost") {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname};`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    }

    // Trigger Google Translate frame if loaded, otherwise reload to reflect language
    const googleSelect = document.querySelector(".goog-te-combo");
    if (googleSelect) {
      googleSelect.value = targetLang;
      googleSelect.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="country-selector-wrapper notranslate" translate="no" ref={dropdownRef}>
      <button
        type="button"
        className="country-selector-btn notranslate"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Country"
      >
        <img
          src={selected.flag}
          alt={selected.label}
          className="country-flag-img notranslate"
        />
        <span className="country-btn-text notranslate">{selected.label}</span>
        <FaChevronDown className={`country-arrow ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <ul className="country-dropdown-list notranslate" translate="no">
          {COUNTRIES.map((country) => (
            <li
              key={country.id}
              className={`country-dropdown-item notranslate ${
                selected.id === country.id ? "active" : ""
              }`}
              onClick={() => changeLanguage(country)}
            >
              <img
                src={country.flag}
                alt={country.label}
                className="country-flag-img notranslate"
              />
              <span className="country-item-label notranslate">{country.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
