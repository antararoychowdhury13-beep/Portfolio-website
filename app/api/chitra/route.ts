import Anthropic from "@anthropic-ai/sdk";
import { CHITRA_SYSTEM_PROMPT } from "@/lib/chitra-prompt";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 400;

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChitraRequest {
  messages: ClientMessage[];
}

const FALLBACK_REPLY =
  "I'm offline at the moment — Anupam's API key isn't wired into this environment yet. While you wait, the case studies below tell the whole story; try Divya for the AI-native work or IFU for the framework.";

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
    if (content.length > 4000) return null;
    out.push({ role, content });
  }
  if (out.length === 0 || out.length > 20) return null;
  if (out[0].role !== "user") return null;
  return out;
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

  const messages = sanitizeMessages(body as ChitraRequest);
  if (!messages) {
    return Response.json({ error: "Invalid messages" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.6,
      system: [
        {
          type: "text",
          text: CHITRA_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return Response.json({
      reply: reply || FALLBACK_REPLY,
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
    return Response.json(
      { error: "Unexpected error." },
      { status: 500 },
    );
  }
}
