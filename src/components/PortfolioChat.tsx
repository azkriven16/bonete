import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, User, Trash2, ArrowUpRight, HelpCircle, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function parseInlineMarkdown(text: string): ReactNode[] {
  // Split on bold: **bold** or inline code: `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-zinc-950 font-sans">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="font-mono bg-zinc-100 text-[10px] px-1.5 py-0.5 rounded text-zinc-700 font-semibold border border-zinc-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

interface MarkdownRendererProps {
  content: string;
  isUser: boolean;
}

function MarkdownRenderer({ content, isUser }: MarkdownRendererProps) {
  if (isUser) {
    return <span className="font-sans text-xs leading-relaxed">{content}</span>;
  }

  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  const flushList = (keyPrefix: string | number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${keyPrefix}`} className="list-disc pl-5 my-1.5 space-y-1 text-zinc-750 font-light text-xs">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check header
    if (trimmed.startsWith("### ")) {
      flushList(index);
      elements.push(
        <h4 key={index} className="text-xs font-black text-zinc-950 uppercase tracking-wider font-sans mt-3.5 mb-1 bg-zinc-100/50 p-1 px-2 rounded-md inline-block">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      flushList(index);
      const headerText = trimmed.startsWith("## ") ? trimmed.slice(3) : trimmed.slice(2);
      elements.push(
        <h3 key={index} className="text-xs font-black text-zinc-950 font-sans mt-4 mb-1.5">
          {parseInlineMarkdown(headerText)}
        </h3>
      );
      return;
    }

    // List bullets
    const isBulletMatch = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
    if (isBulletMatch) {
      const cleanText = trimmed.startsWith("* ") || trimmed.startsWith("- ") ? trimmed.slice(2) : trimmed.slice(1);
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed">
          {parseInlineMarkdown(cleanText)}
        </li>
      );
      return;
    }

    // Empty line separates paragraphs
    if (!trimmed) {
      flushList(index);
      elements.push(<div key={`gap-${index}`} className="h-2" />);
      return;
    }

    // Regular line
    flushList(index);
    elements.push(
      <p key={index} className="leading-relaxed font-light text-zinc-700 my-1 first:mt-0 last:mb-0">
        {parseInlineMarkdown(line)}
      </p>
    );
  });

  flushList("end");

  return <div className="space-y-1 py-0.5">{elements}</div>;
}

const PRESET_PROMPTS = [
  { label: "⚡ Flagship Projects", prompt: "What are your flagship projects and their key performance metrics?" },
  { label: "🛠️ Technical Superpowers", prompt: "Tell me about your tech stack across frontend, backend, and cloud databases." },
  { label: "💼 Professional Experience", prompt: "Can you summarize your work experience and independent freelance history?" },
  { label: "☕ Contact Info", prompt: "How can I contact you or get in touch regarding a new development inquiry?" }
];

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [quotaCount, setQuotaCount] = useState(0);
  const [quotaWindowStart, setQuotaWindowStart] = useState<number>(Date.now());
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingIntervalRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  // Clean up typing stream and countdown on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Initialize with a welcoming greeting
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        initDefaultGreeting();
      }
    } else {
      initDefaultGreeting();
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("portfolio_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen, isLoading]);

  // Set focus on input box when panel pops up
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Prevent background scrolling on mobile when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const initDefaultGreeting = () => {
    const initialGreeting: Message = {
      id: "system-greeting-0",
      role: "assistant",
      content: "Hello! I am Euger's official Personal AI Assistant. ☕\n\nI can answer questions about his software engineering background and full-stack tech stack. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([initialGreeting]);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading || isStreaming) return;

    if (trimmed.length > 500) {
      setErrorStatus("Message is too long (over 500 characters). Please condense your inquiry.");
      return;
    }

    setErrorStatus(null);

    // Track local quota window (mirrors the server's 10 req/min limit)
    const now = Date.now();
    if (now - quotaWindowStart > 60000) {
      setQuotaCount(1);
      setQuotaWindowStart(now);
    } else {
      setQuotaCount((prev) => prev + 1);
    }

    const userMessage: Message = {
      id: `m-${Date.now()}-user`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const payloadMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!res.ok) {
        const rawBody = await res.text().catch(() => "");
        let errData: { error?: string } = {};
        try { errData = JSON.parse(rawBody); } catch { /* non-JSON body */ }
        if (res.status === 429) {
          const secondsLeft = Math.max(5, Math.ceil((60000 - (Date.now() - quotaWindowStart)) / 1000));
          setRateLimitCountdown(secondsLeft);
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = setInterval(() => {
            setRateLimitCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(countdownRef.current);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
        throw new Error(errData.error || `[${res.status}] ${rawBody.slice(0, 200) || "Server response failed."}`);
      }

      const data = await res.json();
      const replyText = data.reply;

      setIsLoading(false);
      setIsStreaming(true);

      const assistantMessageId = `m-${Date.now()}-assistant`;
      const assistantMessagePlaceholder: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMessagePlaceholder]);

      // Split into words while retaining spaces
      const words = replyText.split(/(\s+)/);
      let currentWordIndex = 0;
      let streamedContent = "";

      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }

      streamingIntervalRef.current = setInterval(() => {
        if (currentWordIndex < words.length) {
          streamedContent += words[currentWordIndex];
          currentWordIndex++;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: streamedContent }
                : msg
            )
          );
        } else {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
          }
          setIsStreaming(false);
        }
      }, 15);

    } catch (err: any) {
      console.error("AI Error:", err);
      setErrorStatus(err.message || "An error occurred. Check if your API key is defined in Setting > Secrets.");
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const currentStatusMsg = () => {
    if (errorStatus?.includes("GEMINI_API_KEY")) {
      return (
        <div className="p-3 bg-red-50 text-red-900 text-xs border border-red-200/60 rounded-xl space-y-1 my-3">
          <p className="font-bold flex items-center gap-1.5 font-sans">
            API key missing
          </p>
          <p className="font-light text-red-700 leading-normal">
            The backend is ready but the Gemini API Key is not configured yet. Please open **Settings &gt; Secrets** in your AI Studio dashboard and add `GEMINI_API_KEY`.
          </p>
        </div>
      );
    }
    return (
      <div className="p-3 bg-red-50 text-red-900 text-xs border border-red-150 rounded-xl my-3">
        {errorStatus}
      </div>
    );
  };

  const resetChat = () => {
    localStorage.removeItem("portfolio_chat_history");
    setErrorStatus(null);
    initDefaultGreeting();
  };

  return (
    <>
      {/* Visual Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="pointer-events-auto"
            >
              <button
                id="contact-ai-dock-btn"
                onClick={() => setIsOpen(true)}
                className="group relative w-14 h-14 rounded-full bg-zinc-950 text-zinc-50 shadow-2xl hover:bg-zinc-800 dark:hover:bg-zinc-700 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none flex items-center justify-center"
              >
                <MessageSquare className="w-6 h-6 text-zinc-50 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide-out Interactive Dialog Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-stretch md:items-end justify-stretch md:justify-end p-0 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="pointer-events-auto w-full h-full md:h-[620px] md:max-h-[85vh] md:max-w-lg bg-white md:rounded-3xl border-0 md:border md:border-zinc-200 shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Slate Pattern Header */}
              <div className="p-4 px-4 pt-6 md:pt-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50 select-none gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-[#1c1c1f] flex items-center justify-center text-zinc-50 dark:text-[#fafafa] font-serif shadow-sm relative shrink-0">
                    <Bot className="w-4 h-4 text-zinc-50 dark:text-[#fafafa]" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090a]" />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-950 tracking-tight leading-snug">
                        Euger&apos;s Recruiter Assistant
                      </h3>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest leading-none py-0.5 px-1 bg-zinc-150 text-zinc-650 rounded shrink-0 select-none">
                        Gemini AI
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider leading-none mt-1 truncate">
                      Status: Online // Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <button
                    onClick={resetChat}
                    title="Clear history"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Close chat"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 cursor-pointer active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Feed Canvas */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/50 scrollbar-thin scrollbar-thumb-zinc-200">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 w-full max-w-[92%] md:max-w-[85%] ${
                      m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* User / Bot Avatar Pill */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        m.role === "user" ? "bg-zinc-950 dark:bg-[#1c1c1f] text-zinc-50 dark:text-[#fafafa]" : "bg-white border border-zinc-200 text-zinc-950"
                      }`}
                    >
                      {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div
                        className={`p-3 px-4 rounded-2xl text-xs leading-relaxed w-fit ${
                          m.role === "user"
                            ? "bg-zinc-950 dark:bg-[#1c1c1f] text-zinc-50 dark:text-[#fafafa] font-sans rounded-tr-none shadow-sm whitespace-pre-wrap ml-auto text-left"
                            : "bg-white text-zinc-850 border border-zinc-150 rounded-tl-none shadow-sm mr-auto text-left"
                        }`}
                      >
                        <MarkdownRenderer content={m.content} isUser={m.role === "user"} />
                      </div>
                      <div
                        className={`text-[9px] font-mono text-zinc-400 ${
                          m.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 mr-auto w-full max-w-[92%] md:max-w-[85%]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 text-zinc-950 flex items-center justify-center shrink-0 animate-spin">
                      <Loader2 className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="bg-white border border-zinc-150 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 mr-auto">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                {errorStatus && currentStatusMsg()}
                <div ref={endOfMessagesRef} />
              </div>

              {/* Chips for Presets & Navigation assist */}
              <div className="p-3 border-t border-zinc-150 bg-white space-y-2 select-none">
                <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-semibold pl-2">
                  <HelpCircle className="w-3 h-3 text-zinc-400" /> Suggested Inquiries
                </div>
                <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 scrollbar-none px-2 -mx-2">
                  {PRESET_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      disabled={isLoading || isStreaming}
                      onClick={() => handleSendMessage(p.prompt)}
                      className={`text-[10px] border rounded-full p-1.5 px-3.5 text-left transition-all duration-100 flex items-center gap-0.5 shrink-0 whitespace-nowrap ${
                        isLoading || isStreaming
                          ? "opacity-40 bg-zinc-50 dark:bg-[#1c1c1f] border-zinc-200 dark:border-[#27272a] text-zinc-400 cursor-not-allowed pointer-events-none"
                          : "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-[#1c1c1f] border-zinc-200/80 dark:border-[#27272a] hover:bg-zinc-950 dark:hover:bg-[#27272a] hover:text-zinc-50 dark:hover:text-[#fafafa] active:scale-95 cursor-pointer"
                      }`}
                    >
                      {p.label}
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-50 ml-0.5 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quota / Rate-limit status bar */}
              {rateLimitCountdown !== null ? (
                <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-700 font-semibold">
                    Rate limit reached — try again in {rateLimitCountdown}s
                  </span>
                  <span className="text-[9px] font-mono text-amber-500">10/10 used</span>
                </div>
              ) : quotaCount >= 7 ? (
                <div className="px-4 py-1.5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                    API quota
                  </span>
                  <span className={`text-[9px] font-mono font-semibold ${quotaCount >= 9 ? "text-red-500" : "text-amber-500"}`}>
                    {quotaCount}/10 messages this minute
                  </span>
                </div>
              ) : null}

              {/* Bottom Interactive Message Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="p-3 px-4 border-t border-zinc-150 flex items-center gap-2 bg-white relative"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={500}
                    placeholder={rateLimitCountdown !== null ? `Rate limited — retry in ${rateLimitCountdown}s` : isStreaming ? "Wait for AI response to finish..." : "Ask about Euger's credentials, stack, projects..."}
                    disabled={isLoading || isStreaming || rateLimitCountdown !== null}
                    className="w-full bg-zinc-50 border border-zinc-250 py-2.5 pl-4 pr-12 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all font-sans text-zinc-850 placeholder-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {inputValue.length > 0 && (
                    <span className={`absolute right-3.5 text-[9px] font-mono font-medium ${
                      inputValue.length >= 450 ? "text-red-500 font-bold" : "text-zinc-400"
                    }`}>
                      {inputValue.length}/500
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || isStreaming || !inputValue.trim()}
                  className="bg-zinc-950 dark:bg-[#1c1c1f] text-zinc-50 dark:text-[#fafafa] p-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-[#27272a] disabled:opacity-40 disabled:hover:bg-zinc-950 dark:disabled:hover:bg-[#1c1c1f] active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0 w-10 h-10"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
