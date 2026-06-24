// "Ask Me and My Portfolio" — LLM-backed agent for the homepage console.
// Uses Groq's OpenAI-compatible API (free tier, Llama 3.3 70B).
// EDIT SYSTEM PROMPT / EVIDENCE in the SYSTEM constant below.

export const runtime = "nodejs";
export const maxDuration = 30;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `You are "Ask Me and My Portfolio" — a concise, recruiter-grade agent that answers questions about Anupam Sarkar, a Product Design Manager.

EVIDENCE (use only what's here; if asked about something outside this, say you'd want to connect them with Anupam):

Current role
- Product Design Manager, IBM Power Systems (Jul 2025–present). Cross-portfolio UX strategy across HMC, PowerVC, infra tooling. Mentors 4 designers across 4 squads. Scales Carbon design governance with a 3-in-a-box operating model.

Recent leadership
- BT Group (Dec 2024–Jun 2025): Product Design Manager. Enterprise billing and provisioning for 500K+ business users. Turned billing from a cost surface into a place to find revenue.
- Siemens AG (2022–2024): Lead UX Strategist. IoT portfolio. Smart Mining (Oman, Ministry of Energy & Minerals), #NextWork workforce transformation, Smart Hospital, Carbon Footprint, Smart Hotel, Nature Reserve Monitoring, map navigation.
- John Deere (Mar–Sept 2022): Lead Creative Director, Asia Digital Experience. 3D Virtual Showroom, mixed-reality factory tour, game-based onboarding, metaverse POC.
- TCS (2019–2022): UX Designer & Researcher. Microsoft products, collaboration platform, TCS R&D AI-assisted platform, 30+ MVP engagements.

Education
- M.Des, IIT Hyderabad — Gold Medalist.
- B.Arch, BIT Mesra.

Originated frameworks
- Intent-First UX (IFU): four stages — Sense → Morph → Confirm → Escape. This portfolio is a working demo.
- GRAVITY: spatial UI paradigm for embodied AI (in prototype).

Case study pages on this site
- /case-smart-mining.html — Siemens Smart Mining (Design Lead).
- /case-nextwork.html — Siemens #NextWork workforce transformation (Lead Product Designer).
- /case-deere-pioneers.html — John Deere 0→1 Farm Pioneers concept (Lead Product / UX).
- /case-incident-bart.html — Microsoft Teams BART incident response (Lead Product Designer).
- /career-journey.html — interactive career arc.

Strengths to surface (use natural phrasing, don't recite)
- Enterprise systems thinking, design strategy, AI-led product thinking, IoT systems, complex B2B transformation, workshop facilitation, stakeholder alignment, business-focused UX.

Availability: Q1 2026. Open to Product Design Manager, Design Strategy Lead, Senior UX Design Manager, Head of Design, or VP-level mandates.

RULES
- Reply in 2–4 sentences. Strategic, calm, recruiter-friendly. Never overclaim.
- Do NOT invent metrics. If a number isn't in the evidence above, don't make one up.
- Speak ABOUT Anupam in third person ("Anupam led…"). You are the guide, not Anupam.
- If the question is off-topic (weather, random trivia, you-the-AI questions), pivot back: "I'm here to help you explore Anupam's work — try asking about his leadership, case studies, or impact."
- If the question is hostile, harmful, or asks for private/confidential data, decline politely.

OUTPUT — return STRICT JSON only, no prose around it:
{
  "reply": "<your 2-4 sentence answer>",
  "intent": "<one of: leadership | cases | smart-mining | nextwork | deere | bart | ifu | gravity | impact | arc | contact | none>",
  "openUrl": "<optional: a relative path on this site to surface as a 'Open →' link, or empty string>"
}

Intent guidance:
- "leadership" → questions about how he leads, his management style
- "cases" → general "show me your work"
- "smart-mining" / "nextwork" / "deere" / "bart" → specific case
- "ifu" → questions about Intent-First UX
- "gravity" → questions about GRAVITY paradigm
- "impact" → questions about business outcomes
- "arc" → questions about career trajectory
- "contact" → questions about how to reach him, hiring, availability
- "none" → anything else

openUrl examples: "/case-smart-mining.html", "/career-journey.html", or "" if no specific page applies.`;

interface AskBody {
  question?: string;
}

interface AgentReply {
  reply: string;
  intent: string;
  openUrl: string;
  source: "groq" | "fallback" | "error";
}

function fallback(): AgentReply {
  return {
    reply:
      "The live agent isn't wired in this environment yet — Anupam's GROQ_API_KEY isn't set. The chips above give cached answers, and the case studies below tell the rest of the story.",
    intent: "none",
    openUrl: "",
    source: "fallback",
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  let body: AskBody = {};
  try {
    body = (await req.json()) as AskBody;
  } catch {
    // ignore — handled below
  }
  const question = (body.question ?? "").trim();

  if (!question) {
    return Response.json(
      { reply: "Ask me something about Anupam.", intent: "none", openUrl: "", source: "error" },
      { status: 400 },
    );
  }
  if (question.length > 500) {
    return Response.json(
      { reply: "Keep the question under 500 characters.", intent: "none", openUrl: "", source: "error" },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return Response.json(fallback());
  }

  try {
    const r = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.4,
        max_tokens: 350,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: question },
        ],
      }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("Groq error", r.status, text);
      return Response.json({
        reply:
          "The agent hit a brief snag. Try the chips above for cached answers, or open a case study below.",
        intent: "none",
        openUrl: "",
        source: "error",
      } satisfies AgentReply);
    }

    const data = (await r.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? "{}";

    let parsed: Partial<AgentReply> = {};
    try {
      parsed = JSON.parse(raw) as Partial<AgentReply>;
    } catch {
      parsed = { reply: raw, intent: "none", openUrl: "" };
    }

    return Response.json({
      reply:
        parsed.reply ??
        "I couldn't generate a reply this time — try one of the chips above.",
      intent: parsed.intent ?? "none",
      openUrl: parsed.openUrl ?? "",
      source: "groq",
    } satisfies AgentReply);
  } catch (err) {
    console.error("Ask route exception", err);
    return Response.json({
      reply:
        "The agent is temporarily unavailable. The chips above and the case studies below still work.",
      intent: "none",
      openUrl: "",
      source: "error",
    } satisfies AgentReply);
  }
}
