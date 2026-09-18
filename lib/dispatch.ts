import { detectGrok47 } from "./detect-grok-47";
import { sendAvailableEmail } from "./send-available";
import { listUnnotified, markNotified } from "./waitlist";

export type DispatchResult = {
  ok: true;
  available: boolean | null;
  sent: number;
};

export async function dispatchAvailabilityEmails(): Promise<DispatchResult> {
  const status = await detectGrok47();
  if (status.available !== true) {
    return { ok: true, available: status.available, sent: 0 };
  }

  const emails = await listUnnotified();
  let sent = 0;
  for (const email of emails) {
    const delivered = await sendAvailableEmail(email);
    if (delivered) {
      await markNotified(email);
      sent += 1;
    }
  }

  return { ok: true, available: true, sent };
}
