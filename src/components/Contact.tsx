import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Clock, MapPin, Mail, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { HERO_DATA } from '../data';
import { SplitText } from './ScrollAnimations';
import { supabase } from '../utils/supabase';

interface ContactProps {
  onSuccessNotification: (msg: string) => void;
}

export default function Contact({ onSuccessNotification }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update Dynamic Clock (Asia/Manila time formatted beautifully)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const phTime = now.toLocaleTimeString('en-US', options) + ' PHT (UTC+8)';
      setCurrentTime(phTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please populate all required fields.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || null,
      message: formData.message.trim(),
    });

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Something went wrong sending your message — please try again or email me directly.");
      return;
    }

    setSubmitSuccess(true);
    onSuccessNotification(`Thank you ${formData.name}! Your request has been dispatched to Euger Bonete Jr.`);

    // Clear state
    setFormData({
      name: '',
      company: '',
      email: '',
      message: ''
    });

    // Reset success banner after 6 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  return (
    <section
      id="contact"
      className="pt-24 sm:pt-32 pb-40 sm:pb-48 px-6 md:px-12 bg-white flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Subtle bottom mesh pattern */}
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-zinc-50 rounded-full blur-[120px] opacity-60 -z-10 pointer-events-none" />


      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div id="contact-heading" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-24 border-b border-zinc-150 pb-8">
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest leading-none mb-3">
              03 // COLLABORATE & ENGAGE
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-zinc-950 tracking-tight">
              <SplitText text="Start a Conversation" />
            </h2>
            <svg viewBox="0 0 120 6" xmlns="http://www.w3.org/2000/svg" className="mt-2 w-32 h-1.5 text-zinc-300" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M0 3 Q7.5 0 15 3 Q22.5 6 30 3 Q37.5 0 45 3 Q52.5 6 60 3 Q67.5 0 75 3 Q82.5 6 90 3 Q97.5 0 105 3 Q112.5 6 120 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-xs font-mono text-zinc-400 text-left md:text-right max-w-xs uppercase tracking-widest">
            Let's build something beautiful and high-performance.
          </p>
        </div>

        {/* Form Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Direct info, availability parameters, timezone */}
          <div className="lg:col-span-4 flex flex-col gap-10 text-left">
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl font-sans font-bold text-zinc-950 tracking-tight leading-snug">
                Let's construct <br />something lasting.
              </h3>
              <p className="text-sm font-light text-zinc-500 leading-relaxed max-w-sm">
                Have a design file ready, or looking to augment your core engineering system? File a pitch ticket below.
              </p>
            </div>

            {/* Direct Contact Metrics Lists */}
            <div className="flex flex-col gap-5 border-t border-zinc-150 pt-8">
              <div className="flex items-center gap-4 text-zinc-650 hover:text-zinc-950 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-semibold text-zinc-400 uppercase leading-none mb-1">Direct Inbox</span>
                  <a href={`mailto:${HERO_DATA.socials.email}`} className="text-xs font-semibold underline decoration-zinc-300">
                    {HERO_DATA.socials.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-650">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-semibold text-zinc-400 uppercase leading-none mb-1">LOCAL OPERATING TIME</span>
                  <span className="text-xs font-semibold">{currentTime || "00:00:00 UTC"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-650">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-semibold text-zinc-400 uppercase leading-none mb-1">PREF HEADQUARTERS</span>
                  <span className="text-xs font-semibold">Iloilo, Philippines // GMT+8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Submission Workspace */}
          <div className="lg:col-span-8 relative">
            {/* Hand-written annotation above the form */}
            <div className="hidden lg:flex items-center absolute -top-9 left-2 pointer-events-none select-none">
              <span className="font-handwritten text-lg text-zinc-400 rotate-2 inline-block leading-none">
                drop me a line! ↓
              </span>
            </div>
            <div className="bg-zinc-50/60 p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm relative h-full">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-7 text-left">
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {/* Input Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter name"
                        maxLength={100}
                        className="bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none placeholder-zinc-400 font-light text-zinc-900"
                      />
                    </div>

                    {/* Input Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        maxLength={254}
                        className="bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none placeholder-zinc-400 font-light text-zinc-900"
                      />
                    </div>
                  </div>

                  {/* Input Subject (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Subject <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Frontend build, design system, quick question..."
                      maxLength={150}
                      className="bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none placeholder-zinc-400 font-light text-zinc-900"
                    />
                  </div>

                  {/* Input Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Project Narrative Statement <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Briefly describe the vision or specs..."
                      maxLength={2000}
                      className="bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none placeholder-zinc-400 resize-none font-light leading-relaxed text-zinc-900"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="flex flex-col gap-4 mt-2">
                    <button
                      id="submit-contact"
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-4 px-6 rounded-xl cursor-pointer transition-all shadow-md ${
                        isSubmitting
                          ? 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed'
                          : 'bg-zinc-950 hover:bg-zinc-700 text-white hover:scale-101 active:scale-99'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-zinc-400" />
                          Dispatching Secure Packet...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Dispatch Inquire Request
                        </>
                      )}
                    </button>

                    {/* Submit Success Message block */}
                    <AnimatePresence>
                      {submitSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-emerald-950 leading-tight">Transmission confirmed.</span>
                            <span className="text-[10px] font-mono text-emerald-600 leading-normal">Your socket connection registered successfully. Responses typically route in 6 hrs.</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}