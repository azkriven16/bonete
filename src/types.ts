export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  tags: string[];
  category: "Freelance" | "Side Project" | "In Progress";
  highlightColor: string;
  githubUrl: string;
  liveUrl: string;
  image?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  context?: string;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface TechStackCategory {
  title: string;
  description: string;
  items: {
    name: string;
    level: string; // 'Expert' | 'Advanced' | 'Proficient'
    iconName: string;
  }[];
}
