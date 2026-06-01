import { motion } from "motion/react";
import { ABOUT_DATA } from "../data";
import { Lightbulb, Code2, Briefcase } from "lucide-react";
import { SplitText, TiltCard } from "./ScrollAnimations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 100 },
  },
};

export default function About() {
  const getTimelineIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Lightbulb className="w-5 h-5 text-zinc-700" />;
      case 1:
        return <Code2 className="w-5 h-5 text-zinc-700" />;
      default:
        return <Briefcase className="w-5 h-5 text-zinc-700" />;
    }
  };

  return (
    <section
      id="about"
      className="py-24 sm:py-32 px-6 md:px-12 bg-white flex flex-col items-center justify-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Cinematic Section Header */}
        <div
          id="about-heading"
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-zinc-150 pb-8"
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-none mb-3">
              04 // ABOUT ME
            </span>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-zinc-950 tracking-tight">
                <SplitText text="Background & Values" />
              </h2>
            </div>
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
            Filipino full-stack developer. Building for the web since 2021.
          </p>
        </div>

          <motion.div
            id="about-pillars"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-6"
          >
            {ABOUT_DATA.philosophy.map((pillar, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="w-full flex gap-4 items-stretch"
              >
                {/* Timeline spine */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center p-2.5 shadow-sm shrink-0">
                    {getTimelineIcon(index)}
                  </div>
                  {index < ABOUT_DATA.philosophy.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-zinc-200" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 pb-3">
                  <TiltCard>
                    <div className="group relative bg-zinc-50 hover:bg-zinc-100/50 hover:border-zinc-300 border border-zinc-200/60 p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col gap-2 text-left shadow-xs h-full">
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                        {pillar.period}
                      </span>
                      <h4 className="font-sans font-semibold text-base text-zinc-900 tracking-tight">
                        {pillar.title}
                      </h4>
                      <p className="text-sm font-light text-zinc-650 leading-relaxed tracking-tight">
                        {pillar.description}
                      </p>
                    </div>
                  </TiltCard>
                </div>
              </motion.div>
            ))}
          </motion.div>
      </div>
    </section>
  );
}
