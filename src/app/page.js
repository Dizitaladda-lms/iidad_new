export const metadata = {
  alternates: {
    canonical: "https://www.iidad.com/",
  },
};
import HomeSection1 from "@/components/HomeSection/HomeSection1";
import HomeSectionDegreePrograms from "@/components/HomeSection/HomeSectionDegreePrograms";
import HomeSection2 from "@/components/HomeSection/HomeSection2";
import TestimonialsV2 from "@/components/HomeSection/TestimonialsV2";
import HomeSection3 from "@/components/HomeSection/HomeSection3";
import HomeSection4 from "@/components/HomeSection/HomeSection4";
import Homesection5 from "@/components/HomeSection/HomeSection5";
import HomeSection6 from "@/components/HomeSection/HomeSection6";
import HomeSection7 from "@/components/HomeSection/HomeSection7";
import PlacementSection from "@/components/HomeSection/PlacementSection";
import CampusSection from "@/components/HomeSection/CampusSection";
import HomeBlogSection from "@/components/HomeSection/HomeBlogSection";
import CourseSection2 from '@/components/courses/CourseSection2';
import AudioMarquee from '@/components/AudioMarquee';
import Testimonials from '@/components/HomeSection/Testimonials';
import DemoBookingModal from "@/components/DemoBookingModal";
import FloatingContactPanel from "@/components/FloatingContactPanel";
export default function Home() {
  return (
    <main>
      {[
        {
          "@context": "https://schema.org/",
          "@type": "WebSite",
          "name": "iidad",
          "url": "https://www.iidad.com/",
          "potentialAction": {
            "@type": "SearchAction",
            // Must be a URL template; keeping your placeholder and making it valid
            "target": "https://www.iidad.com/?s={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          "name": "IIDAD",
          "alternateName": "indian institute of design and development",
          "url": "https://www.iidad.com/",
          "logo": "https://www.iidad.com/g10.png",
          "sameAs": [
            "https://www.facebook.com/people/IIDAD/61581261069736",
            "https://www.instagram.com/iidad_officials/",
            "https://www.iidad.com/",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Which is the best web development course at IIDAD for beginners?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The best web development course at IIDAD for beginners is the Full Web Development Course, because it starts from absolute basics and moves step by step. Students first learn HTML and CSS, then JavaScript, and finally work on real websites and projects. This course is ideal for students after 12th, college students, and working professionals with no coding background.",
              },
            },
            {
              "@type": "Question",
              "name": "Why is IIDAD one of the best web development institutes in Delhi?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "IIDAD is considered one of the best web development institutes in Delhi because it focuses on practical learning, live projects, and simple teaching methods. Instead of only theory, students learn by building real websites. IIDAD also provides career guidance and placement assistance, which helps students start their careers confidently.",
              },
            },
            {
              "@type": "Question",
              "name": "What does a web developer actually do?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A web developer designs, builds, and maintains websites and web applications. This includes writing code, creating page layouts, fixing bugs, improving website speed, and making websites mobile-friendly. Web developers also ensure that websites work properly on different browsers and devices.",
              },
            },
            {
              "@type": "Question",
              "name": "What is the salary of a beginner web developer in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A beginner web developer in India usually earns between ₹3 LPA to ₹6 LPA, depending on skills, projects, and company size. Developers with strong practical knowledge and good portfolios often get better salary packages even as freshers.",
              },
            },
            {
              "@type": "Question",
              "name": "How quickly can I learn web development at IIDAD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "At IIDAD, most students understand the basics of web development within 2–3 months. With regular practice, assignments, and projects, students can become job-ready in 5–6 months. Learning speed depends on practice consistency and interest.",
              },
            },
            {
              "@type": "Question",
              "name": "Is web development a good career in 2026?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, web development is a very good career choice in 2026. Businesses, startups, and companies of all sizes need websites and web applications. Skilled web developers are in high demand, and opportunities exist in jobs, freelancing, and remote work.",
              },
            },
            {
              "@type": "Question",
              "name": "Do I need coding experience before joining IIDAD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, you do not need any prior coding experience. IIDAD web development courses are specially designed for complete beginners. Trainers explain concepts in a simple way, making it easy for anyone to learn.",
              },
            },
            {
              "@type": "Question",
              "name": "Does IIDAD provide practical training and real projects?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, IIDAD focuses heavily on practical training. Students work on real-world projects such as business websites, landing pages, and web applications. This practical exposure helps students gain confidence and industry-ready skills.",
              },
            },
            {
              "@type": "Question",
              "name": "Can I get a job after completing a web development course from IIDAD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, many students get entry-level web developer jobs after completing courses from IIDAD. The institute provides resume building, interview preparation, and placement assistance, which helps students prepare for job opportunities.",
              },
            },
            {
              "@type": "Question",
              "name": "Will AI replace web developers?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI will not replace web developers, but it will change how developers work. Developers who learn modern tools, frameworks, and AI-assisted development will have more career opportunities and better productivity.",
              },
            },
          ],
        },
        {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "iidad",
          "image": "https://www.iidad.com/courseThumbnail/diploma/FULLSTACK%20DEVELOPMENT%2012months.png",
          "brand": {
            "@type": "Brand",
            "name": "IIDAD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "4.5",
            "ratingCount": "10487",
          },
        },
      ].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <DemoBookingModal />
      <HomeSection1 />
      <HomeSectionDegreePrograms />
      <HomeSection2 />
      <HomeSection3 />
      <CourseSection2 variant="home" />
      <Testimonials/>
      <PlacementSection />
      <CampusSection />
      <HomeBlogSection />
      <HomeSection4 />
      <Homesection5 />
      <HomeSection7 />
      <HomeSection6 />
      <FloatingContactPanel />
    </main>
  );
}
