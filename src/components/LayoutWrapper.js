"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalStructuredData from "@/components/GlobalStructuredData";
import GoogleTranslateScript from "@/components/layout/GoogleTranslateScript";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes: no header/footer
    return <>{children}</>;
  }

  // Regular routes: show header and footer
  return (
    <>
      <GoogleTranslateScript />
      <GlobalStructuredData />
      <Header />
      <div data-scroll-container>
        {children}
      </div>
      <Footer />
    </>
  );
}
