import type { CaseSlug } from "./personas";
import { PickArtifact } from "@/components/CaseArtifacts";

export interface ArtifactSpec {
  num: string;
  kind: "BET" | "ALT" | "CONSTRAINT" | "SYSTEM" | "ARTIFACT" | "RESULT";
  caption: string;
  visualLabel: string;
  visualValue?: string;
}

export interface DepthSection {
  heading: string;
  body: string;
}

export interface CaseContent {
  intro: string;
  stats: { value: string; label: string }[];
  layer2: ArtifactSpec[];
  quote: string;
  depth: DepthSection[];
  proves: string;
  next: CaseSlug;
}

export const CASE_CONTENT: Record<CaseSlug, CaseContent> = {
  "dfd-divya": {
    intro:
      "I led the design of Divya — a devotional companion built on Claude that does not look like a chat app. The interface itself is the agent: it observes the visitor's ritual context, narrates its reasoning, and reshapes the surface around what is being practiced. Two years from sketch to shipped, with 180k devotees this month.",
    stats: [
      { value: "180k", label: "monthly devotees" },
      { value: "92%", label: "retention · 30d" },
      { value: "<400ms", label: "agent response" },
      { value: "1", label: "interface, not a chatbot" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If the interface is the agent — not a feature inside a chat — devotional users will stop treating AI as a curiosity and start treating it as a participant in the ritual.",
        visualLabel: "the shape of the bet",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "Three alternatives rejected: a chatbot with a Sanskrit skin, a voice-only experience, and a pure dashboard. Each one made the AI a tool, not a presence.",
        visualLabel: "three rejected futures",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Devotional users distrust shiny UI. They want gravity, silence, and ritual permanence. Every animation had to feel earned, not performed.",
        visualLabel: "the restraint constraint",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "I built the Sense → Morph → Confirm → Escape spine. Every screen has one job at one stage. The agent never spans two stages without consent.",
        visualLabel: "IFU applied",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The Panchang Engine — a generative almanac that computes 60k events a year. The agent reads it as context before it speaks. It is why Divya never feels generic.",
        visualLabel: "panchang engine · context layer",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "180k MAU at month four. 92% 30-day retention. The interface, not the model, is what people credit when they describe what Divya does.",
        visualLabel: "30-day retention",
        visualValue: "92%",
      },
    ],
    quote:
      "The hardest part of designing an agent is not making it smart. It is making its intelligence legible — letting the visitor see it observe, decide, act — without turning the interface into a debugger.",
    depth: [
      {
        heading: "Why the chat metaphor was the wrong starting point",
        body:
          "Every other devotional product starts from chat. Chat is a 1990s metaphor for a 2026 problem — it forces the agent into a turn-taking rhythm that is incompatible with ritual. Ritual is ambient, recursive, and silent more than it speaks. We started from the ritual and let the agent inhabit it, not the other way around.",
      },
      {
        heading: "The four-state agent loop",
        body:
          "Idle, observing, deciding, acting. The states are visible because legibility is the entire trust mechanic. When the visitor sees the agent thinking — for at least 600ms — they extend it grace. When they don't, they assume scripted nonsense. The pause is not lag; it is the proof.",
      },
      {
        heading: "Where Claude lives in the system",
        body:
          "Claude is the reasoning kernel; it never sees the visitor's full state. The interface is the orchestration layer. Tool calls — reorder_ritual, surface_mantra, narrate_intent — are written in code, called by the model, executed by the UI. The model never touches the DOM. The DOM never touches the model. That separation is the design.",
      },
    ],
    proves:
      "I can lead the design of an AI-native product end-to-end — thesis, framework, system, surface, ship — at consumer scale.",
    next: "intent-first-ux",
  },

  "intent-first-ux": {
    intro:
      "Intent-First UX (IFU) is the framework I wrote in 2025 after I noticed every AI product I had been hired to design was failing the same four moments. It is now used inside two unannounced agent products at AI labs, and taught as method at Cohere and Druid. The framework is the case.",
    stats: [
      { value: "4", label: "stages · sense / morph / confirm / escape" },
      { value: "2", label: "AI labs using internally" },
      { value: "11", label: "products audited with it" },
      { value: "0", label: "stages anyone has added" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If AI interfaces are failing in the same four predictable moments, then a framework that names the moments will let any designer ship calmer, more trustworthy agents — without inventing language each time.",
        visualLabel: "the predictable failure pattern",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "I considered four-quadrants, decision trees, and a heuristic checklist. Each one collapsed the moment a designer asked: which moment am I in right now? Stages were the only model that survived contact.",
        visualLabel: "three rejected models",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Frameworks rot. Mine had to be short enough to memorise, generative enough to redraw, and embarrassing enough to be obviously incomplete if I added a fifth stage.",
        visualLabel: "the four-word constraint",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "Sense the intent. Morph the surface. Confirm the action. Escape the loop. Each stage has its own failure mode, its own metric, and its own gesture. The system is the spine.",
        visualLabel: "the IFU spine",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The critique surface — the screenshot-scoring tool on /frameworks — runs Claude against the IFU rubric in real time. The framework is not a PDF; it is a working evaluator.",
        visualLabel: "the critique evaluator",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "Adopted at two AI labs and three enterprise products. The strongest signal isn't usage — it's that designers I have never met now use the four stage-names in their own work without crediting me. Frameworks succeed when they disappear.",
        visualLabel: "adoption · unattributed",
        visualValue: "2 labs",
      },
    ],
    quote:
      "A framework that requires me to be in the room is not a framework. It is a consulting engagement with delusions.",
    depth: [
      {
        heading: "Why every AI product fails the Sense stage first",
        body:
          "Most AI products skip Sense — they assume the user has already typed enough. Sense is the moment the interface decides what kind of intelligence is needed. Get this wrong and the rest of the loop is loud activity in the wrong direction. The fix is almost always: surface less, ask one shaped question, and wait.",
      },
      {
        heading: "Morph is where designers panic",
        body:
          "Morph is the visible reshaping of the interface to match what was sensed. Designers panic here because it breaks the contract that 'the UI stays still.' But that contract was always a lie — the UI was reshaping you. Morph just makes it honest. The rule: morph slowly enough that the user can see what changed, fast enough that they don't think it broke.",
      },
      {
        heading: "Escape is the stage no one builds",
        body:
          "Confirm gets attention because it's where the action fires. But Escape — the ability to back out of the loop, undo the morph, return to ambient state — is what makes an agent trustworthy. Build Escape first; it is the only stage that retroactively pays for the other three.",
      },
    ],
    proves:
      "I write frameworks that travel outside my own work. Method as deliverable.",
    next: "gravity-spatial-ui",
  },

  "gravity-spatial-ui": {
    intro:
      "GRAVITY is the spatial-UI framework I wrote after shipping two visionOS prototypes and watching the entire industry try to nail floating 2D rectangles to your face. It models the four planes an embodied agent must respect — Ground, Ring, Atmosphere, Voice — and argues, in public, that any agent stuck in a rectangle is a chatbot wearing a hat.",
    stats: [
      { value: "4", label: "planes · ground / ring / atmosphere / voice" },
      { value: "2", label: "visionOS prototypes shipped" },
      { value: "1", label: "essay · 14k reads" },
      { value: "0", label: "rectangles" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If we keep porting 2D mental models into spatial computing, embodied AI will feel like a phone glued to a window. The bet: name the planes, and the right design becomes obvious.",
        visualLabel: "the porting trap",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "Three alternatives I rejected: a layered Z-axis model, a 'volumetric Material Design,' and a pure gaze-based system. Each one preserved the rectangle. GRAVITY removes it.",
        visualLabel: "three rejected spatial models",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Spatial UI design at this stage of the industry has zero shared vocabulary. The framework had to be teachable to a developer in 90 seconds — or it would die in the docs.",
        visualLabel: "the 90-second test",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "Ground: where physics lives. Ring: where the user reaches. Atmosphere: where ambient agents drift. Voice: where intent enters. Each plane owns a different latency, density, and trust gradient.",
        visualLabel: "the four planes",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The visionOS prototype — a research-mode wearable that lets a Claude-powered agent live in Atmosphere and surface to Ring only when summoned. The agent is invisible until it is asked.",
        visualLabel: "visionOS · ambient agent prototype",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "The essay hit 14k reads in six weeks; the prototype convinced a target hiring team that I understood spatial without needing them to teach me. Frameworks are interview multipliers.",
        visualLabel: "essay reads · 6 weeks",
        visualValue: "14k",
      },
    ],
    quote:
      "An agent that lives in a window is a chatbot wearing a hat. Spatial computing only matters if the agent can live somewhere the window cannot.",
    depth: [
      {
        heading: "Why the Ring plane is the most contested",
        body:
          "Ring is where the user reaches with their hand — roughly 30 to 60 cm from the head. It is the most contested plane because every product team wants to put everything there. The discipline is the opposite: Ring is for the one thing the user is acting on right now, and nothing else. Anything that doesn't earn Ring belongs in Atmosphere.",
      },
      {
        heading: "Voice is a plane, not a modality",
        body:
          "The mistake everyone makes is treating voice as a competing modality to touch. In GRAVITY, Voice is a plane — it has spatial properties, decay, directionality, a trust radius. Treat voice as a plane and the question 'should this be voice or visual?' dissolves into 'which plane is the right home for this action?'",
      },
      {
        heading: "The framework's deliberate omission",
        body:
          "GRAVITY does not have a fifth plane for time, or for memory, or for social presence. I have been asked to add each one and have refused each time. Frameworks die from completeness, not from gaps. Four is the maximum a designer can hold in working memory while sketching.",
      },
    ],
    proves:
      "I can hold the line on a framework that the market wants to dilute. Conviction as craft.",
    next: "panchang-engine",
  },

  "ibm-power-hmc": {
    intro:
      "I led the redesign of the IBM Power Hardware Management Console — the platform 30k+ enterprise admins use to manage Power systems running mission-critical workloads. Three years. Zero retraining budget. Cut median task time on the top five flows by 41% without moving anyone's mental model more than an inch.",
    stats: [
      { value: "30k+", label: "operators served" },
      { value: "41%", label: "median task-time cut" },
      { value: "0", label: "retraining hours" },
      { value: "5", label: "flagship flows redesigned" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If we redesign the surface without forcing operators to relearn the model, we can ship a 30%+ efficiency lift inside a workforce that hates UI changes. The bet was on continuity, not novelty.",
        visualLabel: "the continuity bet",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "Three alternatives proposed: a full SPA rewrite, a 'Power lite' parallel surface, and a chrome-only refresh. Each one either over-promised or under-shipped. The chosen path was surgical.",
        visualLabel: "three rejected scopes",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Operators run scripts on top of the UI; any DOM change risks breaking customer automation. Every change had to be either backwards-compatible or feature-flagged behind a per-tenant toggle.",
        visualLabel: "the automation constraint",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "We built a task-time instrumentation layer first — before any pixel changed. Decisions were ranked by measured friction, not by team preference. The system was a measurement loop.",
        visualLabel: "the measurement loop",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The new partition-creation flow — the single highest-volume task — compressed nine screens to three by deferring expert options behind a progressive-disclosure pattern. Expert flow unchanged.",
        visualLabel: "partition flow · 9 → 3",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "41% median task-time cut across the top five flows. NPS up 23 points. Zero operators required retraining — verified through a 6-week field study across three enterprise customers.",
        visualLabel: "task-time cut",
        visualValue: "↓ 41%",
      },
    ],
    quote:
      "The hardest enterprise redesign is the one no one notices. Operators didn't say 'this is beautiful' — they said 'wait, did something change?' and then closed half the tabs they used to keep open.",
    depth: [
      {
        heading: "Why we instrumented before we designed",
        body:
          "Teams that redesign enterprise platforms usually start with screenshots and end with opinions. We started with telemetry. Six months of measuring real operators completing real tasks gave us a ranked list of friction the design team could not have intuited — including two flows where the apparent 'mess' was actually how operators recovered from upstream failures. Don't redesign what you can't measure.",
      },
      {
        heading: "The progressive-disclosure spine",
        body:
          "Power admins range from new operators clicking through wizards to senior SREs who script the entire console. The redesign worked because we built one spine — defaults visible, expert options one click away, scripts unchanged — instead of forking the experience by user type. Forking enterprise UIs is how you end up maintaining three products.",
      },
      {
        heading: "Why design leadership at IBM is mostly negotiation",
        body:
          "Design leadership inside a 100k-person org is roughly 30% craft and 70% negotiation across product, engineering, support, services, and the customer council. The instrumentation layer was the negotiation lever — once we had numbers, the debate moved from taste to evidence. Design leaders who refuse to be quantitative inside enterprise will lose every argument that matters.",
      },
    ],
    proves:
      "I can lead a multi-year enterprise platform redesign with measurable, retraining-free impact at director scale.",
    next: "siemens-workforce-transformation",
  },

  "siemens-workforce-transformation": {
    intro:
      "I led the design of the digital tool that operationalized Siemens' #NextWork methodology — a five-step framework for translating business strategy into named, individualized development paths. Eleven months. Eight stakeholder archetypes. A 300,000-person, 190-country organization. The distinctive move was treating this not as an HR analytics product but as a service blueprint problem.",
    stats: [
      { value: "300k+", label: "employees served · 190 countries" },
      { value: "120+", label: "workstreams · 30+ countries scaled" },
      { value: "72%", label: "reskilled in place · Bad Neustadt" },
      { value: "8", label: "user archetypes · one tool" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If we design the tool as a connected service that produces a named output for a named person — not as an HR dashboard — workforce transformation stops being a slide deck and becomes operational reality.",
        visualLabel: "the operational bet",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "Three alternatives rejected: a redesigned HR dashboard, a consulting deliverable that would die in PowerPoint, and a federation of point tools per persona. Each preserved the gap between strategy and execution.",
        visualLabel: "three rejected framings",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Eight archetypes, 22 ecosystem connection points, GDPR, regional labor law across 30+ countries, and a German works council that arrived in Month 7. Every design decision had to survive all of them.",
        visualLabel: "the constraint stack",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "Information architecture anchored on the #NextWork methodology, not on features. Same data, four persona lenses. The handoff chain was the product — one role's output became the next role's input.",
        visualLabel: "methodology-as-IA",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "Persona Lenses — a single dataset rendered four different ways for executives, HR business partners, IT managers, and employees. Each persona reads the same skill state in their own vocabulary, with their own next action.",
        visualLabel: "persona lenses · same data",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "Scaled to 120+ workstreams across 30+ countries. At Bad Neustadt, 72% of 550 employees were re-skilled or up-skilled in place instead of restructured. A BU CEO called it the best HR project in 30 years.",
        visualLabel: "reskilled in place",
        visualValue: "72%",
      },
    ],
    quote:
      "We knew that we had to do something. We just didn't know what. The tool's job wasn't to answer the question — it was to let every role in the org answer it together, in their own language, on the same evidence.",
    depth: [
      {
        heading: "Why we designed a service, not a dashboard",
        body:
          "The temptation was to build an HR analytics dashboard — every interview, every shadowed planning session, every line of telemetry pointed away from it. The real failure wasn't analysis; it was handoff. Strategy left the executive's room and never arrived in the HRBP's spreadsheet. The HRBP's plan left her desk and never reached the employee's career page. We designed for the handoffs first, and the screens fell out of them. The product became a connected workflow that produced a named output for a named person — that single framing decision is what made the methodology operable at scale.",
      },
      {
        heading: "The works council reframe — Month 7",
        body:
          "I initially mis-positioned the German works council as a compliance checkbox to be cleared late. That was wrong. When they engaged in Month 7, their objections didn't slow us down — they reshaped the entire data-visibility model into something more trustworthy. Individual-level skill data became opt-in by employee. Aggregations defaulted to a minimum cohort size. The works council went from blocker to co-designer. The lesson I carry forward: every regulatory stakeholder is a designer of the trust surface, whether the team treats them that way or not.",
      },
      {
        heading: "Information architecture as the most contested decision",
        body:
          "I led the team to structure the IA on the methodology spine — Sense the trend, Translate to skill, Plan the path, Execute, Measure — rather than on features. This was contested for weeks. Feature-led IA is easier to ship and easier to demo. Methodology-led IA is the only one that lets eight different archetypes hold the same mental model. The decision held because the persona-lens system made it cheap: same backbone, different surface per role. Without the lenses, methodology-led IA would have collapsed under its own ambition.",
      },
    ],
    proves:
      "I can lead a service-design problem masquerading as a product UI — across eight archetypes, dozens of systems, and a regulatory landscape — and ship something the business actually operates.",
    next: "bt-business-billing",
  },

  "bt-business-billing": {
    intro:
      "I led the redesign of the BT Business billing experience for 1.2 million small- and mid-business accounts. Replaced a 14-page PDF invoice with a single living statement that answers the next question before the customer asks it. Shipped under a UK regulator's compliance constraint; reduced billing-related support contact by 38%.",
    stats: [
      { value: "1.2M", label: "SMB accounts" },
      { value: "↓ 38%", label: "billing support contact" },
      { value: "14 → 1", label: "pages · invoice surface" },
      { value: "AA", label: "WCAG compliance" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If the bill answered the customer's next question before they had to call, billing-related support contact would collapse — and SMB owners would stop dreading the email subject line 'your BT invoice.'",
        visualLabel: "the next-question bet",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "Three alternatives rejected: a redesigned PDF, a chatbot-on-top, and a full self-service portal split. Each preserved the underlying anxiety. The chosen path collapsed the invoice into a statement.",
        visualLabel: "three rejected paths",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "UK Ofcom rules dictate what must appear on a B2B bill. The redesign had to honour every regulatory line item — and still feel like a single readable document, not a compliance dump.",
        visualLabel: "the ofcom constraint",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "A statement engine that takes 14 source PDF sections and renders them as one progressive HTML document — each section collapsing into a summary line, expanding only when the customer asks.",
        visualLabel: "the statement engine",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The 'why did this change?' inline answer — a system that detects month-over-month deltas and pre-writes the explanation in plain English. The number one billing question, answered without asking.",
        visualLabel: "delta explainer · inline",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "38% reduction in billing-related contact volume in the first six months. Customer-satisfaction (CSAT) on billing up 31 points. The bill became the most-praised surface of the entire BT Business product.",
        visualLabel: "billing support contact",
        visualValue: "↓ 38%",
      },
    ],
    quote:
      "A bill is the place where the company is most likely to be hated. Redesign the bill, and you redesign the entire relationship.",
    depth: [
      {
        heading: "The regulatory constraint that became the design",
        body:
          "Ofcom rules looked like a wall — every line item, every taxonomy, every disclosure. The breakthrough came when we stopped treating them as constraints and started treating them as the grammar of the document. Each rule became a section type. The redesign was not 'us versus regulation'; it was a typesetting problem at scale.",
      },
      {
        heading: "Why we built the delta explainer",
        body:
          "Six weeks of call-centre transcript analysis showed that 64% of billing calls started with the same sentence: 'why is my bill different this month?' Instead of redesigning the call experience, we wrote the answer onto the bill. The customer never reaches for the phone. That single feature drove most of the support-volume reduction.",
      },
      {
        heading: "Designing for trust at consumer scale, not B2B",
        body:
          "BT Business buyers are small business owners — solo accountants, café operators, fitness studios. They are consumers in every emotional sense, even though the contract is B2B. The redesign succeeded because we wrote the copy at year-7 reading level, not corporate-procurement level. Enterprise designers who carry the corporate voice into SMB lose the audience in two sentences.",
      },
    ],
    proves:
      "I can lead a consumer-grade redesign of a regulated, mission-critical surface — and reduce operating cost while raising satisfaction.",
    next: "panchang-engine",
  },

  "panchang-engine": {
    intro:
      "The Panchang Engine is the generative Vedic almanac that powers Divya. It computes 60,000 ritual events per year — tithis, nakshatras, yogas, festivals — and surfaces exactly the right one to the right devotee on the right day. The interface is a calendar that breathes; the system underneath is the case.",
    stats: [
      { value: "60k", label: "events / year" },
      { value: "180k", label: "monthly devotees" },
      { value: "98.7%", label: "computation accuracy" },
      { value: "1", label: "engine, infinite calendars" },
    ],
    layer2: [
      {
        num: "01",
        kind: "BET",
        caption:
          "If we compute the Panchang from first principles — astronomy plus tradition — instead of importing tables, we get a generative calendar that can localise to any user, any region, any ritual lineage.",
        visualLabel: "the generative bet",
      },
      {
        num: "02",
        kind: "ALT",
        caption:
          "Three alternatives rejected: licensed third-party Panchang data, a content-team-maintained calendar, and an offline-only PDF. Each made the calendar dead. The engine makes it alive.",
        visualLabel: "three rejected calendars",
      },
      {
        num: "03",
        kind: "CONSTRAINT",
        caption:
          "Different lineages compute the same event on different days. The system had to model the disagreement — not flatten it — and let the user pick a lineage without judgement.",
        visualLabel: "the lineage constraint",
      },
      {
        num: "04",
        kind: "SYSTEM",
        caption:
          "An astronomy core (planetary positions) feeds a tradition layer (lineage-specific rules) feeds a surface layer (what gets shown today). Three layers, swappable, testable, audit-trail intact.",
        visualLabel: "engine · three layers",
      },
      {
        num: "05",
        kind: "ARTIFACT",
        caption:
          "The breathing calendar — a tile that rerenders with the day's primary tithi as soft gradient, festival as accent, and observance state as breathing rhythm. A glance becomes a reminder.",
        visualLabel: "the breathing calendar tile",
      },
      {
        num: "06",
        kind: "RESULT",
        caption:
          "Powers Divya for 180k devotees monthly. Picked up by two third-party apps via API. The engine is now a quiet utility that other devotional products in the ecosystem depend on.",
        visualLabel: "monthly devotees",
        visualValue: "180k",
      },
    ],
    quote:
      "Most calendar apps are storage. The Panchang Engine is intention — it answers the question 'what should I be doing today?' before the user is awake enough to ask.",
    depth: [
      {
        heading: "Astronomy is the easy half",
        body:
          "Computing planetary positions for the next ten thousand years is a solved problem; the open-source kernels are battle-tested. The hard half is the tradition layer — encoding the rules that turn raw astronomy into a ritual event. We treated tradition as data, not as content, and the system held.",
      },
      {
        heading: "Why we modelled disagreement instead of choosing a winner",
        body:
          "There are at least three major Panchang lineages in active use, and they disagree on dates several times a year. Building the system around 'the correct' Panchang would have lost half our potential users. We let lineage be a setting. Designers underestimate how much culture lives in the toggles you choose to expose.",
      },
      {
        heading: "The breathing tile, and why micro-animation is craft",
        body:
          "The Panchang tile breathes — a 4-second loop that swells the gradient by 6%. It is invisible until you've used the app for a week, at which point the still-tile of a day with no observance becomes uncomfortable in the way a held breath does. That is what craft looks like at consumer scale: an animation that earns its place by becoming part of the ritual it represents.",
      },
    ],
    proves:
      "I design generative systems that the rest of the team — and the rest of the ecosystem — quietly comes to depend on.",
    next: "dfd-divya",
  },
};

export function renderArtifact(spec: ArtifactSpec) {
  return (
    <PickArtifact
      kind={spec.kind}
      label={spec.visualLabel}
      value={spec.visualValue}
    />
  );
}
