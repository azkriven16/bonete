import { motion } from 'motion/react';
import { EXPERIENCE_DATA } from '../data';
import { Briefcase, Calendar, MapPin, Sparkles } from 'lucide-react';
import { SplitText } from './ScrollAnimations';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 80 }
  }
};

export default function Experience() {

  return (
    <section
      id="experience"
      className="py-24 sm:py-32 px-6 md:px-12 bg-zinc-100 flex flex-col items-center justify-center relative"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div id="experience-heading" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-24 border-b border-zinc-150 pb-8">
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-none mb-3">
              02 // TIMELINE HISTORIES
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-zinc-950 tracking-tight">
              <SplitText text="Professional Milestones" />
            </h2>
            <svg viewBox="0 0 120 6" xmlns="http://www.w3.org/2000/svg" className="mt-2 w-32 h-1.5 text-zinc-300" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M0 3 Q7.5 0 15 3 Q22.5 6 30 3 Q37.5 0 45 3 Q52.5 6 60 3 Q67.5 0 75 3 Q82.5 6 90 3 Q97.5 0 105 3 Q112.5 6 120 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-xs font-mono text-zinc-400 text-left md:text-right max-w-xs uppercase tracking-widest">
            Roles, clients, and milestones from 2021 to present.
          </p>
        </div>

        {/* Timeline */}
        <motion.div
          id="experience-timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col gap-12"
        >
          {EXPERIENCE_DATA.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              className="w-full"
            >
              <div className="bg-white border border-zinc-200 hover:border-zinc-300 p-8 sm:p-10 rounded-3xl transition-all duration-300 shadow-xs hover:shadow-md flex flex-col lg:grid lg:grid-cols-12 gap-8 text-left">

                {/* Left: Identity */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                  <div className="inline-flex items-center gap-2 bg-zinc-150 border border-zinc-200/50 px-3 py-1.5 rounded-full w-fit">
                    <Calendar className="w-3.5 h-3.5 text-zinc-450 shrink-0" />
                    <span className="text-xs font-mono font-bold text-zinc-650 uppercase tracking-wide leading-none select-none">
                      {job.period}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-2xl font-sans font-extrabold text-zinc-950 tracking-tight">
                      {job.company}
                    </h3>
                    <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      {job.role}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {job.location}
                    </span>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-8 flex flex-col gap-6 lg:border-l lg:border-zinc-150 lg:pl-10">
                  {/* Lead paragraph — context (personal narrative) or fallback to description */}
                  <p className="text-base text-zinc-600 leading-relaxed tracking-tight">
                    {job.context ?? job.description}
                  </p>

                  {/* Achievements */}
                  <ul className="flex flex-col gap-3 pl-0 m-0 list-none">
                    {job.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-zinc-600 font-light leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 pt-5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-zinc-55 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-zinc-500 border border-zinc-200/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
