import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Palette, Type, Layout, Sun, Check, Sparkles, RefreshCw, X, HelpCircle } from "lucide-react";

type ThemeMode = "light" | "dark";
type FontPairing = "neo-grotesque" | "editorial-serif" | "brutalist" | "tech-terminal" | "pixel-8bit";
type AccentColor = "mono" | "aurora" | "violet" | "sunset" | "coral";
type DensityMode = "cohesive" | "compact" | "editorial";

type SectionSetting = {
  fontPairing: FontPairing | "inherit";
  density: DensityMode | "inherit";
  themeMode: ThemeMode | "inherit";
};

const SECTIONS = [
  { id: "global", label: "🌍 Global Site Default", desc: "Base styling inherited by all sections" },
  { id: "hero", label: "👋 Hero Header Section", desc: "Premium introductory fold" },
  { id: "about", label: "🧠 Philosophy & Metrics Section", desc: "Thought process and numeric highlights" },
  { id: "stack", label: "💻 Tech Ecosystem Section", desc: "Curated software systems grid" },
  { id: "projects", label: "🎨 Project Showcases Section", desc: "Recent shipped work and interactive simulators" },
  { id: "experience", label: "💼 Timeline Milestones Section", desc: "Chronological job history" },
  { id: "guestbook", label: "📒 Guestbook Registry Section", desc: "Public user record database" },
  { id: "contact", label: "📬 Contact Workspace Section", desc: "Transmission logs and inquiry form" }
];

const LAZY_FONT_URLS: Record<string, string> = {
  "editorial-serif":
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap",
  "pixel-8bit":
    "https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap",
};

function loadFontIfNeeded(pairing: string) {
  const url = LAZY_FONT_URLS[pairing];
  if (!url) return;
  if (document.querySelector(`link[href="${url}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

function getFontProperties(p: FontPairing) {
  let sansFont = '"Inter", system-ui, sans-serif';
  let displayFont = '"Plus Jakarta Sans", system-ui, sans-serif';
  if (p === "editorial-serif") {
    sansFont = '"Lora", serif';
    displayFont = '"Playfair Display", serif';
  } else if (p === "brutalist") {
    sansFont = '"Space Grotesk", sans-serif';
    displayFont = '"Space Grotesk", sans-serif';
  } else if (p === "tech-terminal") {
    sansFont = '"JetBrains Mono", monospace';
    displayFont = '"Space Grotesk", sans-serif';
  } else if (p === "pixel-8bit") {
    sansFont = '"VT323", monospace';
    displayFont = '"Press Start 2P", monospace';
  }
  return { sansFont, displayFont };
}

function getPaddingPixels(d: DensityMode): string {
  if (d === "compact") return "2.5rem";
  if (d === "editorial") return "11rem";
  return "6.5rem";
}

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("global");
  const [showHelp, setShowHelp] = useState(false);

  // Load individual config settings from localStorage or initialize with clean defaults
  const [configs, setConfigs] = useState<Record<string, SectionSetting>>(() => {
    const saved = localStorage.getItem("workspace-section-configs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all sections are fully initialized inside storage
        const complete = { ...parsed };
        SECTIONS.forEach((sect) => {
          if (!complete[sect.id]) {
            complete[sect.id] = {
              fontPairing: sect.id === "global" ? "brutalist" : "inherit",
              density: sect.id === "global" ? "editorial" : "inherit",
              themeMode: sect.id === "global" ? "dark" : "inherit"
            };
          }
        });
        return complete;
      } catch (e) {
        // default fallback below
      }
    }

    const initial: Record<string, SectionSetting> = {};
    SECTIONS.forEach((s) => {
      initial[s.id] = {
        fontPairing: s.id === "global" ? "brutalist" : "inherit",
        density: s.id === "global" ? "editorial" : "inherit",
        themeMode: s.id === "global" ? "dark" : "inherit"
      };
    });
    return initial;
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem("accent-color") as AccentColor) || "mono";
  });

  const prevConfigsRef = useRef<Record<string, SectionSetting> | null>(null);
  const prevAccentRef = useRef<AccentColor | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if any override has been implemented contrasting standard brand vanilla
  const isCustomized = (() => {
    if (accentColor !== "mono") return true;

    // Check if global is not default
    const glob = configs["global"];
    if (glob && (glob.themeMode !== "dark" || glob.fontPairing !== "brutalist" || glob.density !== "editorial")) {
      return true;
    }

    // Check if any specific section overrides are applied
    return Object.keys(configs).some((key) => {
      if (key === "global") return false;
      const c = configs[key];
      return c.fontPairing !== "inherit" || c.density !== "inherit" || c.themeMode !== "inherit";
    });
  })();

  const handleReset = () => {
    const cleared: Record<string, SectionSetting> = {};
    SECTIONS.forEach((s) => {
      cleared[s.id] = {
        fontPairing: s.id === "global" ? "brutalist" : "inherit",
        density: s.id === "global" ? "editorial" : "inherit",
        themeMode: s.id === "global" ? "dark" : "inherit"
      };
    });
    setConfigs(cleared);
    setAccentColor("mono");
    setSelectedSectionId("global");
  };

  const updateSetting = (key: keyof SectionSetting, value: string) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedSectionId]: {
        ...prev[selectedSectionId],
        [key]: value as any
      }
    }));
  };

  // Sync ThemeCustomizer state when header toggle changes the theme externally
  useEffect(() => {
    const handleExternalChange = () => {
      const saved = localStorage.getItem("workspace-section-configs");
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        const newTheme = parsed?.global?.themeMode;
        if (newTheme !== "dark" && newTheme !== "light") return;
        setConfigs((prev) => {
          if (prev["global"]?.themeMode === newTheme) return prev;
          return { ...prev, global: { ...prev["global"], themeMode: newTheme } };
        });
      } catch {}
    };
    window.addEventListener("portfolio-theme-change", handleExternalChange);
    return () => window.removeEventListener("portfolio-theme-change", handleExternalChange);
  }, []);

  // Sync state modifications onto standard document DOM elements
  useEffect(() => {
    const root = document.documentElement;
    const globalConf = configs["global"] || { fontPairing: "neo-grotesque", density: "cohesive", themeMode: "light" };
    const prevGlobal = prevConfigsRef.current?.["global"];
    const accentChanged = accentColor !== prevAccentRef.current;

    // 1. Theme mode
    if (!prevGlobal || prevGlobal.themeMode !== globalConf.themeMode) {
      if (globalConf.themeMode === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    }

    // 2. Global fonts
    if (!prevGlobal || prevGlobal.fontPairing !== globalConf.fontPairing) {
      loadFontIfNeeded(globalConf.fontPairing);
      const globalFonts = getFontProperties(globalConf.fontPairing as FontPairing);
      root.style.setProperty("--font-sans-custom", globalFonts.sansFont);
      root.style.setProperty("--font-display-custom", globalFonts.displayFont);
    }

    // 3. Global spacing
    if (!prevGlobal || prevGlobal.density !== globalConf.density) {
      root.style.setProperty("--spacing-section-py-custom", getPaddingPixels(globalConf.density as DensityMode));
    }

    // 4. Accent colors
    let accentLight = "#09090b";
    let accentDark = "#ffffff";
    if (accentColor === "aurora") { accentLight = "#10b981"; accentDark = "#34d399"; }
    else if (accentColor === "violet") { accentLight = "#7c3aed"; accentDark = "#a78bfa"; }
    else if (accentColor === "sunset") { accentLight = "#f59e0b"; accentDark = "#fbbf24"; }
    else if (accentColor === "coral") { accentLight = "#f43f5e"; accentDark = "#fb7185"; }

    if (accentChanged || !prevGlobal || prevGlobal.themeMode !== globalConf.themeMode) {
      if (globalConf.themeMode === "dark") {
        root.style.setProperty("--color-zinc-950-custom", accentDark);
        root.style.setProperty("--color-zinc-900-custom", accentDark);
      } else {
        root.style.setProperty("--color-zinc-950-custom", accentLight);
        root.style.setProperty("--color-zinc-900-custom", accentLight);
      }
    }

    // 5. Per-section overrides — skip if unchanged
    SECTIONS.forEach((sect) => {
      if (sect.id === "global") return;
      const conf = configs[sect.id];
      const prevConf = prevConfigsRef.current?.[sect.id];
      if (!accentChanged && conf === prevConf) return;

      const el = document.getElementById(sect.id);
      if (!el || !conf) return;

      if (conf.density && conf.density !== "inherit") {
        el.style.setProperty("--spacing-section-py", getPaddingPixels(conf.density as DensityMode));
      } else {
        el.style.removeProperty("--spacing-section-py");
      }

      if (conf.fontPairing && conf.fontPairing !== "inherit") {
        loadFontIfNeeded(conf.fontPairing);
        const fonts = getFontProperties(conf.fontPairing as FontPairing);
        el.style.setProperty("--font-sans", fonts.sansFont);
        el.style.setProperty("--font-sans-custom", fonts.sansFont);
        el.style.setProperty("--font-display", fonts.displayFont);
        el.style.setProperty("--font-display-custom", fonts.displayFont);
      } else {
        el.style.removeProperty("--font-sans");
        el.style.removeProperty("--font-sans-custom");
        el.style.removeProperty("--font-display");
        el.style.removeProperty("--font-display-custom");
      }

      if (conf.themeMode && conf.themeMode !== "inherit") {
        if (conf.themeMode === "dark") {
          el.classList.add("dark");
          el.style.setProperty("background-color", "#0e0e11");
          el.style.setProperty("color", "#eaeaea");
          el.style.setProperty("--color-zinc-950-custom", accentDark);
          el.style.setProperty("--color-zinc-900-custom", accentDark);
        } else {
          el.classList.remove("dark");
          el.style.setProperty("background-color", "#ffffff");
          el.style.setProperty("color", "#18181b");
          el.style.setProperty("--color-zinc-950-custom", accentLight);
          el.style.setProperty("--color-zinc-900-custom", accentLight);
        }
      } else {
        el.classList.remove("dark");
        el.style.removeProperty("background-color");
        el.style.removeProperty("color");
        el.style.removeProperty("--color-zinc-950-custom");
        el.style.removeProperty("--color-zinc-900-custom");
      }
    });

    prevConfigsRef.current = configs;
    prevAccentRef.current = accentColor;

    // Debounce localStorage write + event dispatch (~150ms)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem("workspace-section-configs", JSON.stringify(configs));
      localStorage.setItem("accent-color", accentColor);
      window.dispatchEvent(new Event("portfolio-theme-change"));
    }, 150);
  }, [configs, accentColor]);

  const activeConf = configs[selectedSectionId] || { fontPairing: "inherit", density: "inherit", themeMode: "inherit" };

  if (!import.meta.env.DEV) return null;

  return (
    <>
      {/* Floating Design Studio Toggler Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <motion.button
          id="customizer-trigger"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-xl flex items-center justify-center text-zinc-550 cursor-pointer focus:outline-none overflow-hidden"
          title="Section Design Studio Playground"
        >
          {isCustomized && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
          )}
          <Sliders className={`w-5 h-5 transition-transform duration-500 ${isOpen ? "rotate-90 text-zinc-550" : ""}`} />
        </motion.button>
      </div>

      {/* Slide-out popover configuration control workspace */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="customizer-panel"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-22 right-6 z-50 w-[350px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-zinc-200/90 p-6 rounded-3xl shadow-2xl flex flex-col gap-5 text-left max-h-[80vh] overflow-y-auto"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-mono font-extrabold text-zinc-900 uppercase tracking-widest">
                  SECTION LAYOUT LAB
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isCustomized && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-950 cursor-pointer select-none transition-colors"
                    title="Restore system defaults"
                  >
                    <RefreshCw className="w-3 h-3" />
                    DEFAULT
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-zinc-450 hover:text-zinc-950 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Selector dropdown for localized section editing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-extrabold">
                SELECT SITE SECTION TO DESIGN:
              </label>
              <div className="relative">
                <select
                  value={selectedSectionId}
                  onChange={(e) => {
                    setSelectedSectionId(e.target.value);
                    // Automatically scroll to the selected section to let user preview changes live!
                    const id = e.target.value;
                    if (id !== "global") {
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 font-sans text-xs font-semibold text-zinc-900 rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-zinc-300 transition-colors"
                >
                  {SECTIONS.map((s) => {
                    // Check if this selector option is overridden
                    const isOverridden = s.id !== "global" && (
                      configs[s.id]?.fontPairing !== "inherit" ||
                      configs[s.id]?.density !== "inherit" ||
                      configs[s.id]?.themeMode !== "inherit"
                    );
                    return (
                      <option key={s.id} value={s.id} className="font-semibold text-zinc-900 bg-white">
                        {s.label} {isOverridden ? "★" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 italic mt-0.5 leading-tight">
                {SECTIONS.find((s) => s.id === selectedSectionId)?.desc}
              </p>
            </div>

            {/* Controls Panel */}
            <div className="flex flex-col gap-4.5 border-t border-zinc-100 pt-4">

              {/* SECTION THEME MODE SPECIFIC */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-450 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" /> COLOR SPECTRUM
                  </span>
                  {selectedSectionId !== "global" && activeConf.themeMode !== "inherit" && (
                    <span className="text-[9px] font-mono font-bold bg-zinc-150 text-zinc-500 px-1.5 py-0.5 rounded uppercase leading-none">
                      Override active
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 rounded-xl">
                  {selectedSectionId !== "global" && (
                    <button
                      onClick={() => updateSetting("themeMode", "inherit")}
                      className={`py-2 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        activeConf.themeMode === "inherit"
                          ? "bg-zinc-700 text-zinc-50 shadow-xs"
                          : "text-zinc-450 hover:text-zinc-650"
                      }`}
                    >
                      Inherit
                    </button>
                  )}
                  <button
                    onClick={() => updateSetting("themeMode", "light")}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      activeConf.themeMode === "light"
                        ? "bg-zinc-700 text-zinc-50 shadow-xs"
                        : "text-zinc-450 hover:text-zinc-650"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => updateSetting("themeMode", "dark")}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      activeConf.themeMode === "dark"
                        ? "bg-zinc-700 text-zinc-50 shadow-xs"
                        : "text-zinc-450 hover:text-zinc-650"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* FONT DESIGN OVERRIDE */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-450 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" /> SECTION TYPOGRAPHY
                  </span>
                  {selectedSectionId !== "global" && activeConf.fontPairing !== "inherit" && (
                    <span className="text-[9px] font-mono font-bold bg-zinc-150 text-zinc-500 px-1.5 py-0.5 rounded uppercase leading-none">
                      Override active
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto pr-1">
                  {selectedSectionId !== "global" && (
                    <button
                      onClick={() => updateSetting("fontPairing", "inherit")}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        activeConf.fontPairing === "inherit"
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                          : "bg-zinc-50/70 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs">Inherit Global Preset</span>
                      </div>
                      {activeConf.fontPairing === "inherit" && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  )}
                  {[
                    { id: "neo-grotesque", label: "Neo-Grotesque", desc: "Inter + Jakarta" },
                    { id: "editorial-serif", label: "Classic Editorial", desc: "Lora + Playfair" },
                    { id: "brutalist", label: "Brutalist Grotesk", desc: "Space Grotesk Geometry" },
                    { id: "tech-terminal", label: "Developer Terminal", desc: "JetBrains Code Mono" },
                    { id: "pixel-8bit", label: "8-Bit Arcade / Retro", desc: "Press Start 2P + VT323" }
                  ].map((item) => {
                    const isSelected = activeConf.fontPairing === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => updateSetting("fontPairing", item.id)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                            : "bg-zinc-50/70 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs">{item.label}</span>
                          <span className="text-[9px] font-mono opacity-70 leading-none mt-0.5">{item.desc}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION PADDING OVERRIDE */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-450 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5" /> CINEMATIC PADDING
                  </span>
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="p-0.5 text-zinc-400 hover:text-zinc-950 cursor-pointer"
                    title="What is cinematic padding?"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Explained Card for the User */}
                <AnimatePresence>
                  {showHelp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-zinc-50 p-3 rounded-xl text-[10px] font-mono text-zinc-500/90 leading-relaxed border border-zinc-150 overflow-hidden"
                    >
                      💡 <span className="font-bold underline">What does this do?</span> Cinematic spacing inserts vertical breathes/whitespace around each section to frame content:
                      <ul className="list-disc pl-3.5 mt-1 flex flex-col gap-0.5">
                        <li><strong>Compact:</strong> Shrunk margins (2.5rem / 40px) for quick scanning.</li>
                        <li><strong>Standard:</strong> Default classic vertical flow (6.5rem / 100px).</li>
                        <li><strong>Cinema:</strong> Majestic extra padding (11rem / 176px) creating an elite, editorial portfolio layout.</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 rounded-xl text-center">
                  {selectedSectionId !== "global" && (
                    <button
                      onClick={() => updateSetting("density", "inherit")}
                      className={`py-1.5 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        activeConf.density === "inherit"
                          ? "bg-zinc-700 text-zinc-50 shadow-xs"
                          : "text-zinc-450 hover:text-zinc-650"
                      }`}
                    >
                      Inherit
                    </button>
                  )}
                  {[
                    { id: "compact", label: "Compact" },
                    { id: "cohesive", label: "Standard" },
                    { id: "editorial", label: "Cinema" }
                  ].map((item) => {
                    const isSelected = activeConf.density === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => updateSetting("density", item.id)}
                        className={`py-1.5 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? "bg-zinc-700 text-zinc-50 shadow-xs"
                            : "text-zinc-450 hover:text-zinc-650"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GENERAL COLOR ACCENT COMPOSITION (GLOBAL BRANDING EYE-CATCHERS) */}
              <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-3.5">
                <span className="text-[10px] font-mono text-zinc-450 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> CORE ACCENT SCHEME (GLOBAL)
                </span>
                <div className="flex items-center gap-2.5 pt-1">
                  {[
                    { id: "mono", color: "bg-zinc-900 border-zinc-300", label: "Monochrome" },
                    { id: "aurora", color: "bg-emerald-500 border-emerald-300", label: "Aurora Green" },
                    { id: "violet", color: "bg-violet-500 border-violet-300", label: "Iris Violet" },
                    { id: "sunset", color: "bg-amber-500 border-amber-300", label: "Sunset Amber" },
                    { id: "coral", color: "bg-rose-500 border-rose-300", label: "Ruby Coral" }
                  ].map((item) => {
                    const isSelected = accentColor === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAccentColor(item.id as AccentColor)}
                        className={`w-6.5 h-6.5 rounded-full ${item.color} border flex items-center justify-center cursor-pointer relative shadow-sm transition-transform hover:scale-115 active:scale-90`}
                        title={item.label}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-zinc-950 shrink-0" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Custom footer line */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400 border-t border-zinc-100 pt-3 select-none shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
              <span>DYNAMIC MULTI-SECTION WORKSPACE OPERATIONAL // OK</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
