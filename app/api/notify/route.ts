import { NextResponse } from "next/server";
import { detectGrok47 } from "@/lib/detect-grok-47";
import { normalizeEmail } from "@/lib/email";
import { sendAvailableEmail } from "@/lib/send-available";
import { markNotified, upsertWaitlist } from "@/lib/waitlist";

export const runtime = "nodejs";

type NotifyBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: NotifyBody;
  try {
    body = (await request.json()) as NotifyBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (typeof body.email !== "string") {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const status = await upsertWaitlist(email);
    const catalogue = await detectGrok47();
    if (catalogue.available === true) {
      const sent = await sendAvailableEmail(email);
      if (sent) {
        await markNotified(email);
      }
    }
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error("Waitlist save failed", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
