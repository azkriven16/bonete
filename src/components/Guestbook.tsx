import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PenTool,
  MessageSquare,
  User,
  ShieldAlert,
  Send,
  Briefcase,
  CheckCircle,
  X,
} from "lucide-react";

interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  message: string;
  timestamp: string;
  badge: string; // 'sparkle' | 'coffee' | 'bolt' | 'heart' | 'code'
  isPreseeded?: boolean;
}

const BADGES = [
  {
    id: "sparkle",
    label: "Sparkle ✨",
    icon: "✨",
    color:
      "bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "coffee",
    label: "Coffee ☕",
    icon: "☕",
    color:
      "bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400",
  },
  {
    id: "bolt",
    label: "Lightning ⚡",
    icon: "⚡",
    color:
      "bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "code",
    label: "Brackets 💻",
    icon: "💻",
    color:
      "bg-zinc-50 dark:bg-[#1c1c1f] border-zinc-200 dark:border-[#27272a] text-zinc-700 dark:text-zinc-400",
  },
  {
    id: "heart",
    label: "Heart ❤️",
    icon: "❤️",
    color:
      "bg-rose-50 dark:bg-rose-950 border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400",
  },
];

const PRESEEDED_ENTRIES: GuestbookEntry[] = [
  {
    id: "p1",
    name: "Guillermo Rauch",
    role: "CEO, Vercel",
    message:
      "Love the extreme attention to details on the product design and responsive frameworks here. Excellent execution on the interactive project sandbox. Keep raising the bar, Euger!",
    timestamp: "May 20, 2026",
    badge: "sparkle",
    isPreseeded: true,
  },
  {
    id: "p2",
    name: "Lee Robinson",
    role: "VP of Product, Vercel",
    message:
      "This portfolio has amazing speed and layout flow. The Command Palette integration (Ctrl+K) is a delightful addition to developer portfolio UX. Very clean work.",
    timestamp: "May 12, 2026",
    badge: "code",
    isPreseeded: true,
  },
  {
    id: "p3",
    name: "Sarah Drasner",
    role: "Eng Leader & Author",
    message:
      "Beautiful Swiss minimalist style combined with immersive, interactive product trials. Seeing your real code architecture simulated is way better than reading static bullet points.",
    timestamp: "April 28, 2026",
    badge: "bolt",
    isPreseeded: true,
  },
  {
    id: "p4",
    name: "Tanner Linsley",
    role: "Creator, TanStack",
    message:
      "Type-safe structures and robust local state. The Ciptax Pro simulation and Viafide validator demonstrate exactly how modern engineers should present their works. Huge fan!",
    timestamp: "April 15, 2026",
    badge: "coffee",
    isPreseeded: true,
  },
];

const getBadgeIcon = (id: string) =>
  BADGES.find((b) => b.id === id)?.icon || "✨";

const toHandle = (name: string) =>
  "@" +
  name
    .split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

interface MarqueeCardProps {
  entry: GuestbookEntry;
}

const MarqueeCard = ({ entry }: MarqueeCardProps) => {
  const initials = entry.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-4 rounded-xl mx-2 sm:mx-2.5 bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-200 w-72 sm:w-80 md:w-88 shrink-0 text-left overflow-hidden">
      <div className="flex gap-2.5">
        <div className="size-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-zinc-900 truncate">
              {entry.name}
            </p>
            {entry.isPreseeded && (
              <svg
                className="mt-0.5 shrink-0"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                  fill="#2196F3"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-zinc-400">{toHandle(entry.name)}</span>
        </div>
      </div>
      <p className="text-sm py-3 text-zinc-700 leading-relaxed sm:line-clamp-5">
        {entry.message}
      </p>
      <div className="flex items-center justify-between text-zinc-400 text-xs">
        <div className="flex items-center gap-1">
          <span>Signed</span>
          <span className="text-base leading-none">
            {getBadgeIcon(entry.badge)}
          </span>
        </div>
        <p>{entry.timestamp}</p>
      </div>
    </div>
  );
};

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("sparkle");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDialogOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Loads entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("euger_guestbook_entries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        setEntries(PRESEEDED_ENTRIES);
      }
    } else {
      setEntries(PRESEEDED_ENTRIES);
      localStorage.setItem(
        "euger_guestbook_entries",
        JSON.stringify(PRESEEDED_ENTRIES),
      );
    }
  }, []);

  const handleSign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please state your name or alias.");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Write a short note or sign-off message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Simulate database network lag for cinematic accuracy
    setTimeout(() => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const newEntry: GuestbookEntry = {
        id: "user-" + Date.now(),
        name: name.trim(),
        role: role.trim() || "Visitor / Guest",
        message: message.trim(),
        timestamp: formattedDate,
        badge: selectedBadge,
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem("euger_guestbook_entries", JSON.stringify(updated));

      // Reset form
      setName("");
      setRole("");
      setMessage("");
      setSelectedBadge("sparkle");
      setIsSubmitting(false);
      setFormSuccess(true);

      setTimeout(() => {
        setFormSuccess(false);
        setIsDialogOpen(false);
      }, 1800);
    }, 1000);
  };

  return (
    <section
      id="guestbook"
      className="bg-zinc-100 flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-zinc-50 rounded-full filter blur-3xl opacity-60 pointer-events-none -translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-50 rounded-full filter blur-3xl opacity-50 pointer-events-none translate-x-1/3 translate-y-1/3 -z-10" />

      {/* Padded header — mirrors the footer's px-6 md:px-12 wrapper */}
      <div className="pb-16 sm:pb-24 md:pb-32 px-6 md:px-12 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div
            id="guestbook-heading"
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-150 pb-8"
          >
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-none mb-3">
                04 // PUBLIC RECORD
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-zinc-950 tracking-tight">
                Developer Guestbook
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
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <PenTool className="w-3.5 h-3.5" />
              Sign the Guestbook
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed marquee — same pattern as Footer's crowd canvas */}
      {/* Sits as a direct sibling to the padded header, not inside it */}
      <div
        className="flex flex-col gap-0 w-full overflow-hidden select-none pb-8"
        onMouseEnter={(e) => e.currentTarget.classList.add("marquee-paused")}
        onMouseLeave={(e) => e.currentTarget.classList.remove("marquee-paused")}
        onTouchStart={(e) => e.currentTarget.classList.add("marquee-paused")}
        onTouchEnd={(e) => e.currentTarget.classList.remove("marquee-paused")}
      >
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-16 md:w-20 z-10 pointer-events-none bg-linear-to-r from-zinc-100 to-transparent" />
          <div className="marquee-inner flex transform-gpu min-w-[200%] py-3">
            {[...entries, ...entries, ...entries, ...entries].map(
              (entry, i) => (
                <MarqueeCard key={`r1-${i}`} entry={entry} />
              ),
            )}
          </div>
          <div className="absolute right-0 top-0 h-full w-16 md:w-20 z-10 pointer-events-none bg-linear-to-l from-zinc-100 to-transparent" />
        </div>
        <div className="hidden sm:block relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-16 md:w-20 z-10 pointer-events-none bg-linear-to-r from-zinc-100 to-transparent" />
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-3">
            {[...entries, ...entries, ...entries, ...entries].map(
              (entry, i) => (
                <MarqueeCard key={`r2-${i}`} entry={entry} />
              ),
            )}
          </div>
          <div className="absolute right-0 top-0 h-full w-16 md:w-20 z-10 pointer-events-none bg-linear-to-l from-zinc-100 to-transparent" />
        </div>
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsDialogOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Sign the Guestbook"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-white border border-zinc-200 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 p-6 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Dialog header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-zinc-900">
                        Sign Euger&apos;s Registry
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-400">
                        YOUR VISITOR BADGE SECURED LOCAL
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSign} className="flex flex-col gap-4">
                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <AnimatePresence>
                    {formSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl flex items-start gap-2.5 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold">Message logged!</span>
                          <span className="text-[10px] font-normal text-emerald-600/90">
                            Your signature was recorded. Closing shortly...
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Name{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Amanda Cole"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Role
                      </label>
                      <input
                        type="text"
                        placeholder="Designer at Linear"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Select Digital Flair Emoji
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {BADGES.map((badge) => {
                        const isSelected = selectedBadge === badge.id;
                        return (
                          <button
                            key={badge.id}
                            type="button"
                            onClick={() => setSelectedBadge(badge.id)}
                            disabled={isSubmitting}
                            title={badge.label}
                            className={`py-2 px-1 rounded-xl border transition-all text-xs flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? "bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <span className="text-sm select-none">
                              {badge.icon}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Your Message{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Type a nice note, critique, greeting, or feedback..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSubmitting
                        ? "bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed"
                        : "bg-zinc-950 text-white hover:opacity-90 active:scale-[0.98]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
                        Signing Ledger...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Sign Guestbook
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
