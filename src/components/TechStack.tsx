import React from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Atom,
  Code,
  Feather,
  Activity,
  Server,
  Cpu,
  Settings,
  DatabaseBackup,
  Network,
  Database,
  CloudLightning,
  Box,
  Cloud,
  GitMerge,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { TECH_STACK_DATA } from '../data';
import { SplitText, TiltCard } from './ScrollAnimations';

// Map iconName strings directly to Lucide Icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  Atom,
  Code,
  Feather,
  Activity,
  Server,
  Cpu,
  Settings,
  DatabaseBackup,
  Network,
  Database,
  CloudLightning,
  Box,
  Cloud,
  GitMerge,
};

export default function TechStack() {
  return (
    <section
      id="stack"
      className="pt-24 sm:pt-32 pb-40 sm:pb-48 px-6 md:px-12 bg-zinc-100 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Decorative clean radial mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-100 rounded-full blur-[160px] opacity-40 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div id="stack-heading" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-20 border-b border-zinc-150 pb-8">
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-none mb-3">
              02 // INSTRUMENT STACK
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-zinc-950 tracking-tight">
              <SplitText text="Curated Technologies" />
            </h2>
            <svg viewBox="0 0 120 6" xmlns="http://www.w3.org/2000/svg" className="mt-2 w-32 h-1.5 text-zinc-300" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M0 3 Q7.5 0 15 3 Q22.5 6 30 3 Q37.5 0 45 3 Q52.5 6 60 3 Q67.5 0 75 3 Q82.5 6 90 3 Q97.5 0 105 3 Q112.5 6 120 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-xs font-mono text-zinc-400 text-left md:text-right max-w-xs uppercase tracking-widest">
            Tools and frameworks powering every production project.
          </p>
        </div>

        {/* Bento Grid Containers */}
        <div id="stack-bento-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TECH_STACK_DATA.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: catIndex * 0.1, type: 'spring', damping: 25, stiffness: 100 }}
              className="w-full h-full"
            >
              <TiltCard className="h-full">
                <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-colors group duration-300 h-full">
                  {/* Category branding and details */}
                  <div className="flex flex-col text-left gap-2 mb-8">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                      CAT-0{catIndex + 1} // OVERVIEW
                    </span>
                    <h3 className="text-xl font-sans font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs font-light text-zinc-500 leading-relaxed max-w-xs">
                      {category.description}
                    </p>
                  </div>

                  {/* Stack items bento list */}
                  <div className="flex flex-col gap-3.5">
                    {category.items.map((tech) => {
                      const IconComponent = iconMap[tech.iconName] || HelpCircle;
                      return (
                        <div
                          key={tech.name}
                          className="flex items-center justify-between p-3.5 bg-zinc-50/70 border border-zinc-200/50 hover:bg-zinc-50 hover:border-zinc-300 rounded-2xl transition-all duration-200 group/item"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-150 flex items-center justify-center p-1.5 shadow-xs shrink-0 group-hover/item:scale-105 transition-transform duration-200">
                              <IconComponent className="w-4 h-4 text-zinc-700" />
                            </div>
                            <span className="text-xs font-sans font-semibold text-zinc-850 group-hover/item:text-zinc-950 transition-colors">
                              {tech.name}
                            </span>
                          </div>

                          {/* Proficient micro badge */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-white text-zinc-505 border border-zinc-200 uppercase tracking-normal">
                            <Sparkles className="w-2.5 h-2.5 text-zinc-400" />
                            {tech.level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
