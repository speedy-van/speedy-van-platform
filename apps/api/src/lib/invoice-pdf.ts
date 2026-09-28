import { existsSync } from "node:fs";
import { resolve } from "node:path";
import PDFDocument from "pdfkit";

export interface InvoicePdfBooking {
  reference: string;
  createdAt: Date;
  updatedAt?: Date;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceVariant: string | null;
  pickupAddress: string;
  pickupPostcode?: string;
  pickupFloor?: number;
  pickupHasLift?: boolean;
  dropoffAddress: string;
  dropoffPostcode?: string;
  dropoffFloor?: number;
  dropoffHasLift?: boolean;
  scheduledAt: Date;
  selectedTimeSlot: string | null;
  distanceMiles: number;
  helpersCount?: number;
  needsPacking?: boolean;
  needsAssembly?: boolean;
  assemblyType?: string | null;
  assemblyQty?: number;
  price: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: Date | null;
  stripePaymentId?: string | null;
  refundAmount?: number;
  items: Array<{ name: string; quantity: number }>;
}

const BRAND = {
  ink: "#07110F",
  green: "#103A2E",
  amber: "#F4B21B",
  orange: "#EA580C",
  slate: "#556070",
  muted: "#7A8594",
  line: "#E6E9ED",
  panel: "#F7F8FA",
  success: "#0F8A5F",
};

const COMPANY = {
  name: "Speedy Van",
  address: "1 Barrack Street, Office 2.18, Hamilton ML3 0HS",
  email: "support@speedyvan.uk",
  phone: "+44 7909 032889",
  website: "www.speedyvan.uk",
};

function logoPath(): string | null {
  const candidates = [
    resolve(process.cwd(), "../web/public/logo.png"),
    resolve(process.cwd(), "apps/web/public/logo.png"),
    resolve(process.cwd(), "../../apps/web/public/logo.png"),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function money(value: number | null | undefined): string {
  return `£${(value ?? 0).toFixed(2)}`;
}

function shortPaymentId(value: string | null | undefined): string {
  if (!value) return "Not supplied";
  return value.length > 14 ? `...${value.slice(-10)}` : value;
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "Not supplied";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

function formatTimeSlot(slot: string | null | undefined): string {
  if (!slot) return "Not supplied";
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

function accessText(floor?: number, hasLift?: boolean): string {
  const safeFloor = typeof floor === "number" ? floor : 0;
  const floorText = safeFloor === 0 ? "Ground floor" : `Floor ${safeFloor}`;
  return `${floorText} · ${hasLift ? "lift available" : "no lift recorded"}`;
}

function optionText(booking: InvoicePdfBooking): string {
  const options = [
    `${booking.helpersCount ?? 0} helper${(booking.helpersCount ?? 0) === 1 ? "" : "s"}`,
    booking.needsPacking ? "packing help" : "packing not included",
    booking.needsAssembly
      ? `assembly${booking.assemblyType ? `: ${booking.assemblyType}` : ""}${booking.assemblyQty ? ` × ${booking.assemblyQty}` : ""}`
      : "assembly not included",
  ];
  return options.join(" · ");
}

function drawPageBase(doc: PDFKit.PDFDocument) {
  const { width, height } = doc.page;
  doc.rect(0, 0, width, height).fill("#FFFFFF");
  doc.rect(0, 0, width, 18).fill(BRAND.amber);
  doc.rect(0, 18, width, 92).fill(BRAND.ink);
  doc.rect(0, height - 46, width, 46).fill("#FAFAFA");
}

function label(doc: PDFKit.PDFDocument, text: string, x: number, y: number, width: number) {
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor(BRAND.muted).text(text.toUpperCase(), x, y, {
    width,
    characterSpacing: 0.45,
  });
}

function value(doc: PDFKit.PDFDocument, text: string, x: number, y: number, width: number, size = 10) {
  doc.font("Helvetica").fontSize(size).fillColor(BRAND.ink).text(text, x, y, { width });
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string, x: number, y: number, width = 495) {
  doc.roundedRect(x, y, width, 22, 5).fill("#FFF7E2");
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND.green).text(title.toUpperCase(), x + 10, y + 6, {
    width: width - 20,
    characterSpacing: 0.3,
  });
}

function drawKeyValue(
  doc: PDFKit.PDFDocument,
  key: string,
  val: string,
  x: number,
  y: number,
  width: number,
) {
  label(doc, key, x, y, width);
  value(doc, val, x, y + 11, width, 9.4);
}

function drawFooter(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking) {
  const y = 794;
  doc.font("Helvetica").fontSize(6.8).fillColor(BRAND.muted);
  doc.text("Confirmed booking record. Cancellation: free 48h+; 50% refund 24-48h; no refund within 24h.", 50, y, { width: 310 });
  doc.text(`Ref: ${booking.reference} · Covered by Goods in Transit Insurance.`, 50, y + 18, { width: 310 });
  doc.text(`${COMPANY.name} · ${COMPANY.website}`, 350, y, { width: 195, align: "right" });
  doc.text(`${COMPANY.email} · ${COMPANY.phone}`, 300, y + 18, { width: 245, align: "right" });
}

function drawHeader(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking) {
  const logo = logoPath();
  if (logo) {
    try {
      doc.image(logo, 50, 30, { fit: [64, 64], align: "center", valign: "center" });
    } catch {
      doc.roundedRect(50, 30, 64, 64, 12).fill(BRAND.amber);
    }
  } else {
    doc.roundedRect(50, 30, 64, 64, 12).fill(BRAND.amber);
  }

  doc.font("Helvetica-Bold").fontSize(21).fillColor("#FFFFFF").text(COMPANY.name, 128, 36, { width: 230 });
  doc.font("Helvetica").fontSize(8.5).fillColor("#F8E8B5");
  doc.text(COMPANY.address, 128, 62, { width: 260 });
  doc.text(`${COMPANY.email} · ${COMPANY.phone}`, 128, 74, { width: 260 });
  doc.text(COMPANY.website, 128, 86, { width: 260 });

  doc.font("Helvetica-Bold").fontSize(25).fillColor("#FFFFFF").text("INVOICE", 380, 34, {
    width: 165,
    align: "right",
  });
  doc.font("Helvetica").fontSize(8.5).fillColor("#F8E8B5");
  doc.text(`INV-${booking.reference}`, 350, 64, { width: 195, align: "right" });
  doc.text(`Issued ${formatDate(booking.createdAt)}`, 350, 77, { width: 195, align: "right" });

  doc.roundedRect(440, 89, 105, 24, 12).fill(booking.isPaid === false ? "#FEF3C7" : "#DCFCE7");
  doc.font("Helvetica-Bold").fontSize(9).fillColor(booking.isPaid === false ? "#92400E" : "#166534");
  doc.text(booking.isPaid === false ? "PAYMENT DUE" : "PAID", 440, 96, { width: 105, align: "center" });
}

function drawInfoCards(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking) {
  const y = 126;
  const cardW = 238;
  const cardH = 96;

  doc.roundedRect(50, y, cardW, cardH, 10).fillAndStroke(BRAND.panel, BRAND.line);
  sectionTitle(doc, "Bill to", 62, y + 10, 82);
  doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND.ink).text(booking.customerName, 62, y + 40, { width: 205 });
  value(doc, booking.customerEmail, 62, y + 56, 205, 8.8);
  value(doc, booking.customerPhone, 62, y + 68, 205, 8.8);

  doc.roundedRect(307, y, cardW, cardH, 10).fillAndStroke(BRAND.panel, BRAND.line);
  sectionTitle(doc, "Booking", 319, y + 10, 92);
  drawKeyValue(doc, "Reference", booking.reference, 319, y + 40, 100);
  drawKeyValue(doc, "Status", booking.status, 435, y + 40, 90);
  drawKeyValue(doc, "Payment ID", shortPaymentId(booking.stripePaymentId), 319, y + 68, 110);
  drawKeyValue(doc, "Paid date", formatDate(booking.paidAt ?? booking.createdAt), 435, y + 68, 90);
}

function drawRoute(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking, y: number): number {
  sectionTitle(doc, "Journey and access", 50, y);
  y += 30;

  const cardH = 76;
  doc.roundedRect(50, y, 238, cardH, 10).fillAndStroke("#FFFFFF", BRAND.line);
  doc.roundedRect(307, y, 238, cardH, 10).fillAndStroke("#FFFFFF", BRAND.line);

  doc.roundedRect(62, y + 12, 24, 24, 12).fill(BRAND.amber);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND.ink).text("A", 62, y + 19, { width: 24, align: "center" });
  label(doc, "Pickup", 98, y + 10, 150);
  doc.font("Helvetica-Bold").fontSize(9.2).fillColor(BRAND.ink).text(booking.pickupAddress, 98, y + 23, { width: 172, height: 27 });
  value(doc, booking.pickupPostcode ? `Postcode: ${booking.pickupPostcode}` : "Postcode not supplied", 98, y + 52, 172, 7.8);
  value(doc, accessText(booking.pickupFloor, booking.pickupHasLift), 98, y + 63, 172, 7.8);

  doc.roundedRect(319, y + 12, 24, 24, 12).fill(BRAND.orange);
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#FFFFFF").text("B", 319, y + 19, { width: 24, align: "center" });
  label(doc, "Drop-off", 355, y + 10, 150);
  doc.font("Helvetica-Bold").fontSize(9.2).fillColor(BRAND.ink).text(booking.dropoffAddress, 355, y + 23, { width: 172, height: 27 });
  value(doc, booking.dropoffPostcode ? `Postcode: ${booking.dropoffPostcode}` : "Postcode not supplied", 355, y + 52, 172, 7.8);
  value(doc, accessText(booking.dropoffFloor, booking.dropoffHasLift), 355, y + 63, 172, 7.8);

  y += cardH + 10;
  doc.roundedRect(50, y, 495, 44, 10).fillAndStroke("#F9FAFB", BRAND.line);
  drawKeyValue(doc, "Service", `${booking.serviceName}${booking.serviceVariant ? ` (${booking.serviceVariant})` : ""}`, 64, y + 8, 160);
  drawKeyValue(doc, "Move date", formatDate(booking.scheduledAt), 235, y + 8, 82);
  drawKeyValue(doc, "Time slot", formatTimeSlot(booking.selectedTimeSlot), 328, y + 8, 78);
  drawKeyValue(doc, "Distance", `${booking.distanceMiles.toFixed(1)} miles`, 420, y + 8, 90);
  return y + 56;
}

function drawOptions(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking, y: number): number {
  sectionTitle(doc, "Booking scope", 50, y);
  y += 28;
  doc.roundedRect(50, y, 495, 34, 10).fillAndStroke("#FFFFFF", BRAND.line);
  doc.font("Helvetica").fontSize(8.8).fillColor(BRAND.ink).text(optionText(booking), 64, y + 12, { width: 467 });
  return y + 48;
}

function ensureSpace(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking, y: number, needed: number): number {
  if (y + needed <= 760) return y;
  drawFooter(doc, booking);
  doc.addPage({ margin: 0, size: "A4" });
  drawPageBase(doc);
  doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND.green).text("Invoice continued", 50, 48, { width: 495 });
  return 78;
}

function drawItems(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking, startY: number): number {
  let y = startY;
  sectionTitle(doc, "Items", 50, y);
  y += 28;

  const headerH = 22;
  doc.roundedRect(50, y, 495, headerH, 6).fill(BRAND.green);
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#FFFFFF");
  doc.text("Description", 64, y + 7, { width: 330 });
  doc.text("Quantity", 432, y + 7, { width: 86, align: "right" });
  y += headerH;

  const rows = booking.items.length > 0 ? booking.items : [{ name: "No item list recorded", quantity: 0 }];
  rows.forEach((item, index) => {
    const rowHeight = Math.max(26, doc.heightOfString(item.name, { width: 330 }) + 14);
    y = ensureSpace(doc, booking, y, rowHeight + 8);
    const bg = index % 2 === 0 ? "#FFFFFF" : "#FAFAFA";
    doc.rect(50, y, 495, rowHeight).fill(bg).strokeColor(BRAND.line).lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(9.2).fillColor(BRAND.ink).text(item.name, 64, y + 8, { width: 330 });
    doc.font("Helvetica-Bold").fontSize(9.2).fillColor(BRAND.ink).text(String(item.quantity), 432, y + 8, {
      width: 86,
      align: "right",
    });
    y += rowHeight;
  });

  const itemCount = booking.items.reduce((total, item) => total + item.quantity, 0);
  y += 8;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(BRAND.slate);
  doc.text(`Total listed pieces: ${itemCount}`, 50, y, { width: 495, align: "right" });
  return y + 28;
}

function drawPayment(doc: PDFKit.PDFDocument, booking: InvoicePdfBooking, startY: number): number {
  let y = ensureSpace(doc, booking, startY, 120);
  sectionTitle(doc, "Payment summary", 50, y);
  y += 28;

  doc.roundedRect(290, y, 255, 96, 12).fillAndStroke("#FFFFFF", BRAND.line);
  const rows = [
    ["Service subtotal", money(booking.price)],
    ["Total charged", money(booking.totalPrice)],
    ["Refund recorded", booking.refundAmount && booking.refundAmount > 0 ? `-${money(booking.refundAmount)}` : money(0)],
  ];
  rows.forEach(([name, amount], index) => {
    const rowY = y + 13 + index * 20;
    doc.font(index === 1 ? "Helvetica-Bold" : "Helvetica").fontSize(index === 1 ? 11 : 9.5).fillColor(BRAND.ink);
    doc.text(name, 306, rowY, { width: 120 });
    doc.text(amount, 430, rowY, { width: 96, align: "right" });
  });
  doc.moveTo(306, y + 74).lineTo(526, y + 74).strokeColor(BRAND.line).lineWidth(1).stroke();
  doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND.success);
  doc.text(booking.isPaid === false ? "Amount due" : "Amount paid", 306, y + 80, { width: 120 });
  doc.text(booking.isPaid === false ? money(booking.totalPrice) : money(booking.totalPrice - (booking.refundAmount ?? 0)), 430, y + 80, { width: 96, align: "right" });

  doc.roundedRect(50, y, 220, 96, 12).fillAndStroke("#FFFBEB", "#FDE68A");
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(BRAND.green).text("Important notes", 66, y + 13, { width: 188 });
  doc.font("Helvetica").fontSize(8.2).fillColor(BRAND.ink);
  doc.text("Keep this invoice with your booking reference. Any changes to inventory, access, distance or waiting time may require review before the move.", 66, y + 36, {
    width: 188,
    lineGap: 2,
  });

  return y + 116;
}

export async function renderInvoicePdf(booking: InvoicePdfBooking): Promise<Buffer> {
  return new Promise<Buffer>((resolvePromise, reject) => {
    const doc = new PDFDocument({
      margin: 0,
      size: "A4",
      info: {
        Title: `Invoice ${booking.reference}`,
        Author: COMPANY.name,
        Subject: `Booking invoice for ${booking.reference}`,
      },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolvePromise(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawPageBase(doc);
    drawHeader(doc, booking);
    drawInfoCards(doc, booking);
    let y = 240;
    y = drawRoute(doc, booking, y);
    y = drawOptions(doc, booking, y);
    y = drawPayment(doc, booking, y);
    drawItems(doc, booking, y);
    drawFooter(doc, booking);

    doc.end();
  });
}

export async function invoicePdfResponse(booking: InvoicePdfBooking): Promise<Response> {
  const buffer = await renderInvoicePdf(booking);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="INV-${booking.reference}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
