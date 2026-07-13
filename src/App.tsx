import { useState, useEffect, useRef } from "react";
import Noise from "./components/Noise";
import SectionDivider from "./components/SectionDivider";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Guestbook from "./components/Guestbook";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import PortfolioChat from "./components/PortfolioChat";
import ZigzagScrollProgress from "./components/ZigzagScrollProgress";
import { ArrowUp } from "lucide-react";
import AdminContacts from "./components/AdminContacts";

const SECTION_IDS = [
  "hero",
  "projects",
  "stack",
  "contact",
  "guestbook",
] as const;

export default function App() {
  // No hooks in this component — safe to branch before anything runs.
  if (window.location.pathname === "/admin") {
    return <AdminContacts />;
  }
  return <PortfolioSite />;
}

function PortfolioSite() {
  const [activeSection, setActiveSection] = useState("hero");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Cache section elements once on mount — avoids getElementById on every scroll event
  const sectionEls = useRef<Array<{ id: string; el: HTMLElement }>>([]);

  useEffect(() => {
    sectionEls.current = SECTION_IDS.flatMap((id) => {
      const el = document.getElementById(id);
      return el ? [{ id, el }] : [];
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);

      const scrollPos = window.scrollY + 200;
      for (const { id, el } of sectionEls.current) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const triggerToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <div className="py-20 md:py-0 min-h-screen bg-white text-zinc-850 font-sans selection:bg-zinc-950 selection:text-white flex flex-col antialiased relative">
      {/* Animated Film Grain Overlay */}
      <Noise patternAlpha={4} patternRefreshInterval={3} />

      {/* Dynamic Toast System */}
      <Notification
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Floating Header */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Single Page Document */}
      <main className="flex-1 w-full bg-white relative">
        {/* Cinematic Section 1: Hero */}
        <Hero
          onNavigateToAbout={() => handleNavigate("experience")}
          onNavigateToContact={() => handleNavigate("contact")}
        />
        {/* zinc radial → white */}
        <SectionDivider variant="scallops" fill="var(--color-white)" />

        {/* Centerpiece Section 2: Projects (Mockups & Simulators) */}
        <Projects />
        {/* white → zinc-100 */}
        <SectionDivider variant="scallops" fill="var(--color-zinc-100)" />

        {/* Showcase Section 2: Tech Stack */}
        <TechStack />
        {/* white → white */}
        <SectionDivider variant="scallops" fill="var(--color-white)" />

        {/* Immersive Section 6: Contact Forms & Local Times */}
        <Contact
          onSuccessNotification={(msg) => triggerToast(msg, "success")}
        />

        {/* white → zinc-100 */}
        <SectionDivider variant="scallops" fill="var(--color-zinc-100)" />

        {/* Public Record Section 7: Guestbook Registry */}
        <Guestbook />
      </main>

      {/* zinc-100 → zinc-50 */}
      <SectionDivider variant="scallops" fill="var(--color-zinc-50)" />

      {/* Premium Minimal Footer */}
      <Footer />

      {/* Back to Top Floating Arrow */}
      {showBackToTop && (
        <button
          id="back-to-top"
          onClick={() => handleNavigate("hero")}
          className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 shadow-lg flex items-center justify-center text-zinc-650 hover:text-zinc-950 hover:border-zinc-300 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Recruiter Portfolio Chat Agent */}
      <PortfolioChat />

      {/* Zigzag Scroll Progress Indicator */}
      <ZigzagScrollProgress />
    </div>
  );
}