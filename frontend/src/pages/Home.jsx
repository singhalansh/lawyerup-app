import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesSection from "../components/Features";
import StepsSection from "../components/StepsSec";
import MissionSection from "../components/Mission";
import CTASection from "../components/CTA";
import Footer from "../components/Footer";
import ConsentPopup from "../components/ConsentPopup";

const HomePage = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem("userConsent");

    if (!hasConsented) {
      // Show consent popup immediately when page loads
      setShowConsent(true);
    }
  }, []);

  const handleConsentClose = (accepted = false) => {
    if (accepted) {
      localStorage.setItem("userConsent", "true");
    }
    setShowConsent(false);
  };

  return (
    <div className="w-full bg-white">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <StepsSection />
      <MissionSection />
      <CTASection />
      <Footer />

      <ConsentPopup isOpen={showConsent} onClose={handleConsentClose} />
    </div>
  );
};

export default HomePage;
