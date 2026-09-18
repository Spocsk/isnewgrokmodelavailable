import { ensureWaitlistTable } from "./db";

type WaitlistRow = {
  email: string;
};

export async function upsertWaitlist(
  email: string,
): Promise<"created" | "exists"> {
  const sql = await ensureWaitlistTable();
  const rows = (await sql`
    INSERT INTO waitlist (email)
    VALUES (${email})
    ON CONFLICT (email) DO NOTHING
    RETURNING email
  `) as WaitlistRow[];
  return rows.length > 0 ? "created" : "exists";
}

export async function listUnnotified(): Promise<string[]> {
  const sql = await ensureWaitlistTable();
  const rows = (await sql`
    SELECT email
    FROM waitlist
    WHERE notified_at IS NULL
  `) as WaitlistRow[];
  return rows.map((row) => row.email);
}

export async function markNotified(email: string): Promise<void> {
  const sql = await ensureWaitlistTable();
  await sql`
    UPDATE waitlist
    SET notified_at = now()
    WHERE email = ${email}
  `;
}
