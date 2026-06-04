import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search,
  Command,
  ArrowUp,
  ArrowDown,
  X,
  Layout,
  Compass,
  Cpu,
  Milestone,
  Sparkles,
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Users,
  Calculator,
  BookOpen,
  FileDown
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Actions & Projects' | 'Connect';
  icon: React.ComponentType<{ className?: string }>;
  handler: () => void;
  shortcut?: string;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function CommandMenu({ isOpen, onClose, onNavigate }: CommandMenuProps) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  // Copy email command
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('eugerbone@email.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items: CommandItem[] = [
    // Navigation Section
    {
      id: 'nav-hero',
      title: 'Go to Overview',
      subtitle: 'Euger Bonete Jr headline & introduction index',
      category: 'Navigation',
      icon: Compass,
      handler: () => {
        onNavigate('hero');
        onClose();
      },
      shortcut: 'G O'
    },
    {
      id: 'nav-about',
      title: 'Go to Philosophy / Thought',
      subtitle: 'Design ethos, vision and product metrics',
      category: 'Navigation',
      icon: Layout,
      handler: () => {
        onNavigate('about');
        onClose();
      },
      shortcut: 'G P'
    },
    {
      id: 'nav-stack',
      title: 'Go to Tech Stack',
      subtitle: 'Frontend, systems design, and database services',
      category: 'Navigation',
      icon: Cpu,
      handler: () => {
        onNavigate('stack');
        onClose();
      },
      shortcut: 'G T'
    },
    {
      id: 'nav-projects',
      title: 'Go to Shipped Projects',
      subtitle: 'Viafide, Talent Portal & Ciptax Pro',
      category: 'Navigation',
      icon: Sparkles,
      handler: () => {
        onNavigate('projects');
        onClose();
      },
      shortcut: 'G S'
    },
    {
      id: 'nav-guestbook',
      title: 'Go to Guestbook Registry',
      subtitle: 'Leave notes, feedback, and read founder reviews',
      category: 'Navigation',
      icon: BookOpen,
      handler: () => {
        onNavigate('guestbook');
        onClose();
      },
      shortcut: 'G G'
    },
    {
      id: 'nav-experience',
      title: 'Go to Experience Timeline',
      subtitle: 'Freelance, Rocketshyft, and Digipay milestones',
      category: 'Navigation',
      icon: Milestone,
      handler: () => {
        onNavigate('experience');
        onClose();
      },
      shortcut: 'G E'
    },
    {
      id: 'nav-contact',
      title: 'Go to Inquiry Form',
      subtitle: 'Send direct messages, check available slot dates',
      category: 'Navigation',
      icon: Mail,
      handler: () => {
        onNavigate('contact');
        onClose();
      },
      shortcut: 'G I'
    },

    // Actions & Projects
    {
      id: 'act-viafide',
      title: 'Run Viafide Cryptographical Verifier',
      subtitle: 'Scroll to and engage the Viafide security sandbox',
      category: 'Actions & Projects',
      icon: ShieldCheck,
      handler: () => {
        onNavigate('projects');
        onClose();
        setTimeout(() => {
          const runBtn = document.getElementById('run-viafide');
          if (runBtn) runBtn.click();
        }, 800);
      },
      shortcut: 'R K'
    },
    {
      id: 'act-talent',
      title: 'Connect Talent Inquirer Matcher',
      subtitle: 'View the Global Talent Portal LLC company website',
      category: 'Actions & Projects',
      icon: Users,
      handler: () => {
        onNavigate('projects');
        onClose();
        setTimeout(() => {
          const card = document.getElementById('project-card-globaltalent');
          if (card) card.scrollIntoView({ behavior: 'smooth' });
        }, 850);
      },
      shortcut: 'R T'
    },
    {
      id: 'act-tax',
      title: 'Calculate Estimates (Ciptax Pro)',
      subtitle: 'Model rate tiers & corporate annual savings',
      category: 'Actions & Projects',
      icon: Calculator,
      handler: () => {
        onNavigate('projects');
        onClose();
        setTimeout(() => {
          const card = document.getElementById('project-card-ciptax');
          if (card) card.scrollIntoView({ behavior: 'smooth' });
        }, 850);
      },
      shortcut: 'R C'
    },

    {
      id: 'act-resume',
      title: 'Download Resume / CV',
      subtitle: 'Get the latest PDF version of my resume',
      category: 'Actions & Projects',
      icon: FileDown,
      handler: () => {
        window.open('/resume/euger_bonete_resume.pdf', '_blank');
        onClose();
      },
      shortcut: 'D R'
    },

    // Connect Section
    {
      id: 'conn-email',
      title: 'Copy Email Address',
      subtitle: 'eugerbone@email.com (Copy to clipboard)',
      category: 'Connect',
      icon: PageCopyIcon, // Fallback icon reference, we can use Copy
      handler: () => {
        copyEmailToClipboard();
      },
      shortcut: 'C E'
    },
    {
      id: 'conn-github',
      title: 'Inspect GitHub Codebases',
      subtitle: 'GitHub profile hub and open source repositories',
      category: 'Connect',
      icon: Github,
      handler: () => {
        window.open('https://github.com', '_blank');
        onClose();
      },
      shortcut: 'C G'
    },
    {
      id: 'conn-linkedin',
      title: 'Connect via LinkedIn',
      subtitle: 'Professional history and connection networks',
      category: 'Connect',
      icon: Linkedin,
      handler: () => {
        window.open('https://linkedin.com', '_blank');
        onClose();
      },
      shortcut: 'C L'
    }
  ];

  function PageCopyIcon(props: { className?: string }) {
    return copied ? <Check className="text-emerald-500 w-4 h-4" /> : <Copy className="w-4 h-4" />;
  }

  // Filter items based on search
  const filteredItems = items.filter(item => {
    const query = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  // Keep input focused when menu is open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Handle Keyboard Events within Modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          filteredItems[activeIndex].handler();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, activeIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && itemsContainerRef.current) {
      const activeEl = itemsContainerRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // Group filtered items by category for rendering headers
  const renderItems = () => {
    if (filteredItems.length === 0) {
      return (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-sm font-sans font-medium text-zinc-850">No results found</p>
          <p className="text-xs font-light text-zinc-400">Try searching for keywords like &quot;Verify&quot;, &quot;Tax&quot;, or &quot;Stack&quot;</p>
        </div>
      );
    }

    return (
      <div id="command-list-container" ref={itemsContainerRef} className="max-h-[380px] overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1 select-none">
        {filteredItems.map((item, idx) => {
          const isSelected = idx === activeIndex;
          const Icon = item.icon;

          // Check if category header is needed
          const showCategoryHeader = idx === 0 || filteredItems[idx - 1].category !== item.category;

          return (
            <React.Fragment key={item.id}>
              {showCategoryHeader && (
                <div className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-3.5 pt-4 pb-1.5 border-t border-zinc-200/50 dark:border-zinc-200/20 first:border-0">
                  {item.category}
                </div>
              )}
              
              <div
                onClick={() => {
                  setActiveIndex(idx);
                  item.handler();
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`group w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between gap-4 cursor-pointer relative ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-md shadow-zinc-900/10'
                    : 'bg-transparent text-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-700 dark:border-zinc-500 text-white dark:text-zinc-950'
                      : 'bg-white dark:bg-zinc-200 border-zinc-200 text-zinc-500 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-300 group-hover:text-zinc-850'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-sans font-semibold tracking-tight">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-light transition-colors ${
                      isSelected ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Shortcut key badges */}
                  {item.shortcut && (
                    <span className={`hidden md:inline px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold border ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-700 dark:border-zinc-500 text-zinc-400'
                        : 'bg-zinc-50 dark:bg-zinc-200 border-zinc-200 text-zinc-500'
                    }`}>
                      {item.shortcut}
                    </span>
                  )}
                  
                  <ArrowRight className={`w-3.5 h-3.5 transition-all ${
                    isSelected 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                  }`} />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cmd-menu-root" className="fixed inset-0 z-55 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            id="cmd-dialog-panel"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200/80 shadow-2xl relative overflow-hidden flex flex-col"
          >
            {/* Header / Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-150 dark:border-zinc-200/60">
              <Search className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type command, service plan or section name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(0);
                }}
                className="flex-1 bg-transparent py-1.5 border-0 focus:ring-0 outline-none text-xs font-sans text-zinc-950 placeholder-zinc-400"
              />
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-500 font-mono text-[9px]">ESC</span>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-md text-zinc-405 hover:bg-zinc-100 hover:text-zinc-650 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content List */}
            {renderItems()}

            {/* Premium Command Footer Help */}
            <div className="bg-zinc-50 px-4.5 py-3 border-t border-zinc-150 dark:border-zinc-200/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <ArrowDown className="w-3 h-3" />
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="px-1 text-[8px] bg-white dark:bg-zinc-200 border border-zinc-200 rounded">↵</span>
                  Select
                </span>
              </div>

              <span>⌘K Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
