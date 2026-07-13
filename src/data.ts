import { Project, ExperienceItem, TechStackCategory } from "./types";

export const HERO_DATA = {
  name: "Euger Bonete Jr.",
  title: "Full-Stack Developer",
  subtitle: "Designing & engineering modern digital products.",
  description:
    "Full-stack developer specializing in turning Figma into production — type-safe interfaces built with React, TypeScript, and Next.js.",
  availability: "Available for new inquiries",
  socials: {
    github: "https://github.com/azkriven16/",
    linkedin: "https://www.linkedin.com/in/euger-bonete/",
    email: "eugerbone@gmail.com",
  },
};

export const ABOUT_DATA = {
  philosophy: [
    {
      period: "High School",
      title: "The Spark",
      description:
        "My first exposure to code was tinkering with HTML and CSS in high school — nothing serious, just curiosity. I didn't know it then, but that spark was enough to set the direction.",
    },
    {
      period: "College · 2021",
      title: "Getting Serious",
      description:
        "College is where I actually committed. I started with Bubble.io, building real client apps before I could write a line of React. That no-code foundation taught me to think in systems and user flows first — the TypeScript came after, and it made me a sharper engineer.",
    },
    {
      period: "2022 – Present",
      title: "Building for Real",
      description:
        "I interned, picked up freelance clients, and kept shipping through college. I became design-fluent out of necessity — most clients hand you a Figma file and expect a production app. Graduated in 2025, still freelancing full-stack, owning every decision from architecture to deployment.",
    },
  ],
  metrics: [
    { value: "03+", label: "Years Experience" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "15+", label: "Production Deployments" },
    { value: "5+", label: "Projects Shipped" },
  ],
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "viafide",
    title: "Viafide",
    subtitle: "AI job board & talent marketplace",
    description:
      "An AI-powered global job board connecting talent with opportunities through intelligent matching, skill verification, and merit-based hiring. Features neural job search, AI-assisted interview prep, company discovery, and a candidate resume builder.",
    bullets: [
      "AI-powered job matching and neural search interfaces enabling employers to discover talent based on deep skill requirements, not keywords.",
      "Candidate-facing resume builder, onboarding flow, and dashboard supporting applications globally with localized contract handling.",
      "Merit-based hiring features including masked profiles and skill verification for bias-free candidate discovery.",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "GSAP",
      "Cloudflare",
    ],
    category: "Freelance",
    highlightColor: "zinc",
    githubUrl: "https://github.com",
    liveUrl: "http://viafide.com/",
    image: "/images/viafide.png",
  },
  {
    id: "novu",
    title: "Novu",
    subtitle: "Real-time customer chat platform",
    description:
      "A real-time customer chat platform and cost-effective alternative to Intercom and Crisp. Features live chat infrastructure, AI-generated response suggestions powered by Claude, team inboxes, a knowledge base, and embeddable chat widgets.",
    bullets: [
      "Real-time live chat infrastructure via Supabase Realtime enabling instant, bidirectional customer-to-agent messaging at scale.",
      "Claude API integration powering AI-assisted response suggestions and automated agent replies across support queues.",
      "Team dashboards, knowledge base, embeddable chat widget, and subscription payment flows via Dodo Payments for multi-tier SaaS access.",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Claude AI",
      "Cloudflare",
    ],
    category: "Freelance",
    highlightColor: "zinc",
    githubUrl: "https://github.com",
    liveUrl: "https://novu.so/",
    image: "/images/novu-preview.png",
  },
  {
    id: "ciptax",
    title: "Ciptax",
    subtitle: "Browser-based tax calculator suite",
    description:
      "A free, browser-based tax and compliance calculator suite covering Malta and Philippine tax regulations — including income tax, withholding tax, rental income, MP2 investments, and late penalty calculations. All computation runs entirely client-side with no backend or authentication required.",
    bullets: [
      "In-browser tax calculators covering Malta IRD and Philippine BIR regulations, each validated with Zod schemas and React Hook Form.",
      "Late penalty calculator handling Malta's interest rate transition and date-sensitive filing edge cases across multiple tax year windows.",
      "Next.js Turbopack build pipeline optimized for fast page loads with zero backend dependency.",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Radix UI",
      "Framer Motion",
    ],
    category: "Freelance",
    highlightColor: "zinc",
    githubUrl: "https://github.com",
    liveUrl: "https://www.ciptaxpro.com/",
    image: "/images/ciptax.png",
  },
  {
    id: "globaltalent",
    title: "Global Talent Portal",
    subtitle: "Company website & landing page",
    description:
      "A professional company website and landing page built for Global Talent Portal LLC — a global talent solutions company. Showcases their services and brand with a modern, responsive design deployed on Cloudflare's edge network.",
    bullets: [
      "Built the full company website for Global Talent Portal LLC, translating their brand identity into a polished web presence with service sections and client-facing content.",
      "Fully responsive, animated interface with Framer Motion and Tailwind CSS deployed on Cloudflare for fast global edge performance.",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Three.js",
      "Drizzle ORM",
    ],
    category: "Freelance",
    highlightColor: "zinc",
    githubUrl: "https://github.com",
    liveUrl: "https://globaltalentportal.com/",
    image: "/images/globaltalentportal.png",
  },
  {
    id: "rocketshyft",
    title: "Rocketshyft",
    subtitle: "Workforce scheduling platform",
    description:
      "An enterprise workforce scheduling platform that streamlines employee scheduling, shift management, and availability tracking for teams of all sizes. Fast, modular scheduling experience built with React, TypeScript, and Vite.",
    bullets: [
      "Interactive scheduling calendar interfaces enabling managers to assign and optimize shifts across complex employee availability constraints.",
      "Schedule state management handling multi-employee availability tracking and automatic shift conflict detection.",
      "Polished, accessible scheduling workflows reducing manual scheduling overhead across team operations.",
    ],
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    category: "Freelance",
    highlightColor: "zinc",
    githubUrl: "https://github.com",
    liveUrl: "https://rocketshyft.com/",
    image: "/images/rocketshyft.webp",
  },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "freelance-developer",
    role: "Freelance Full-Stack Developer",
    company: "Independent",
    period: "2023 — Present",
    location: "Remote",
    context:
      "Became design-fluent out of necessity — most clients hand you a Figma file and expect a production app. Graduated in 2025 still freelancing, handling everything from architecture decisions to production deploys.",
    description:
      "Built and delivered production-ready web applications for clients across multiple industries.",
    bullets: [
      "Viafide (2026) — full-stack developer on an AI-powered hiring and professional verification platform connecting global talent with companies through merit-based recruitment.",
      "Novu (2026) — full-stack developer on an AI-powered customer support platform featuring real-time live chat, AI responses, team inboxes, analytics, and Slack-integrated communication tools.",
      "Global Talent Portal (2025) — full-stack developer who built the company website and landing page for Global Talent Portal LLC, a global talent solutions provider connecting businesses with international talent.",
      "Ciptax Pro (2025) — full-stack developer on a modern tax and compliance platform providing instant financial, payroll, and investment calculators for Malta and the Philippines.",
      "Rocketshyft (2023) — frontend developer on an all-in-one workforce scheduling platform automating employee scheduling, shift management, availability tracking, and schedule optimization.",
    ],
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Full-Stack",
    ],
  },
  {
    id: "digipay",
    role: "Frontend Engineer Intern",
    company: "Digipay",
    period: "Apr 2021 — Oct 2021",
    location: "Remote",
    context:
      "Built real client apps before writing a line of React — starting no-code taught me to think in systems and user flows first. The code came after, and it made me a sharper engineer.",
    description:
      "Participated in agile development workflows and contributed to frontend codebase improvements.",
    bullets: [
      "Participated in daily stand-up meetings and agile development workflows.",
      "Worked on assigned tickets to maintain and improve existing frontend codebases.",
      "Updated and migrated dependencies to newer libraries and versions.",
      "Collaborated with the team to ship fixes, improvements, and frontend enhancements.",
    ],
    tags: ["React", "JavaScript", "Agile", "Jira"],
  },
];

export const TECH_STACK_DATA: TechStackCategory[] = [
  {
    title: "Frontend Engineering",
    description:
      "Crafting highly performant, accessible UI layers with layout fluidly and modular architecture.",
    items: [
      { name: "Next.js", level: "Expert", iconName: "Layers" },
      { name: "React 19 / 18", level: "Expert", iconName: "Atom" },
      { name: "TypeScript", level: "Expert", iconName: "Code" },
      { name: "Tailwind CSS", level: "Expert", iconName: "Feather" },
      { name: "Framer Motion", level: "Expert", iconName: "Activity" },
    ],
  },
  {
    title: "Backend & Systems",
    description:
      "Developing robust, type-safe API routers, edge computation middlewares, and fast message channels.",
    items: [
      { name: "Node.js / Bun", level: "Expert", iconName: "Server" },
      { name: "Express / NestJS", level: "Advanced", iconName: "Cpu" },
      { name: "Rust", level: "Advanced", iconName: "Settings" },
      { name: "Prisma ORM", level: "Expert", iconName: "DatabaseBackup" },
      { name: "GraphQL / gRPC", level: "Advanced", iconName: "Network" },
    ],
  },
  {
    title: "Database & Cloud",
    description:
      "Optimizing index structures, distributed state scaling, and continuous deployment workflows.",
    items: [
      { name: "PostgreSQL", level: "Expert", iconName: "Database" },
      {
        name: "Supabase / Firebase",
        level: "Expert",
        iconName: "CloudLightning",
      },
      { name: "Docker", level: "Advanced", iconName: "Box" },
      { name: "Vercel / Cloudflare", level: "Expert", iconName: "Cloud" },
      { name: "GitHub Actions CI", level: "Advanced", iconName: "GitMerge" },
    ],
  },
];
