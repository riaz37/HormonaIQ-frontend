import Nav from "@/app/components/landing/Nav";
import Hero from "@/app/components/landing/Hero";
import OraSection from "@/app/components/landing/OraSection";
import HowItWorks from "@/app/components/landing/HowItWorks";
import ConditionsSection from "@/app/components/landing/ConditionsSection";
import PrivacySection from "@/app/components/landing/PrivacySection";
import SocialProof from "@/app/components/landing/SocialProof";
import FAQSection from "@/app/components/landing/FAQSection";
import DownloadCTA from "@/app/components/landing/DownloadCTA";
import Footer from "@/app/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <OraSection />
        <HowItWorks />
        <ConditionsSection />
        <PrivacySection />
        <SocialProof />
        <FAQSection />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
