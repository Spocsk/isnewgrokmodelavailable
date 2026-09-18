import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { detectGrok47 } from "@/lib/detect-grok-47";

export const runtime = "edge";

function triggerDispatch(): void {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return;
  }
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (!host) {
    return;
  }
  waitUntil(
    fetch(`https://${host}/api/dispatch`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
    }).then(() => undefined),
  );
}

export async function GET() {
  const result = await detectGrok47();
  const isError = result.error !== null;

  if (result.available === true && !isError) {
    triggerDispatch();
  }

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": isError
        ? "no-store"
        : "public, s-maxage=15, stale-while-revalidate=45",
    },
  });
}
