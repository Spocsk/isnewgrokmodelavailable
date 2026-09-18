const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) {
    return null;
  }
  if (!EMAIL_PATTERN.test(email)) {
    return null;
  }
  return email;
}
