/**
 * Structured Data Component for SEO
 * Provides JSON-LD schema markup for better search engine understanding
 */

"use client";

export default function StructuredData({ type = "organization" }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Indian Institute of Design and Development",
    "alternateName": "IIDAD",
    "url": "https://www.iidad.com",
    "logo": "https://www.iidad.com/g10.png",
    "description": "Become a confident developer with our full stack developer course. Learn front-end, back-end, and tools used by real professionals in today's tech world.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressLocality": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Admissions",
      "telephone": "+91-9205435653",
      "email": "info@iidad.in"
    },
    "sameAs": [
      "https://www.facebook.com/people/Indian-Institute-of-design-and-development-IIDAD/61586102586145/",
      "https://www.instagram.com/iidad_officials"
    ],
    "areaServed": "IN",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IIDAD - Indian Institute of Design and Development",
    "url": "https://www.iidad.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.iidad.com/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.iidad.com"
      }
    ]
  };

  let schema;
  switch (type) {
    case "organization":
      schema = organizationSchema;
      break;
    case "website":
      schema = websiteSchema;
      break;
    case "breadcrumb":
      schema = breadcrumbSchema;
      break;
    default:
      schema = organizationSchema;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
