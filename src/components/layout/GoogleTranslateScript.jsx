"use client";

import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Safety patch for React DOM reconciliation + Google Translate DOM mutations
    if (typeof window !== "undefined" && !window.__google_translate_patched) {
      window.__google_translate_patched = true;

      if (typeof Node !== "undefined" && Node.prototype) {
        const originalRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function (child) {
          if (child.parentNode !== this) {
            if (child.parentNode) {
              return child.parentNode.removeChild(child);
            }
            return child;
          }
          return originalRemoveChild.apply(this, arguments);
        };

        const originalInsertBefore = Node.prototype.insertBefore;
        Node.prototype.insertBefore = function (newNode, referenceNode) {
          if (referenceNode && referenceNode.parentNode !== this) {
            if (referenceNode.parentNode) {
              return referenceNode.parentNode.insertBefore(newNode, referenceNode);
            }
            return newNode;
          }
          return originalInsertBefore.apply(this, arguments);
        };
      }
    }

    // Add Google Translate script if not present
    if (typeof window !== "undefined" && !document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Continuously suppress Google Translate banner frame and body top offset
    const hideBanner = () => {
      if (typeof document !== "undefined") {
        document.body.style.top = "0px";
        document.body.style.position = "static";
        document.documentElement.style.top = "0px";

        const banners = document.querySelectorAll(
          ".goog-te-banner-frame, iframe.goog-te-banner-frame, iframe.skiptranslate, .VIpgJd-yDsffb-Lg26de, #goog-gt-tt"
        );
        banners.forEach((b) => {
          if (b) {
            b.style.display = "none";
            b.style.visibility = "hidden";
            b.style.height = "0px";
            b.style.width = "0px";
            b.style.opacity = "0";
            b.style.pointerEvents = "none";
          }
        });
      }
    };

    hideBanner();
    const interval = setInterval(hideBanner, 300);

    return () => clearInterval(interval);
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
}
