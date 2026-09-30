import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/styles/blog.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import HomeLoaderGate from '@/components/HomeLoaderGate'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.iidad.com'),
  title: {
    default: "Best Institute for Web Development | Create Sites with Confidence"
  },
  alternates: {
    canonical: "https://www.iidad.com/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/g10.png", type: "image/png" },
    ],
    apple: [{ url: "/g10.png", type: "image/png" }],
  },
  description: "If you want a career in tech, learn from the best institute for web development. Our website development course turns beginners into confident creators.",
  keywords: [
    "IIDAD",
    "Indian Institute of Design and Development",
    "website development course",
    "web development institute near me",
    "complete web development course",
    "mern stack course with placement",
    "best institute for web development",
    "advanced web development course",
    "web development courses",
    "mern course",
    "software development courses",
    "full stack development course",
    "best web development courses",
    "online web development courses",
    "front end development course",
    "web development classes",
    "mern stack course",
    "web development courses near me",
    "web design and development course",
    "web development full course",
    "stack development course",
    "full stack development course near me"
  ],
  authors: [{ name: "IIDAD" }],
  creator: "Indian Institute of Design and Development",
  publisher: "IIDAD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "IIDAD - Indian Institute of Design and Development",
    title: "Best Institute for Web Development | Create Sites with Confidence",
    description: "If you want a career in tech, learn from the best institute for web development. Our website development course turns beginners into confident creators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IIDAD - Indian Institute of Design and Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Institute for Web Development | Create Sites with Confidence",
    description: "If you want a career in tech, learn from the best institute for web development. Our website development course turns beginners into confident creators.",
    images: ["/thumbnail.png"],
    creator: "@iidad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "vH6KNeXsutpF-7H3D_MjaV7-2541kGVQRPxIfn4n9zI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="gtm"
          strategy="beforeInteractive"
        >{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TPJDM95C');`}</Script>

 

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPJDM95C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <LayoutWrapper>
          <HomeLoaderGate>
            {children}
          </HomeLoaderGate>
        </LayoutWrapper>
      </body>
    </html>
  );
}
