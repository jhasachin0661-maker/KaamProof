/**
 * Minimal transactional mailer. Optional: if RESEND_API_KEY + MAIL_FROM are not set, nothing is sent
 * (in development the message is printed to the server console so you can test flows).
 */
export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) {
    if (process.env.NODE_ENV !== "production") console.log(`[mail:dev] to=${to}\n${subject}\n${text}\n`);
    else console.warn("[mail] RESEND_API_KEY/MAIL_FROM not configured — email not sent");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text }),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
