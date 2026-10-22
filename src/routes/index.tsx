import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { Nav } from "@/components/site/Nav";
import { Hero, Marquee } from "@/components/site/Hero";
import {
  Intro,
  Services,
  Portfolio,
  Quality,
  Process,
  Why,
  About,
  Testimonials,
  Contact,
  FinalCta,
  Footer,
} from "@/components/site/Sections";
import { Enquiry } from "@/components/site/EnquiryForm";
import { EnquiryModal } from "@/components/site/EnquiryModal";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { MaintenanceScreen } from "@/components/site/MaintenanceScreen";
import { initGlobalClickTracking } from "@/lib/analytics";
import { adminStore, DEFAULT_SETTINGS } from "@/lib/adminStore";

const title = "WebNoura by Karan | Website Design & Development";
const description =
  "WebNoura by Karan designs modern, responsive websites for businesses, hotels, restaurants, gyms, and personal brands. Explore website concepts and enquire about your project.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    setMounted(true);
    adminStore.checkAndMigrateStore();
    setSettings(adminStore.getSettings());
    initGlobalClickTracking();

    const handleUpdate = () => {
      setSettings(adminStore.getSettings());
    };
    window.addEventListener("webnoura_store_change", handleUpdate);
    return () => window.removeEventListener("webnoura_store_change", handleUpdate);
  }, []);

  // If website is turned off / under maintenance
  if (mounted && !settings.websiteOnline) {
    return <MaintenanceScreen settings={settings} />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <Services />
        <Portfolio />
        <Quality />
        <Process />
        <Why />
        <Testimonials />
        <About />
        <Enquiry />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <EnquiryModal />
      <WhatsAppFloat
        phoneNumber={settings.whatsapp || "919463737763"}
        instagramUrl={settings.instagram || "https://www.instagram.com/webnoura.site?xtok=MWNhaTBoZ2NncXJxNA=="}
      />
    </MotionConfig>
  );
}
