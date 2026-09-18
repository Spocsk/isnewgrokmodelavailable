import { Resend } from "resend";
import { NOTIFY_FROM, SITE_URL } from "./site";

export async function sendAvailableEmail(to: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return false;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: NOTIFY_FROM,
    to,
    subject: "Grok 4.7 is available",
    text: `Grok 4.7 is on the xAI catalogue.\n\n${SITE_URL}`,
  });

  if (error) {
    console.error("Resend send failed", error.message);
    return false;
  }
  return true;
}
