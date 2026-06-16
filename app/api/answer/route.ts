import type { NextRequest } from "next/server";

/**
 * Receives her answer (chosen date + time slot) and emails it to me
 * via the Resend REST API. No SDK dependency — just a fetch.
 *
 * Required env vars (see .env.local):
 *   RESEND_API_KEY  — from https://resend.com
 *   ANSWER_TO       — the email address that should receive the answer
 *   ANSWER_FROM     — verified sender, or "onboarding@resend.dev" for testing
 */
export async function POST(request: NextRequest) {
  let body: {
    date?: string;
    slot?: string;
    charm?: number;
    outing?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { date, slot, charm, outing } = body;
  if (!date || !slot) {
    return Response.json(
      { error: "Missing date or slot" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ANSWER_TO;
  const from = process.env.ANSWER_FROM ?? "onboarding@resend.dev";

  // If email isn't configured yet, don't break her experience — just log.
  if (!apiKey || !to) {
    console.warn("[answer] Email not configured. Answer:", { date, slot });
    return Response.json({ ok: true, emailed: false });
  }

  const charmLine =
    typeof charm === "number"
      ? `<p><strong>Charm rating she gave you:</strong> ${charm} / 10</p>`
      : "";
  const outingLine = outing
    ? `<p><strong>Outing she picked:</strong> ${escapeHtml(outing)}</p>`
    : "";

  const html = `
    <div style="font-family: ui-serif, Georgia, serif; font-size: 16px; color: #2b2b2b;">
      <p style="font-size: 22px; color: #7a2233;">She said yes. 🍷</p>
      <p><strong>Day:</strong> ${escapeHtml(date)}</p>
      <p><strong>Time:</strong> ${escapeHtml(slot)}</p>
      ${charmLine}
      ${outingLine}
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `She picked: ${date} — ${slot}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[answer] Resend error:", res.status, detail);
      return Response.json(
        { ok: false, emailed: false },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, emailed: true });
  } catch (err) {
    console.error("[answer] Send failed:", err);
    return Response.json({ ok: false, emailed: false }, { status: 502 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
