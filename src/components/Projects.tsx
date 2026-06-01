import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Play,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Copy,
  Search,
  ShieldCheck,
  Calculator,
  Users,
  Check,
} from "lucide-react";
import { PROJECTS_DATA } from "../data";
import { SplitText } from "./ScrollAnimations";

export default function Projects() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");

  const allCategoryFilters = ["All", "Freelance", "Side Project", "In Progress"];

  const filteredProjects =
    activeCategoryFilter === "All"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategoryFilter);

  // Viafide Simulator State
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedVerifCode, setSelectedVerifCode] = useState("VF-CERT-709");
  const [verifLogs, setVerifLogs] = useState<string[]>([
    "READY: Cryptographic validator online",
    "ENTER credential hash parameter or click verify.",
  ]);
  const [verifStatus, setVerifStatus] = useState<
    "idle" | "verifying" | "success"
  >("idle");

  const runViafideVerifier = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setVerifStatus("verifying");
    setVerifLogs([
      "CONNECTING: Establishing secure tunnel to verification ledger...",
    ]);

    setTimeout(() => {
      setVerifLogs((prev) => [
        ...prev,
        "SUCCESS: Key found matching certificate signature: " +
          selectedVerifCode,
      ]);
    }, 600);
    setTimeout(() => {
      setVerifLogs((prev) => [
        ...prev,
        "RESOLVING: SHA-256 cryptographic match approved by decentralized host",
      ]);
    }, 1200);
    setTimeout(() => {
      setVerifLogs((prev) => [
        ...prev,
        "METRIC: Latency: 9.4ms, Verification Grade: secure-AES256, Integrity: 100%",
      ]);
      setVerifStatus("success");
      setIsVerifying(false);
    }, 1800);
  };

  // Global Talent Portal Simulator State
  const [activeCategory, setActiveCategory] = useState<
    "all" | "frontend" | "fullstack" | "design"
  >("all");
  const [isSearchingTalent, setIsSearchingTalent] = useState(false);
  const [talentSearchQuery, setTalentSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const candidates = [
    {
      id: 1,
      name: "Lucas Vance",
      role: "Frontend Developer",
      match: "99%",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      category: "frontend",
      available: "Immediate",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "Full Stack Engineer",
      match: "97%",
      skills: ["Node.js", "Express", "React", "Postgres"],
      category: "fullstack",
      available: "2 weeks notice",
    },
    {
      id: 3,
      name: "David Kim",
      role: "Product UI Designer",
      match: "94%",
      skills: ["Figma", "Design Tokens", "Aesthetic Systems"],
      category: "design",
      available: "Immediate",
    },
    {
      id: 4,
      name: "Amina Al-Masri",
      role: "Senior Frontend Engineer",
      match: "98%",
      skills: ["Next.js", "TypeScript", "Framer Motion"],
      category: "frontend",
      available: "1 month notice",
    },
  ];

  const filteredCandidates = candidates.filter((c) => {
    const matchesCategory =
      activeCategory === "all" || c.category === activeCategory;
    const matchesQuery =
      c.name.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(talentSearchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const sendCandidateInquiry = (name: string) => {
    setToastMessage(
      `Inquiry sent to ${name} successfully! Connection established.`,
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Ciptax Pro Simulator State
  const [businessType, setBusinessType] = useState<
    "freelancer" | "sme" | "corp"
  >("freelancer");
  const [annualRevenue, setAnnualRevenue] = useState<number>(120000);
  const [copiedTaxCode, setCopiedTaxCode] = useState(false);

  const getTaxCalculations = () => {
    let rate = 0.22;
    let baseDeductions = 12000;

    if (businessType === "freelancer") {
      rate = 0.15;
      baseDeductions = annualRevenue * 0.25;
    } else if (businessType === "sme") {
      rate = 0.21;
      baseDeductions = annualRevenue * 0.3;
    } else {
      rate = 0.25;
      baseDeductions = annualRevenue * 0.35;
    }

    const netTax = Math.max(0, (annualRevenue - baseDeductions) * rate);
    const estimatedSavings = baseDeductions * rate;

    return {
      rateText: `${(rate * 100).toFixed(0)}%`,
      deductions: baseDeductions.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      estimatedSavings: estimatedSavings.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      netTax: netTax.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      recommendedPlan:
        businessType === "freelancer"
          ? "Solo LLC Optimizer"
          : businessType === "sme"
            ? "SME Growth Suite"
            : "Enterprise Filing Portal",
    };
  };

  const calcs = getTaxCalculations();

  return (
    <section
      id="projects"
      className="py-24 sm:py-32 px-6 md:px-12 bg-white flex flex-col items-center justify-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div
          id="projects-heading"
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 md:mb-24 border-b border-zinc-150 pb-8"
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-none mb-3">
              01 // RECENT SHIPPED WORK
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-zinc-950 tracking-tight">
              <SplitText text="Project Showcases" />
            </h2>
            <svg
              viewBox="0 0 120 6"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-2 w-32 h-1.5 text-zinc-300"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 3 Q7.5 0 15 3 Q22.5 6 30 3 Q37.5 0 45 3 Q52.5 6 60 3 Q67.5 0 75 3 Q82.5 6 90 3 Q97.5 0 105 3 Q112.5 6 120 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-xs font-mono text-zinc-400 text-left md:text-right max-w-xs uppercase tracking-widest">
            Shipped client work with real production deployments.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-16">
          {allCategoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`text-[11px] font-mono font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                activeCategoryFilter === cat
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Project Loop */}
        <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
          {filteredProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                {/* Visual Case Study Meta Content */}
                <div
                  className={`lg:col-span-5 flex flex-col items-start gap-6 text-left ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      PROJ-0{index + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                      Interactive sandbox
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-sans font-bold text-zinc-950 tracking-tight">
                      {project.title}
                    </h2>
                    <p className="text-sm font-sans font-semibold text-zinc-500 tracking-tight">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-sm font-light text-zinc-650 leading-relaxed tracking-tight">
                    {project.description}
                  </p>

                  <ul className="hidden md:flex flex-col gap-2 text-sm text-zinc-650 font-light pl-0 list-none">
                    {project.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-zinc-55 text-zinc-650 text-[10px] font-mono px-2.5 py-1 rounded-md border border-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-4 mt-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer referrerPolicy"
                      className="group flex items-center justify-center gap-1.5 bg-zinc-950 text-white text-xs font-semibold px-4.5 py-2.5 rounded-full shadow-sm hover:bg-zinc-700 transition-all hover:scale-102 cursor-pointer"
                    >
                      Active Session
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Project Interactive Simulator / Mockup */}
                <div
                  className={`lg:col-span-7 w-full ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="bg-zinc-50/70 border border-zinc-200/80 p-5 rounded-3xl shadow-lg shadow-zinc-100 flex flex-col gap-4">
                    {/* Mockup Header Line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-150 pb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 border border-zinc-300 shrink-0" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 border border-zinc-300 shrink-0" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 border border-zinc-300 shrink-0" />
                        <span className="text-[10px] font-mono text-zinc-400 ml-2 truncate min-w-0">
                          {project.liveUrl}
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap shrink-0">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-zinc-100 text-zinc-500 text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border border-zinc-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* IMAGE PREVIEW — shown for any project with an image field */}
                    {project.image && (
                      <div className="rounded-2xl overflow-hidden border border-zinc-200 h-56 sm:h-72 lg:h-80 group/img">
                        <img
                          src={project.image}
                          alt={`${project.title} preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover/img:scale-102"
                        />
                      </div>
                    )}

                    {/* INTERACTIVE WORKSPACE FOR VIAFIDE VERIFICATION TOOL */}
                    {project.id === "viafide" && !project.image && (
                      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-6 text-left min-h-[310px]">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />{" "}
                              VIAFIDE CRYPTO AGENT
                            </span>
                            <h4 className="text-sm font-sans font-bold text-zinc-900">
                              Credential Verifier Tool
                            </h4>
                          </div>

                          <button
                            id="run-viafide"
                            onClick={runViafideVerifier}
                            disabled={isVerifying}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-xs cursor-pointer transition-all ${
                              isVerifying
                                ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                                : "bg-zinc-950 hover:bg-zinc-700 text-white"
                            }`}
                          >
                            {isVerifying ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                            {isVerifying ? "Verifying..." : "Verify Hash"}
                          </button>
                        </div>

                        {/* Dropdown list for selection certificate */}
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            Select Sample Verification Target
                          </label>
                          <select
                            value={selectedVerifCode}
                            onChange={(e) => {
                              setSelectedVerifCode(e.target.value);
                              setVerifStatus("idle");
                              setVerifLogs([
                                "READY: Cryptographic validator online",
                                "Target changed to: " +
                                  e.target.value +
                                  ". Click verify to begin query.",
                              ]);
                            }}
                            className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-zinc-850 outline-none"
                          >
                            <option value="VF-CERT-709">
                              VF-CERT-709 (Euger Bonete Jr — Senior Cert)
                            </option>
                            <option value="VF-CERT-512">
                              VF-CERT-512 (Amina J. — DevOps Dev Degree)
                            </option>
                            <option value="VF-CERT-110">
                              VF-CERT-110 (Carlos M. — Crypto Specialist)
                            </option>
                          </select>
                        </div>

                        {/* Interactive Verification Console Log */}
                        <div className="bg-[#0e0e11] border border-[#1f1f26] rounded-xl p-4 font-mono text-[10px] text-zinc-400 flex flex-col gap-1.5 min-h-[100px] overflow-hidden justify-center relative">
                          <AnimatePresence>
                            {verifStatus === "success" && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-4 top-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1 font-mono text-[9px]"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                                SIGNATURE OK
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {verifLogs.map((log, lIdx) => (
                            <div key={lIdx} className="truncate select-none">
                              {log.startsWith("SUCCESS") ? (
                                <span className="text-emerald-400">{log}</span>
                              ) : log.startsWith("METRIC") ? (
                                <span className="text-blue-400">{log}</span>
                              ) : (
                                <span>{log}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* INTERACTIVE WORKSPACE FOR GLOBAL TALENT PORTAL */}
                    {project.id === "globaltalent" && !project.image && (
                      <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4 text-left min-h-[310px] relative">
                        {toastMessage && (
                          <div className="absolute top-4 inset-x-4 bg-[#0e0e11] text-zinc-100 text-xs py-2 px-3 rounded-xl shadow-md z-20 flex items-center justify-between border border-[#1f1f26] animate-fade-in">
                            <span>{toastMessage}</span>
                            <button
                              onClick={() => setToastMessage(null)}
                              className="text-[10px] text-zinc-500 hover:text-zinc-200 ml-2"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}

                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-zinc-500" />{" "}
                            GLOBAL TALENT PORTAL MATCHMAKER
                          </span>
                          <h4 className="text-sm font-sans font-bold text-zinc-900">
                            Interactive Employer Hub
                          </h4>
                        </div>

                        {/* Category tabs and search input */}
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1 bg-zinc-100 rounded-lg p-1">
                            {(
                              [
                                "all",
                                "frontend",
                                "fullstack",
                                "design",
                              ] as const
                            ).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  setActiveCategory(cat);
                                  setSelectedCandidate(null);
                                }}
                                className={`flex-1 text-center py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer capitalize ${
                                  activeCategory === cat
                                    ? "bg-white text-zinc-950 shadow-xs font-semibold"
                                    : "text-zinc-505 hover:text-zinc-850"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>

                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                            <input
                              type="text"
                              placeholder="Search developer skills or name..."
                              value={talentSearchQuery}
                              onChange={(e) => {
                                setTalentSearchQuery(e.target.value);
                                setSelectedCandidate(null);
                              }}
                              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-zinc-400 focus:bg-white transition-colors"
                            />
                          </div>
                        </div>

                        {/* Candidates matched items */}
                        <div className="flex-1 overflow-y-auto max-h-[140px] flex flex-col gap-1.5 pr-1">
                          {filteredCandidates.length > 0 ? (
                            filteredCandidates.map((c) => (
                              <div
                                key={c.id}
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                  selectedCandidate === c.id
                                    ? "bg-zinc-50 border-zinc-900 ring-half ring-zinc-900"
                                    : "bg-white border-zinc-150 hover:border-zinc-250"
                                }`}
                                onClick={() =>
                                  setSelectedCandidate(
                                    selectedCandidate === c.id ? null : c.id,
                                  )
                                }
                              >
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-zinc-900">
                                      {c.name}
                                    </span>
                                    <span className="text-[8px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded">
                                      Match {c.match}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-zinc-500 font-light">
                                    {c.role}
                                  </span>
                                </div>

                                {selectedCandidate === c.id ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      sendCandidateInquiry(c.name);
                                    }}
                                    className="bg-zinc-950 hover:bg-zinc-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                                  >
                                    Inquire Now
                                  </button>
                                ) : (
                                  <div className="flex gap-1">
                                    {c.skills.slice(0, 2).map((s) => (
                                      <span
                                        key={s}
                                        className="text-[9px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-100 px-1 py-0.2 rounded"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-zinc-400 text-xs">
                              No matching candidates found
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* INTERACTIVE WORKSPACE FOR CIPTAX PRO */}
                    {project.id === "ciptax" && !project.image && (
                      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-5 text-left min-h-[310px]">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                              <Calculator className="w-3.5 h-3.5 text-zinc-500" />{" "}
                              CIPTAX DIGITAL CALCULATOR
                            </span>
                            <h4 className="text-sm font-sans font-bold text-zinc-900">
                              Tax Deductions Planner
                            </h4>
                          </div>

                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2.5 py-1 border border-zinc-200 rounded-md">
                            wizard v1.2
                          </span>
                        </div>

                        {/* Interactive fields */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-zinc-400 uppercase">
                              Organization Structure
                            </label>
                            <div className="grid grid-cols-3 gap-1 bg-zinc-50 p-1 border border-zinc-200 rounded-lg">
                              {(["freelancer", "sme", "corp"] as const).map(
                                (type) => (
                                  <button
                                    key={type}
                                    onClick={() => setBusinessType(type)}
                                    className={`text-[9px] font-mono py-1 rounded leading-none text-center font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                                      businessType === type
                                        ? "bg-[#0e0e11] text-zinc-100 shadow-xs"
                                        : "text-zinc-500 hover:text-zinc-805"
                                    }`}
                                  >
                                    {type === "freelancer"
                                      ? "Free"
                                      : type === "sme"
                                        ? "SME"
                                        : "Corp"}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-zinc-400 uppercase">
                              Gross Annual Revenue
                            </label>
                            <input
                              type="range"
                              min="40000"
                              max="1000000"
                              step="20000"
                              value={annualRevenue}
                              onChange={(e) =>
                                setAnnualRevenue(Number(e.target.value))
                              }
                              className="w-full accent-zinc-950 mt-1 cursor-pointer h-1.5 bg-zinc-150 rounded-lg appearance-none"
                            />
                            <span className="text-right text-[10px] font-mono text-zinc-700 font-bold">
                              ${annualRevenue.toLocaleString("en-US")}
                            </span>
                          </div>
                        </div>

                        {/* Calculations outputs dashboard */}
                        <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-0.5 border-r border-zinc-200 pr-2">
                            <span className="text-[8px] font-mono text-zinc-400 uppercase">
                              Effective Rate
                            </span>
                            <span className="text-sm font-sans font-bold text-zinc-900 transition-all">
                              {calcs.rateText}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 border-r border-zinc-200 px-2">
                            <span className="text-[8px] font-mono text-zinc-400 uppercase">
                              Estimated Savings
                            </span>
                            <span className="text-sm font-sans font-bold text-zinc-950 text-emerald-600 transition-all">
                              {calcs.estimatedSavings}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 pl-2">
                            <span className="text-[8px] font-mono text-zinc-400 uppercase">
                              Estimated Deduct
                            </span>
                            <span className="text-xs font-sans font-bold text-zinc-850 transition-all">
                              {calcs.deductions}
                            </span>
                          </div>
                        </div>

                        {/* Recommendation bar */}
                        <div className="flex items-center justify-between bg-[#0e0e11] text-zinc-400 px-3.5 py-2.5 rounded-xl text-[10px] font-mono">
                          <span className="text-zinc-500 uppercase">
                            SUGGESTED SERVICE PLAN
                          </span>
                          <span className="text-emerald-400 font-bold uppercase tracking-wider">
                            {calcs.recommendedPlan}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
