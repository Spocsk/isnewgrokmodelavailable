import { NextResponse } from "next/server";
import { isAuthorizedCron } from "@/lib/cron-auth";
import { dispatchAvailabilityEmails } from "@/lib/dispatch";

export const runtime = "nodejs";

async function handle(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await dispatchAvailabilityEmails();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Dispatch failed", error);
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
