import { Github, Linkedin, Mail } from "lucide-react";
import { HERO_DATA } from "../data";
import { Skiper39 } from "./CrowdCanvas";

export default function Footer() {
  return (
    <footer id="app-footer" className="bg-zinc-50 text-zinc-500">
      <div className="px-6 md:px-12">
        {/* Mobile layout */}
        <div className="max-w-7xl mx-auto py-6 flex flex-col gap-5 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-zinc-200 shrink-0">
              <img src="/images/icon.png" alt="Euger Bonete Jr logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans font-semibold text-sm tracking-tight text-zinc-950">
                Euger Bonete Jr
              </span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase leading-none">
                Full-Stack Developer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={HERO_DATA.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="GitHub Repository"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href={HERO_DATA.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href={`mailto:${HERO_DATA.socials.email}`}
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="Email Inbox"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>

          <div className="border-t border-zinc-150 pt-4">
            <p className="text-xs font-light text-zinc-400">
              © 2026 Euger Bonete Jr. All rights reserved. Crafted with
              precision in React, Vite and Tailwind.
            </p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="max-w-7xl mx-auto py-12 hidden md:flex flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-zinc-200 shrink-0">
                <img src="/images/icon.png" alt="Euger Bonete Jr logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-semibold text-sm tracking-tight text-zinc-950">
                  Euger Bonete Jr
                </span>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase leading-none">
                  Full-Stack Developer
                </span>
              </div>
            </div>
            <p className="text-xs font-light text-zinc-400">
              © 2026 Euger Bonete Jr. All rights reserved. Crafted with
              precision in React, Vite and Tailwind.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={HERO_DATA.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="GitHub Repository"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href={HERO_DATA.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href={`mailto:${HERO_DATA.socials.email}`}
              className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="Email Inbox"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>
      {/* Crowd Banner */}
      <div className="relative h-40 sm:h-70 md:h-100 w-full overflow-hidden">
        <Skiper39 />
      </div>
    </footer>
  );
}
