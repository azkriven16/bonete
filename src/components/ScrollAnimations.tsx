"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";

/**
 * SplitText - Staggers text container word-by-word on scroll/initial reveal
 */
export function SplitText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] py-0.5">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.025 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Magnet - Premium magnet effect following mouse on hover, spring-snapping on release.
 * Uses motion values directly — no React state updates on mousemove.
 */
export function Magnet({ children, range = 35 }: { children: React.ReactNode; range?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 15, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 220, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (left + width / 2)) / 2.2;
    const dy = (e.clientY - (top + height / 2)) / 2.2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < range) {
      rawX.set(dx);
      rawY.set(dy);
    } else {
      rawX.set(0);
      rawY.set(0);
    }
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/**
 * CountUp - Smoothly counts integers or decimals from 0 to value when visible.
 * Uses requestAnimationFrame instead of setInterval.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  const matches = value.match(/^([\d.]+)(.*)$/);
  const numValue = matches ? parseFloat(matches[1]) : 0;
  const suffix = matches ? matches[2] : "";
  const isFloat = value.includes(".");

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3.5);
      setDisplayValue(numValue * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(numValue);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, numValue]);

  return (
    <span ref={ref}>
      {isFloat ? displayValue.toFixed(1) : Math.floor(displayValue)}
      {suffix}
    </span>
  );
}

/**
 * TiltCard - 3D depth tilt perspective effect matching mouse cursor hover coordinates.
 * Uses motion values directly — no React state updates on mousemove.
 */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    rawRotateX.set(-(mouseY / (rect.height / 2)) * 12);
    rawRotateY.set((mouseX / (rect.width / 2)) * 12);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
      className={className}
    >
      {className.includes("parent-perspective") ? (
        children
      ) : (
        <div style={{ transform: "translateZ(30px)" }}>{children}</div>
      )}
    </motion.div>
  );
}
