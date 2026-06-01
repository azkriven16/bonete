import { GoogleGenAI } from "@google/genai";

interface Env {
  GEMINI_API_KEY: string;
  ASSETS: Fetcher;
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MIN = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const info = rateLimitStore.get(ip);
  if (!info || now > info.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }
  info.count += 1;
  return info.count > MAX_REQUESTS_PER_MIN;
}

function pruneExpiredEntries() {
  const now = Date.now();
  for (const [ip, info] of rateLimitStore) {
    if (now > info.resetTime) rateLimitStore.delete(ip);
  }
}

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

5. HARD SKILLS:
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

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function handleChat(request: Request, env: Env): Promise<Response> {
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  pruneExpiredEntries();

  if (isRateLimited(clientIp)) {
    return json(
      { error: "Message limit reached. Please wait a minute before making another inquiry to keep Euger's portfolio fast for everyone!" },
      429
    );
  }

  let body: { messages?: unknown[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return json({ error: "Invalid messages payload." }, 400);
  }

  const latestUserMsg = messages[messages.length - 1] as { role?: string; content?: string };
  if (latestUserMsg?.role === "user") {
    const content = latestUserMsg.content || "";
    if (content.length > 500) {
      return json(
        { error: "Your request is too long. To keep Euger's portfolio fast and secure, please restrict your questions to 500 characters." },
        400
      );
    }
  }

  const historySlice = messages.slice(-6) as Array<{ role: string; content: string }>;

  const formattedContents = historySlice.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return json({ reply: response.text || "I was unable to formulate a response. Please try again." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An issue occurred while processing your AI chat query.";
    console.error("Gemini API Error:", err);
    return json({ error: message }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname, method } = new URL(request.url);

    if (pathname === "/api/chat" && method === "POST") return handleChat(request, env);
    if (pathname === "/api/health" && method === "GET")
      return json({ status: "healthy", timestamp: new Date().toISOString() });

    return env.ASSETS.fetch(request);
  },
};
