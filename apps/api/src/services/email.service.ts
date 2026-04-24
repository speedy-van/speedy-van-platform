// Resend email integration with no-op fallback. All sender functions log to
// console when RESEND_API_KEY is absent so dev flows still work.

import { SITE } from "@speedy-van/config";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? `Speedy Van <noreply@${SITE.domain}>`;

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!apiKey) {
    console.log(`[email] (no-key) → ${to} | ${subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`[email] failed ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("[email] send error:", err);
  }
}

const baseTemplate = (heading: string, body: string): string => `
<!doctype html>
<html><body style="font-family:-apple-system,system-ui,sans-serif;background:#f5f5f5;padding:40px;">
  <div style="max-width:560px;margin:auto;background:white;padding:32px;border-radius:8px;">
    <h1 style="color:#facc15;margin:0 0 16px;font-size:22px;">${heading}</h1>
    ${body}
    <hr style="margin:32px 0;border:none;border-top:1px solid #eee;">
    <p style="color:#777;font-size:12px;">${SITE.name} — ${SITE.email}</p>
  </div>
</body></html>`;

export async function sendBookingConfirmation(booking: {
  customerEmail: string;
  customerName: string;
  reference: string;
  serviceName: string;
  scheduledAt: Date;
  totalPrice: number;
}): Promise<void> {
  await send(
    booking.customerEmail,
    `Booking confirmed — ${booking.reference}`,
    baseTemplate(
      "Booking confirmed!",
      `<p>Hi ${booking.customerName},</p>
       <p>Your booking <strong>${booking.reference}</strong> for ${booking.serviceName}
       on ${booking.scheduledAt.toUTCString()} is confirmed.</p>
       <p>Total paid: £${booking.totalPrice.toFixed(2)}</p>`,
    ),
  );
}

export async function sendDriverAssigned(
  booking: { customerEmail: string; reference: string },
  driverName: string,
): Promise<void> {
  await send(
    booking.customerEmail,
    `Driver assigned — ${booking.reference}`,
    baseTemplate(
      "Your driver is on the way",
      `<p>Your driver <strong>${driverName}</strong> has been assigned to booking
       <strong>${booking.reference}</strong>. You'll receive live updates as they progress.</p>`,
    ),
  );
}

export async function sendJobCompleted(booking: {
  customerEmail: string;
  reference: string;
}): Promise<void> {
  await send(
    booking.customerEmail,
    `Job completed — ${booking.reference}`,
    baseTemplate(
      "Move complete!",
      `<p>Booking <strong>${booking.reference}</strong> is now complete.
       We'd love to hear how it went — please reply to this email with feedback.</p>`,
    ),
  );
}

export async function sendBookingCancelled(
  booking: { customerEmail: string; reference: string },
  refundAmount: number,
): Promise<void> {
  await send(
    booking.customerEmail,
    `Booking cancelled — ${booking.reference}`,
    baseTemplate(
      "Booking cancelled",
      `<p>Booking <strong>${booking.reference}</strong> has been cancelled.</p>
       <p>Refund amount: £${refundAmount.toFixed(2)}</p>`,
    ),
  );
}

export async function sendDriverWelcome(driver: { email: string; name: string }, tempPassword: string): Promise<void> {
  await send(
    driver.email,
    "Welcome to Speedy Van",
    baseTemplate(
      "Welcome aboard",
      `<p>Hi ${driver.name},</p>
       <p>Your driver account is ready. Login with:</p>
       <p>Email: <strong>${driver.email}</strong><br>Temporary password: <strong>${tempPassword}</strong></p>
       <p>Please change your password on first login.</p>`,
    ),
  );
}

export async function sendPasswordReset(email: string, resetUrl: string): Promise<void> {
  await send(
    email,
    "Reset your Speedy Van password",
    baseTemplate(
      "Password reset",
      `<p>Click the link below to set a new password (expires in 1 hour):</p>
       <p><a href="${resetUrl}" style="color:#facc15;">${resetUrl}</a></p>`,
    ),
  );
}

export async function sendNewMessage(
  recipientEmail: string,
  senderName: string,
  preview: string,
  bookingRef: string,
): Promise<void> {
  await send(
    recipientEmail,
    `New message — ${bookingRef}`,
    baseTemplate(
      `Message from ${senderName}`,
      `<p>${preview.replace(/</g, "&lt;").slice(0, 200)}</p>
       <p>Open the chat for booking <strong>${bookingRef}</strong> to reply.</p>`,
    ),
  );
}
