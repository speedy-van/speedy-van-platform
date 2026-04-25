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

// ─── European removals enquiries ─────────────────────────────────────────────

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const ADMIN_ENQUIRY_EMAIL =
  process.env.ADMIN_ENQUIRY_EMAIL ?? SITE.supportEmail ?? `support@${SITE.domain}`;

interface EuropeanEnquiryEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromAddress: string;
  propertyType: string;
  bedrooms: number;
  toCountry: string;
  toCity: string;
  preferredDate: Date | null;
  flexibleDate: boolean;
  flexibleMonth: string | null;
  needsPacking: boolean;
  needsStorage: boolean;
  notes: string | null;
}

export async function sendEuropeanEnquiryConfirmation(
  enquiry: EuropeanEnquiryEmailData,
): Promise<void> {
  await send(
    enquiry.customerEmail,
    "We've received your European move enquiry",
    baseTemplate(
      "Thanks — your enquiry is in",
      `<p>Hi ${escapeHtml(enquiry.customerName)},</p>
       <p>Thank you for contacting Speedy Van about your move from
       <strong>Scotland to ${escapeHtml(enquiry.toCity)}, ${escapeHtml(enquiry.toCountry)}</strong>.</p>
       <p>One of our European removals specialists will review your details and
       send you a detailed, fixed-price quote <strong>within 24 hours</strong>.</p>
       <p>If anything is urgent, you can reply to this email or call us on
       <strong>01202 129746</strong>.</p>`,
    ),
  );
}

export async function sendEuropeanEnquiryAdminAlert(
  enquiry: EuropeanEnquiryEmailData,
): Promise<void> {
  const fmtDate = enquiry.preferredDate
    ? enquiry.preferredDate.toUTCString()
    : enquiry.flexibleDate
    ? `Flexible${enquiry.flexibleMonth ? ` (${escapeHtml(enquiry.flexibleMonth)})` : ""}`
    : "—";

  const row = (k: string, v: string): string =>
    `<tr><td style="padding:4px 8px;color:#475569;font-weight:600;width:160px;">${k}</td><td style="padding:4px 8px;color:#0f172a;">${v}</td></tr>`;

  await send(
    ADMIN_ENQUIRY_EMAIL,
    `🇪🇺 New European Move Enquiry — ${enquiry.toCountry}`,
    baseTemplate(
      "New European removals enquiry",
      `<p>A new European removals enquiry has just been submitted.</p>
       <table style="border-collapse:collapse;width:100%;font-size:14px;">
         ${row("Customer", escapeHtml(enquiry.customerName))}
         ${row("Email", `<a href="mailto:${escapeHtml(enquiry.customerEmail)}">${escapeHtml(enquiry.customerEmail)}</a>`)}
         ${row("Phone", `<a href="tel:${escapeHtml(enquiry.customerPhone)}">${escapeHtml(enquiry.customerPhone)}</a>`)}
         ${row("From", escapeHtml(enquiry.fromAddress))}
         ${row("Property", `${escapeHtml(enquiry.propertyType)}${enquiry.bedrooms > 0 ? ` · ${enquiry.bedrooms} bedroom${enquiry.bedrooms === 1 ? "" : "s"}` : ""}`)}
         ${row("Destination", `${escapeHtml(enquiry.toCity)}, ${escapeHtml(enquiry.toCountry)}`)}
         ${row("Preferred date", fmtDate)}
         ${row("Packing", enquiry.needsPacking ? "Yes" : "No")}
         ${row("Storage", enquiry.needsStorage ? "Yes" : "No")}
         ${row("Notes", enquiry.notes ? escapeHtml(enquiry.notes).replace(/\n/g, "<br>") : "—")}
       </table>
       <p style="margin-top:24px;">
         <a href="https://www.speedy-van.co.uk/admin/enquiries"
            style="background:#facc15;color:#0f172a;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:700;">
           Open in admin →
         </a>
       </p>`,
    ),
  );
}

export async function sendEuropeanEnquiryQuote(quote: {
  customerEmail: string;
  customerName: string;
  toCountry: string;
  toCity: string;
  quotedPrice: number;
  adminNotes?: string | null;
}): Promise<void> {
  await send(
    quote.customerEmail,
    `Your European move quote — Scotland → ${quote.toCity}, ${quote.toCountry}`,
    baseTemplate(
      "Your quote is ready",
      `<p>Hi ${escapeHtml(quote.customerName)},</p>
       <p>Thanks for your patience. Based on the details you shared, here is our
       fixed-price quote for your move from Scotland to
       <strong>${escapeHtml(quote.toCity)}, ${escapeHtml(quote.toCountry)}</strong>:</p>
       <p style="font-size:28px;font-weight:800;color:#0f172a;margin:16px 0;">
         £${quote.quotedPrice.toFixed(2)}
       </p>
       <p style="color:#475569;font-size:13px;">
         Includes packing materials, transport, customs handling and
         goods-in-transit insurance.
       </p>
       ${
         quote.adminNotes
           ? `<p><strong>Notes:</strong><br>${escapeHtml(quote.adminNotes).replace(/\n/g, "<br>")}</p>`
           : ""
       }
       <p>To accept this quote or ask any questions, simply reply to this email
       or call us on <strong>01202 129746</strong>.</p>`,
    ),
  );
}
