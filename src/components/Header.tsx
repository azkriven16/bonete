import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Search, Sun, Moon } from 'lucide-react';
import CommandMenu from './CommandMenu';
import { useDarkMode } from '../hooks/useDarkMode';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Inquire' },
  { id: 'guestbook', label: 'Guestbook' },
];

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Header Container */}
      <header
        id="app-header"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 px-4 lg:px-12 py-3 lg:py-5 ${
          scrolled ? 'backdrop-blur-none bg-transparent' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Personal Mark */}
          <button
            id="nav-logo"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 lg:gap-2.5 group cursor-pointer z-50 focus:outline-none backdrop-blur-xl bg-white/70 border border-zinc-200/60 shadow-xl shadow-zinc-100/40 dark:bg-zinc-150/90 dark:border-zinc-300/30 dark:shadow-black/20 rounded-full px-2 py-1 lg:px-3 lg:py-1.5 transition-all duration-300"
          >
            <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-md shadow-zinc-200">
              <img src="/images/icon.png" alt="Euger Bonete Jr logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans font-semibold text-xs lg:text-sm tracking-tight text-zinc-950 transition-colors group-hover:text-zinc-700">
                Euger Bonete Jr
              </span>
              <span className="hidden sm:block text-[10px] font-mono text-zinc-400 tracking-wider uppercase leading-none">
                Full-Stack Developer
              </span>
            </div>
          </button>

          {/* Desktop Capsule Navigation */}
          <nav
            id="desktop-nav"
            className="hidden lg:flex items-center gap-1.5 backdrop-blur-xl border shadow-xl px-2 py-1.5 rounded-full relative bg-white/70 border-zinc-200/60 shadow-zinc-100/40 dark:bg-zinc-150/90 dark:border-zinc-300/30 dark:shadow-black/20"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-colors focus:outline-none cursor-pointer ${
                    isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-850'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-full -z-10 border bg-zinc-100/80 border-zinc-200/10 dark:bg-zinc-250/50 dark:border-zinc-300/20"
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
            
            <div className="h-4 w-px mx-1.5 bg-zinc-200/80 dark:bg-zinc-300/40" />

            <button
              id="desktop-search-trigger"
              onClick={() => setIsCommandMenuOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-zinc-400 hover:text-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-250/40 transition-all text-xs font-medium cursor-pointer focus:outline-none"
              title="Search and commands (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5 opacity-80 font-mono text-[9px] font-semibold">
                <span>⌘</span>
                <span>K</span>
              </div>
            </button>

            <div className="h-4 w-px mx-1 bg-zinc-200/80 dark:bg-zinc-300/40" />

            <button
              id="desktop-dark-toggle"
              onClick={toggleDark}
              className="flex items-center justify-center px-3 py-1.5 rounded-full text-zinc-400 hover:text-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-250/40 transition-all cursor-pointer focus:outline-none"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </nav>

          {/* Contact / Action CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="header-cta"
              onClick={() => handleNavClick('contact')}
              className="group flex items-center gap-1 bg-zinc-950 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-102 hover:shadow-lg active:scale-98 cursor-pointer shadow-sm"
            >
              Start Project
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Search and Menu Controls */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              id="mobile-search-trigger"
              onClick={() => setIsCommandMenuOpen(true)}
              className="flex items-center justify-center p-2 rounded-lg backdrop-blur-md border focus:outline-none transition-transform active:scale-95 cursor-pointer bg-white/80 border-zinc-200 text-zinc-650 hover:text-zinc-950 hover:border-zinc-300 dark:bg-zinc-150/90 dark:border-zinc-300/40 dark:text-zinc-500 dark:hover:text-zinc-650 dark:hover:border-zinc-250"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <button
              id="mobile-dark-toggle"
              onClick={toggleDark}
              className="flex items-center justify-center p-2 rounded-lg backdrop-blur-md border focus:outline-none transition-transform active:scale-95 cursor-pointer bg-white/80 border-zinc-200 text-zinc-650 hover:text-zinc-950 hover:border-zinc-300 dark:bg-zinc-150/90 dark:border-zinc-300/40 dark:text-zinc-500 dark:hover:text-zinc-650 dark:hover:border-zinc-250"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center p-2 rounded-lg backdrop-blur-md border focus:outline-none z-50 transition-transform active:scale-95 cursor-pointer bg-white/80 border-zinc-200 text-zinc-850 dark:bg-zinc-150/90 dark:border-zinc-300/40 dark:text-zinc-700"
            >
              {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-zinc-900/15 backdrop-blur-md lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              id="mobile-menu-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200 pt-24 pb-8 px-6 shadow-2xl flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest pl-4 mb-2">
                  Navigation
                </span>
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      id={`mobile-nav-item-${item.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-zinc-50 text-zinc-950 border-l-2 border-zinc-950 font-semibold'
                          : 'text-zinc-500 hover:text-zinc-850 hover:bg-zinc-50/50'
                      }`}
                    >
                      {item.label}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                    </motion.button>
                  );
                })}
              </div>

              <div className="h-[1px] bg-zinc-250 my-2" />

              <motion.button
                id="mobile-menu-cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleNavClick('contact')}
                className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white font-medium py-3 rounded-xl text-sm"
              >
                Inquire Available Dates
                <ArrowUpRight className="w-4 h-4 text-zinc-350" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Command Palette search menu */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onNavigate={handleNavClick}
      />
    </>
  );
}
