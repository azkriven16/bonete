import { useState, useEffect } from "react";
import { motion, Variants  } from "motion/react";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  CodeXml,
  FileDown,
} from "lucide-react";
import { HERO_DATA } from "../data";
import { SplitText, TiltCard } from "./ScrollAnimations";
import { useDarkMode } from "../hooks/useDarkMode";
import PixelBlast from "./PixelBlast";

const profilePic = "/images/openpeep-hero.png";

const CYCLING_WORDS = [
  "thoughtful",
  "beautiful",
  "scalable",
  "intentional",
  "impactful",
];

interface HeroProps {
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function Hero({
  onNavigateToAbout,
  onNavigateToContact,
}: HeroProps) {
  const { isDark } = useDarkMode();
  const pixelColor = isDark ? "#3f3f46" : "#c4c4cc";

  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = CYCLING_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
      return;
    } else if (!isDeleting) {
      timeout = setTimeout(
        () => setDisplayText(currentWord.slice(0, displayText.length + 1)),
        100
      );
    } else {
      timeout = setTimeout(
        () => setDisplayText(displayText.slice(0, -1)),
        60
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-10 md:pt-32 pb-32 px-6 md:px-12 bg-radial from-zinc-50 via-zinc-100 to-white overflow-hidden"
    >
      <div
        className="absolute inset-0  pointer-events-none"
        style={{ opacity: isDark ? 0.55 : 0.35 }}
      >
        <PixelBlast
          color={pixelColor}
          pixelSize={5}
          patternDensity={2}
          enableRipples={true}
          edgeFade={0.4}
          transparent={true}
          speed={2}
        />
      </div>

      {/* Hero Content Grid */}
      <div className="pt-20 md:pt-0 relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Main Copy */}
        <motion.div
          id="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 flex flex-col items-start gap-6 text-left"
        >
          {/* Status availability capsule */}
          <motion.div
            id="hero-status"
            variants={itemVariants as Variants}
            className="inline-flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-3.5 py-1.5 rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium font-mono text-zinc-500 uppercase tracking-widest leading-none">
              {HERO_DATA.availability}
            </span>
          </motion.div>

          {/* Main Title Heading */}
          <motion.h1
            id="hero-headline"
            variants={itemVariants as Variants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.05] font-sans font-bold text-zinc-950 tracking-tight"
          >
            Building{" "}
            <span className="inline-block relative whitespace-nowrap text-zinc-400">
              {displayText}
              <motion.span
                className="inline-block w-[3px] h-[0.8em] bg-zinc-400 ml-1 align-middle rounded-sm"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  times: [0, 0.5, 0.5, 1],
                  ease: "linear",
                }}
              />
            </span>{" "}
            <br />
            <SplitText
              className="font-sans tracking-tight block sm:inline"
              text="digital products."
            />
          </motion.h1>

          {/* Subtitle / Narrative */}
          <motion.p
            id="hero-description"
            variants={itemVariants as Variants}
            className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-light leading-relaxed tracking-tight"
          >
            I am{" "}
            <strong className="font-semibold text-zinc-950">
              {HERO_DATA.name}
            </strong>
            , a {HERO_DATA.title}. {HERO_DATA.description}
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            id="hero-actions"
            variants={itemVariants as Variants}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <button
              id="hero-cta-primary"
              onClick={onNavigateToContact}
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-700 text-white text-sm font-medium rounded-full shadow-lg shadow-zinc-200 transition-all hover:scale-103 active:scale-97 cursor-pointer"
            >
              Collaborate With Me
            </button>
<a
              id="hero-cta-resume"
              href="/resume/euger_bonete_resume.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-850 text-sm font-medium rounded-full border border-zinc-200 shadow-sm transition-all hover:scale-103 hover:border-zinc-300 active:scale-97"
            >
              <FileDown className="w-4 h-4 text-zinc-400" />
              Download CV
            </a>

            {/* Hand-written annotation */}
            <div className="hidden md:flex items-center pointer-events-none select-none ml-1">
              <span className="font-handwritten text-lg text-zinc-400 -rotate-3 inline-block leading-none">
                ← let's build!
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Embedded Dynamic Editorial Interactive Card (Cinematic Abstract Frame) */}
        <motion.div
          id="hero-graphic-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            delay: 0.4,
          }}
          className="lg:col-span-4 w-full flex justify-center lg:justify-end"
        >
          <TiltCard className="w-full max-w-85">
            <div className="relative w-full aspect-4/5 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xl shadow-zinc-100 flex flex-col justify-between h-full">
              {/* Soft decorative dots & labels */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider font-bold">
                  ARC-SYS // M1
                </span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-100 border border-zinc-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-100 border border-zinc-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-100 border border-zinc-200" />
                </div>
              </div>

              {/* Robust Avatar Profile Area */}
              <div className="my-auto flex flex-col items-center justify-center py-2">
                <div className="w-52 h-72 rounded-2xl bg-zinc-50 border border-zinc-200/50 shadow-inner mb-4 relative overflow-hidden">
                  <img
                    src={profilePic}
                    alt="Euger Bonete Jr - Full-Stack Developer"
                    className="w-full h-full object-contain"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-sans font-semibold text-center text-zinc-900 text-sm">
                  Euger Bonete Jr.
                </h3>
                <p className="text-[11px] font-mono text-zinc-400 text-center mt-1 leading-relaxed">
                  Full-Stack Developer
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Footer Navigation bar: Social links & chevron */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between border-t border-zinc-200/80 pt-8 mt-12 bg-transparent">
        {/* Social Icons */}
        <div id="hero-socials" className="flex items-center gap-4">
          <a
            id="social-github"
            href={HERO_DATA.socials.github}
            target="_blank"
            rel="noopener noreferrer referrerPolicy"
            className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200 focus:outline-none flex items-center justify-center"
            aria-label="GitHub Repository"
          >
            <Github className="w-4.5 h-4.5" />
          </a>
          <a
            id="social-linkedin"
            href={HERO_DATA.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer referrerPolicy"
            className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200 focus:outline-none flex items-center justify-center"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4.5 h-4.5" />
          </a>
          <a
            id="social-email"
            href={`mailto:${HERO_DATA.socials.email}`}
            className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200 focus:outline-none flex items-center justify-center"
            aria-label="Email Inbox"
          >
            <Mail className="w-4.5 h-4.5" />
          </a>
        </div>

        {/* Dynamic scroll down button */}
        <button
          id="hero-scroll-btn"
          onClick={onNavigateToAbout}
          className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-950 transition-colors group text-xs font-mono tracking-widest uppercase cursor-pointer focus:outline-none"
        >
          Scroll to view
          <span className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center p-1 shadow-sm group-hover:translate-y-0.5 transition-transform">
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </section>
  );
}
