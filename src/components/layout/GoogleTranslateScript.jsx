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
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
}
