import Anthropic from "@anthropic-ai/sdk";
import { CHITRA_SYSTEM_PROMPT } from "@/lib/chitra-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const CHAT_MODEL = "claude-haiku-4-5";
const ANALYSIS_MODEL = "claude-sonnet-4-6";
const ANUPAM_EMAIL = "ar.anupamsarkar@gmail.com";

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

const FALLBACK_REPLY =
  "I'm offline at the moment — Anupam's API key isn't wired into this environment yet. While you wait, the case studies below tell the whole story; try Divya for the AI-native work or IFU for the framework.";

/** Tools whose call IS the deliverable — their input renders as a card client-side. */
const CARD_TOOLS = new Set([
  "draft_intro_email",
  "analyze_jd_fit",
  "run_ifu_audit",
  "book_call",
]);

const TOOLS: Anthropic.Tool[] = [
  {
    name: "draft_intro_email",
    description:
      "Draft a short intro email the visitor can send to Anupam. Use when the visitor wants to reach out or asks for an intro.",
    input_schema: {
      type: "object",
      properties: {
        subject: { type: "string", description: "Email subject line" },
        body: {
          type: "string",
          description: "Email body, under 120 words, warm and specific",
        },
      },
      required: ["subject", "body"],
    },
  },
  {
    name: "analyze_jd_fit",
    description:
      "Assess how Anupam fits a job description the visitor pasted or described.",
    input_schema: {
      type: "object",
      properties: {
        role_title: { type: "string", description: "The role being assessed" },
        verdict: { type: "string", description: "One-line honest headline" },
        score: { type: "integer", description: "Fit score from 0 to 100" },
        strengths: {
          type: "array",
          items: { type: "string" },
          description: "2-4 specific strengths tied to Anupam's work",
        },
        gaps: {
          type: "array",
          items: { type: "string" },
          description: "0-3 honest gaps",
        },
        relevant_cases: {
          type: "array",
          items: { type: "string" },
          description:
            "Case slugs: dfd-divya, ibm-power-hmc, bt-business-billing, intent-first-ux, gravity-spatial-ui, panchang-engine",
        },
      },
      required: ["role_title", "verdict", "score", "strengths", "relevant_cases"],
    },
  },
  {
    name: "run_ifu_audit",
    description:
      "Audit a product (usually from a URL) through the Intent-First UX framework: Sense, Morph, Confirm, Escape.",
    input_schema: {
      type: "object",
      properties: {
        product: { type: "string", description: "Product name or URL audited" },
        sense: { type: "string", description: "How well it senses visitor intent" },
        morph: {
          type: "string",
          description: "How well the surface reshapes around intent",
        },
        confirm: {
          type: "string",
          description: "How well it lets the visitor verify inferred intent",
        },
        escape: {
          type: "string",
          description: "How well the visitor can leave a personalized path",
        },
        summary: { type: "string", description: "One-line takeaway" },
      },
      required: ["product", "sense", "morph", "confirm", "escape", "summary"],
    },
  },
  {
    name: "book_call",
    description:
      "Offer to set up a call with Anupam. Use when the visitor is ready to talk directly.",
    input_schema: { type: "object", properties: {} },
  },
];

const WEB_FETCH: Anthropic.Messages.ToolUnion = {
  type: "web_fetch_20260209",
  name: "web_fetch",
  max_uses: 3,
};

function sanitizeMessages(input: unknown): Anthropic.MessageParam[] | null {
  if (!input || typeof input !== "object") return null;
  const { messages } = input as { messages?: unknown };
  if (!Array.isArray(messages)) return null;
  const out: Anthropic.MessageParam[] = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") return null;
    const role = (m as ClientMessage).role;
    const content = (m as ClientMessage).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0) return null;
    if (content.length > 8000) return null;
    out.push({ role, content });
  }
  if (out.length === 0 || out.length > 20) return null;
  if (out[0].role !== "user") return null;
  return out;
}

function lastUserText(messages: Anthropic.MessageParam[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user" && typeof messages[i].content === "string") {
      return messages[i].content as string;
    }
  }
  return "";
}

function defaultReplyFor(tool: string): string {
  switch (tool) {
    case "draft_intro_email":
      return "Here's a draft you can send — edit it however you like.";
    case "analyze_jd_fit":
      return "Here's how I read the fit, honestly.";
    case "run_ifu_audit":
      return "Here's the Intent-First read.";
    case "book_call":
      return "Whenever you're ready, I can set up a call.";
    default:
      return "";
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ reply: FALLBACK_REPLY, source: "fallback" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = sanitizeMessages(body);
  if (!messages) {
    return Response.json({ error: "Invalid messages" }, { status: 400 });
  }

  const last = lastUserText(messages);
  const hasUrl = /https?:\/\/[^\s]+/i.test(last);
  const looksLikeJD =
    last.length > 280 &&
    /(responsibilit|requirement|qualificat|experience|you'?ll|we'?re looking|the role|years)/i.test(
      last,
    );
  const useAnalysis = hasUrl || looksLikeJD;

  const model = useAnalysis ? ANALYSIS_MODEL : CHAT_MODEL;
  const tools: Anthropic.Messages.ToolUnion[] = hasUrl
    ? [...TOOLS, WEB_FETCH]
    : TOOLS;

  const client = new Anthropic({ apiKey });
  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: CHITRA_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ];

  try {
    const convo: Anthropic.MessageParam[] = [...messages];
    let response = await client.messages.create({
      model,
      max_tokens: useAnalysis ? 1500 : 500,
      temperature: 0.6,
      system,
      messages: convo,
      tools,
    });

    // Resume the server-side tool loop (web_fetch) if it paused.
    let guard = 0;
    while (response.stop_reason === "pause_turn" && guard < 3) {
      convo.push({ role: "assistant", content: response.content });
      response = await client.messages.create({
        model,
        max_tokens: useAnalysis ? 1500 : 500,
        temperature: 0.6,
        system,
        messages: convo,
        tools,
      });
      guard += 1;
    }

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock =>
        b.type === "tool_use" && CARD_TOOLS.has(b.name),
    );

    const card = toolUse
      ? { type: toolUse.name, data: toolUse.input as Record<string, unknown> }
      : null;

    return Response.json({
      reply: reply || (card ? defaultReplyFor(card.type) : FALLBACK_REPLY),
      card,
      meta: card?.type === "draft_intro_email" ? { to: ANUPAM_EMAIL } : undefined,
      source: "claude",
      usage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
        cacheRead: response.usage.cache_read_input_tokens ?? 0,
        cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      },
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Rate limited — try again in a moment." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Upstream error (${error.status}).` },
        { status: 502 },
      );
    }
    return Response.json({ error: "Unexpected error." }, { status: 500 });
  }
}
