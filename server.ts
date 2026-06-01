import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client strictly with named config parameter
let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured yet. Configure it via Settings > Secrets.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// System instructions seeding factual data about Euger Bonete Jr's portfolio
const PORTFOLIO_SYSTEM_INSTRUCTION = `You are the official Personal AI Assistant representing Euger Bonete Jr, a highly skilled Full-Stack Developer. Your goal is to provide accurate, professional, clean, and helpful answers to users asking about Euger's background, projects, experiences, and technical skills based strictly on his factual portfolio.

Here is the verified information about Euger Bonete Jr:

1. PERSONAL DESCRIPTION:
   - Euger Bonete Jr ("Euger") is a Full-Stack Developer who specializes in designing and engineering modern, highly performant, responsive digital products, type-safe systems, and custom user flows.
   - He started coding about 5 years ago and graduated with a Bachelor of Science in Information Technology (BSIT) in 2025.
   - Availability: Available for new inquiries.
   - Email: eugerbone@email.com
   - Socials: GitHub, LinkedIn, Twitter/X

2. AESTHETIC & DEVELOPMENT PHILOSOPHY:
   - Inspired by the Swiss minimal movement, Apple interfaces, and Google material readability.
   - Rejects visual clutter, emphasizing strict grid discipline, clean alignment, margins, weights, and high-contrast micro-interactions.
   - Focuses on Product-Minded Engineering: software should be invisible, completely natural, instantly responsive, and code is a means to deliver user and business value.

3. FLAGSHIP PROJECTS:
   - VIAFIX: (Viafide) A premium, high-security client verification platform built to validate qualifications instantly using secure cryptographic proof hashing.
     * Tech Stack: React, TypeScript, Tailwind CSS, Node.js, Cryptographic Hashing.
     * Metrics: <12ms verification API latency, 24k+ credentials logged, 100% secured integrity.
   - GLOBAL TALENT PORTAL: A unified talent marketplace connecting employers with candidate match-making using multi-criteria indexing.
     * Tech Stack: Next.js, React, TypeScript, Tailwind CSS, Server APIs.
     * Metrics: 1.8ms match index latency, 8.5k+ active talents, 99.4% onboarding index.
   - CIPTAX PRO: Professional tax and accounting services suite featuring corporate deductible tier calculators.
     * Tech Stack: React SPA, TypeScript, Tailwind CSS, Vite, Tax calculators.
     * Metrics: 3.2k+ inquiries routed, 100% filing precision, 90% smaller asset payloads.

4. WORK EXPERIENCE:
   - Freelance Web Developer (Independent, 2023 - Present): Built and shipped production platforms (Viafide, Global Talent Portal, Ciptax Pro).
   - Part-time Software Developer at Rocketshyft (2024 - 2025): Polished TypeScript UI improvements and user interfaces.
   - Software Engineering Intern at Digipay (2022): Developed responsive React client features in an Agile scrum environment with Jira sprint tracking.

5. HARD skills:
   - Frontend: Next.js, React 19/18, TypeScript, Tailwind CSS, Framer Motion (using motion/react).
   - Backend & Systems: Node.js/Bun, Express, NestJS, Rust, Prisma ORM, GraphQL/gRPC.
   - Database, Cloud & CI/CD: PostgreSQL, Supabase, Firebase, Docker, Vercel, Cloudflare, GitHub Actions.

6. DYNAMIC ON-PAGE HIGHLIGHTS:
   - Interactive Registry Plaza: A beautifully fluid real-time HTML5 Canvas crowd simulation that populates pixel-retro avatars representing active visitors moving around. Designed strictly without clutter.
   - Aesthetic customizers: A floating workspace modifier allowing full aesthetic precision over the page layout colors and layout borders.

INSTRUCTION RULES:
- Keep responses clean, concise, elegant, and highly professional.
- Use simple Markdown format (bold text, lists, code accents where appropriate) to render answers.
- Avoid any mock or simulated metadata lines (e.g., do not output "[System: OK]" or fake pings).
- Talk directly as Euger's official Personal Assistant (or as Euger himself if easier, but always refer clearly to the portfolio guidelines).
- If asked about contacting Euger, gently guide them to the Contact section, or share his email: eugerbone@email.com.
- If asked about anything unrelated to computer science, web development, or Euger's portfolio, politely explain your purpose as Euger's portfolio assistant and guide the conversation back to his amazing work.`;

// Chat interaction rate limiter (Memory-bound sliding window)
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_MIN = 10; // 10 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const info = rateLimitStore.get(ip);
  if (!info) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }
  if (now > info.resetTime) {
    info.count = 1;
    info.resetTime = now + WINDOW_MS;
    return false;
  }
  info.count += 1;
  return info.count > MAX_REQUESTS_PER_MIN;
}

// Memory safety builder - prune expired rate-limiter keys every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

// Chat interaction endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // 1. IP Rate Limiting to avoid abusive automated spam
    const clientIp = (req.headers["x-forwarded-for"] as string || req.ip || "unknown-ip").split(",")[0].trim();
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: "Message limit reached. Please wait a minute before making another inquiry to keep Euger's portfolio fast for everyone!",
      });
    }

    // 2. Validate basic input schema
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload." });
    }

    // 3. Enforce maximum character bounds per inquiry (500 chars)
    const latestUserMsg = messages[messages.length - 1];
    if (latestUserMsg && latestUserMsg.role === "user") {
      const messageContent = latestUserMsg.content || "";
      if (messageContent.length > 500) {
        return res.status(400).json({
          error: "Your request is too long. To keep Euger's portfolio fast and secure, please restrict your questions to 500 characters."
        });
      }
    }

    // 4. Truncate conversation context history to the last 6 messages
    const SLIDING_HISTORY_BOUND = 6;
    const historySlice = messages.slice(-SLIDING_HISTORY_BOUND);

    const aiClient = getGeminiClient();

    const formattedContents = historySlice.map((m: any) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content }],
      };
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was unable to formulate a response. Let me try again with another query.";
    res.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini API Error in /api/chat:", err);
    res.status(500).json({
      error: err.message || "An issue occurred while processing your AI chat query. Please try again.",
    });
  }
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Setup Vite and Static Asset servers
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Portfolio running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start full-stack portfolio server:", err);
});
