const nodemailer = require("nodemailer");

// ─── Gmail SMTP Transporter ────────────────────────────────────────────────
// Uses Gmail App Password from .env to send emails to ANY customer email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── HTML Template Builder ─────────────────────────────────────────────────
const wrapHtml = (title, accentColor, iconEmoji, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f0f4f8; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 20px 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd); padding: 40px 40px 32px; text-align: center; }
    .header-icon { font-size: 52px; margin-bottom: 14px; display: block; }
    .header h1 { color: #fff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .header-sub { color: rgba(255,255,255,0.82); font-size: 14px; margin-top: 6px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; color: #1e293b; margin-bottom: 20px; line-height: 1.6; }
    .info-text { font-size: 15px; color: #475569; margin-bottom: 28px; line-height: 1.7; }
    .summary-card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
    .summary-header { background: #f1f5f9; padding: 13px 20px; font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid #f1f5f9; }
    .summary-row:last-child { border-bottom: none; }
    .row-label { font-size: 13px; color: #64748b; font-weight: 500; }
    .row-value { font-size: 14px; color: #0f172a; font-weight: 600; text-align: right; max-width: 60%; }
    .row-value.highlight { color: ${accentColor}; font-size: 15px; font-weight: 700; }
    .reason-card { background: #fff5f5; border: 1.5px solid #fecaca; border-radius: 12px; padding: 18px 22px; margin-bottom: 24px; }
    .reason-label { font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .reason-text { font-size: 14px; color: #7f1d1d; line-height: 1.7; }
    .policy-card { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #92400e; line-height: 1.6; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    .note { font-size: 13px; color: #94a3b8; line-height: 1.7; }
    .footer-bar { background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-bar p { font-size: 12px; color: #94a3b8; margin-bottom: 4px; }
    .brand-name { color: ${accentColor}; font-weight: 700; }
    @media (max-width: 600px) {
      .body, .footer-bar { padding: 24px 20px; }
      .header { padding: 28px 20px 22px; }
      .summary-row { flex-direction: column; align-items: flex-start; gap: 4px; }
      .row-value { text-align: left; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="header-icon">${iconEmoji}</span>
      <h1>${title}</h1>
      <div class="header-sub">Sportiva Indoor Sports Complex</div>
    </div>
    <div class="body">
      ${bodyContent}
    </div>
    <div class="footer-bar">
      <p>© ${new Date().getFullYear()} <span class="brand-name">Sportiva</span> — Indoor Sports Complex</p>
      <p>This is an automated notification. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

// ─── Build Table Rows ──────────────────────────────────────────────────────
const buildRows = (rows) =>
  rows.map(([label, value, highlight]) => `
    <div class="summary-row">
      <span class="row-label">${label}</span>
      <span class="row-value${highlight ? " highlight" : ""}">${value}</span>
    </div>
  `).join("");

// ─── Core Send Function (Gmail SMTP — sends to ANY email) ──────────────────
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Sportiva" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || "",
      html: options.html || options.message || "",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent via Gmail to ${options.email} — "${options.subject}" (ID: ${info.messageId})`);
    return;
  } catch (err) {
    console.warn("⚠️  Gmail SMTP failed:", err.message, "— saving local preview.");

    // ── Fallback: Local preview (always works) ──
    try {
      const fs = require("fs");
      const path = require("path");
      const previewPath = path.join(__dirname, "..", "email-preview.html");
      fs.writeFileSync(previewPath, options.html || options.message || "No content");

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🚨 REAL EMAIL COULD NOT BE SENT!");
      console.log("📧 VIEW YOUR EMAIL PREVIEW HERE:");
      console.log(`   To      : ${options.email}`);
      console.log(`   Subject : ${options.subject}`);
      console.log(`   Open This File in Browser: file://${previewPath.replace(/\\/g, '/')}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
      console.error("❌ Email sending failed:", error.message);
    }
  }
};

// ─── Booking Confirmation Email ────────────────────────────────────────────
const buildBookingConfirmationEmail = (booking) => {
  const rows = [
    ["Booking ID", booking.id, true],
    ["Court", booking.court],
    ["Date", booking.date],
    ["Time", booking.time],
    ["Booking Type", booking.type],
  ];
  if (booking.package && booking.package !== "—") rows.push(["Package", booking.package]);
  if (booking.coach) rows.push(["Coach", booking.coach]);
  if (booking.equipments && booking.equipments.length > 0) {
    rows.push(["Equipments", booking.equipments.map(e => `${e.name} ×${e.quantity}`).join(", ")]);
  }
  rows.push(["Total Price", `Rs. ${booking.price}/=`]);
  if (booking.advancePaid > 0) {
    rows.push(["Advance Paid", `Rs. ${booking.advancePaid}/=`]);
    rows.push(["Remaining Balance", `Rs. ${booking.price - booking.advancePaid}/=`]);
  }
  rows.push(["Payment Status", booking.paymentStatus || "Unpaid"]);
  
  const isConfirmed = booking.status === "Confirmed";
  rows.push(["Booking Status", isConfirmed ? "✅ Confirmed" : `⏳ ${booking.status}`]);

  const body = `
    <p class="greeting">Dear <strong>${booking.user}</strong>,</p>
    <p class="info-text">
      ${isConfirmed 
        ? `🎉 Great news! Your court has been <strong style="color:#16a34a;">successfully booked</strong>.` 
        : `👋 Your booking request has been <strong style="color:#ca8a04;">received</strong> and is currently pending.`}
      Below is your complete booking summary for your reference.
    </p>
    <div class="summary-card">
      <div class="summary-header">📋 Booking Summary</div>
      ${buildRows(rows)}
    </div>
    <hr class="divider"/>
    <p class="note">
      📍 Please arrive <strong>10 minutes before</strong> your scheduled time.<br/>
      For any queries, please contact us at our facility directly.
    </p>
    <p class="note" style="margin-top:12px;">Thank you for choosing <strong>Sportiva</strong>! See you on the court. 🏸</p>
  `;

  return wrapHtml(isConfirmed ? "Booking Confirmed!" : "Booking Received", isConfirmed ? "#16a34a" : "#ca8a04", isConfirmed ? "✅" : "⏳", body);
};

// ─── Admin Cancellation Email ──────────────────────────────────────────────
const buildCancellationEmail = (booking, reason) => {
  const rows = [
    ["Booking ID", booking.id, true],
    ["Court", booking.court],
    ["Date", booking.date],
    ["Time", booking.time],
    ["Cancelled By", "Admin"],
  ];

  const reasonSection = reason
    ? `<div class="reason-card">
        <div class="reason-label">📌 Reason for Cancellation</div>
        <div class="reason-text">${reason}</div>
       </div>`
    : "";

  const body = `
    <p class="greeting">Dear <strong>${booking.user}</strong>,</p>
    <p class="info-text">
      We regret to inform you that your booking has been
      <strong style="color:#dc2626;">cancelled</strong> by our administration team.
    </p>
    <div class="summary-card">
      <div class="summary-header">📋 Cancelled Booking Details</div>
      ${buildRows(rows)}
    </div>
    ${reasonSection}
    <div class="policy-card">
      ${booking.advancePaid > 0 
        ? "ℹ️ Your advance payment has been <strong>fully refunded to your Sportiva Wallet</strong>. You can use this balance for your future bookings." 
        : "ℹ️ No advance payment was made for this booking."}
      Please contact us directly if you require further assistance.
    </div>
    <p class="note">We sincerely apologize for the inconvenience. You are welcome to make a new booking at another time.</p>
  `;

  return wrapHtml("Booking Cancelled", "#dc2626", "❌", body);
};

// ─── Admin Rejection Email ─────────────────────────────────────────────────
const buildRejectionEmail = (booking, reason) => {
  const rows = [
    ["Booking ID", booking.id, true],
    ["Court", booking.court],
    ["Date", booking.date],
    ["Time", booking.time],
    ["Rejected By", "Admin"],
  ];

  const reasonSection = reason
    ? `<div class="reason-card">
        <div class="reason-label">📌 Reason for Rejection</div>
        <div class="reason-text">${reason}</div>
       </div>`
    : "";

  const body = `
    <p class="greeting">Dear <strong>${booking.user}</strong>,</p>
    <p class="info-text">
      We regret to inform you that your booking request has been
      <strong style="color:#c2410c;">rejected</strong> by our administration team.
    </p>
    <div class="summary-card">
      <div class="summary-header">📋 Rejected Booking Details</div>
      ${buildRows(rows)}
    </div>
    ${reasonSection}
    <div class="policy-card">
      ${booking.advancePaid > 0 
        ? "ℹ️ Your advance payment has been <strong>fully refunded to your Sportiva Wallet</strong>. You can use this balance for your future bookings." 
        : "ℹ️ No advance payment was made for this booking."}
      Please contact us if you need further assistance.
    </div>
    <p class="note">We apologize for any inconvenience. You may book a different time slot at your convenience.</p>
  `;

  return wrapHtml("Booking Rejected", "#c2410c", "🚫", body);
};

module.exports = { sendEmail, buildBookingConfirmationEmail, buildCancellationEmail, buildRejectionEmail };
