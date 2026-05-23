/**
 * Thin Resend wrapper — uses the REST API directly so we don't add a dep.
 *
 * Setup notes for whoever wires the env vars:
 * - RESEND_API_KEY: from resend.com/api-keys
 * - RESEND_FROM:    optional; defaults to onboarding@resend.dev (only sends
 *                   to your own verified Resend account email). For real
 *                   sending, verify a domain and set this to e.g.
 *                   "Chitra <chitra@yourdomain.com>".
 */

const RESEND_API = "https://api.resend.com/emails";
const DEFAULT_FROM = "Chitra <onboarding@resend.dev>";

export interface DeepDiveMemo {
  headline: string;
  fit_score: number;
  why_it_fits: string[];
  honest_gaps?: string[];
  relevant_cases: string[];
  company_signals: string[];
  draft_reply_subject: string;
  draft_reply_body: string;
}

export interface DeepDiveEmail {
  to: string;
  visitorEmail: string;
  companyName?: string;
  roleTitle?: string;
  jdText: string;
  memo: DeepDiveMemo;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(input: DeepDiveEmail): string {
  const { memo } = input;
  const replyMailto =
    `mailto:${encodeURIComponent(input.visitorEmail)}` +
    `?subject=${encodeURIComponent(memo.draft_reply_subject)}` +
    `&body=${encodeURIComponent(memo.draft_reply_body)}`;

  const list = (items: string[]) =>
    `<ul style="padding-left:20px;margin:0 0 16px">${items
      .map((s) => `<li style="margin-bottom:4px">${esc(s)}</li>`)
      .join("")}</ul>`;

  const ctxLine = [
    input.roleTitle,
    input.companyName,
    `reply-to: ${input.visitorEmail}`,
  ]
    .filter(Boolean)
    .map((s) => esc(String(s)))
    .join(" · ");

  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111">
  <p style="color:#6b7280;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 8px">// chitra · deep dive</p>
  <h1 style="font-size:20px;line-height:1.3;margin:0 0 4px;font-weight:600">${esc(memo.headline)}</h1>
  <p style="color:#6b7280;font-size:13px;margin:0 0 24px">
    Fit <strong style="color:#111">${memo.fit_score}/100</strong> · ${ctxLine}
  </p>

  <h3 style="font-size:13px;margin:0 0 8px;color:#6366f1;text-transform:uppercase;letter-spacing:0.08em">Why it fits</h3>
  ${list(memo.why_it_fits)}

  ${
    memo.honest_gaps && memo.honest_gaps.length
      ? `<h3 style="font-size:13px;margin:0 0 8px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em">Honest gaps</h3>${list(memo.honest_gaps)}`
      : ""
  }

  ${
    memo.company_signals.length
      ? `<h3 style="font-size:13px;margin:0 0 8px;color:#6366f1;text-transform:uppercase;letter-spacing:0.08em">What I learned about them</h3>${list(memo.company_signals)}`
      : `<p style="color:#9ca3af;font-size:13px;margin:0 0 16px;font-style:italic">No company research — couldn't identify a verifiable domain.</p>`
  }

  <h3 style="font-size:13px;margin:0 0 8px;color:#6366f1;text-transform:uppercase;letter-spacing:0.08em">Relevant cases</h3>
  <p style="margin:0 0 24px">${memo.relevant_cases
    .map(
      (s) =>
        `<code style="background:#f3f4f6;padding:3px 8px;border-radius:4px;font-size:13px;margin-right:4px">${esc(s)}</code>`,
    )
    .join("")}</p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />

  <h3 style="font-size:13px;margin:0 0 8px;color:#6366f1;text-transform:uppercase;letter-spacing:0.08em">Draft reply</h3>
  <p style="margin:0 0 4px;font-size:14px"><strong>Subject:</strong> ${esc(memo.draft_reply_subject)}</p>
  <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.5;background:#f9fafb;border-left:3px solid #6366f1;padding:12px 16px;margin:0 0 16px;color:#111">${esc(memo.draft_reply_body)}</pre>
  <p style="margin:0 0 8px"><a href="${replyMailto}" style="background:#111;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:14px;display:inline-block;font-weight:500">Send to ${esc(input.visitorEmail)} →</a></p>
  <p style="color:#9ca3af;font-size:12px;margin:0 0 24px">Edit before sending — the button opens your mail app with the draft pre-filled.</p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />

  <details>
    <summary style="cursor:pointer;color:#6b7280;font-size:13px">Original JD</summary>
    <pre style="white-space:pre-wrap;font-family:inherit;font-size:13px;color:#374151;margin:12px 0 0;line-height:1.5">${esc(input.jdText)}</pre>
  </details>
</body></html>`;
}

export async function sendDeepDiveEmail(input: DeepDiveEmail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] no RESEND_API_KEY — skipping send");
    return;
  }

  const subject = `Chitra · ${input.memo.fit_score}/100 · ${
    input.companyName ?? input.roleTitle ?? "new role"
  }`;

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? DEFAULT_FROM,
      to: input.to,
      reply_to: input.visitorEmail,
      subject,
      html: buildHtml(input),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[email] resend failed", res.status, body);
  }
}
