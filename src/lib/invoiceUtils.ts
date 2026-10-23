import { AdminInvoice } from "@/types/admin";

/**
 * Converts a numeric amount to formal Indian currency words.
 * Example: 4999 -> "Rupees Four Thousand Nine Hundred Ninety-Nine Only"
 */
export function numberToWordsIndian(amount: number): string {
  const num = Math.round(Math.abs(amount));
  if (num === 0) return "Rupees Zero Only";

  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertHundreds(n: number): string {
    let str = "";
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? "-" + units[n % 10] : "") + " ";
    } else if (n > 0) {
      str += units[n] + " ";
    }
    return str.trim();
  }

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let parts: string[] = [];

  if (crore > 0) parts.push(`${convertHundreds(crore)} Crore`);
  if (lakh > 0) parts.push(`${convertHundreds(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${convertHundreds(thousand)} Thousand`);
  if (remainder > 0) parts.push(convertHundreds(remainder));

  return `Rupees ${parts.join(" ")} Only`.replace(/\s+/g, " ").trim();
}

/**
 * Formats a number to Indian Rupee representation.
 */
export function formatINR(amount: number): string {
  return "₹" + (Number.isFinite(amount) ? amount : 0).toLocaleString("en-IN");
}

/**
 * Generates UPI deep link
 */
export function getUpiPaymentUrl(
  pa: string = "9463737763@upi",
  pn: string = "WebNoura by Karan",
  amount: number,
  invoiceNum: string
): string {
  const am = Math.max(0, Math.round(amount));
  return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent("Invoice " + invoiceNum)}`;
}

/**
 * Generates URL for QR code image from UPI URL
 */
export function getUpiQrImageUrl(upiUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiUrl)}`;
}

/**
 * Generates an isolated, ultra-clean HTML printable document for the invoice
 * and triggers window.print(). This guarantees crisp A4 page rendering without
 * any admin dashboard bleed or styling conflicts.
 */
export function openPrintableInvoiceWindow(invoice: AdminInvoice): void {
  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) {
    window.print();
    return;
  }

  const upiLink = getUpiPaymentUrl("9463737763@upi", "WebNoura by Karan", invoice.balance_due > 0 ? invoice.balance_due : invoice.total_amount, invoice.invoice_number);
  const qrUrl = getUpiQrImageUrl(upiLink);
  const words = numberToWordsIndian(invoice.total_amount);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice_number} - WebNoura Creative Studio</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 13px;
      padding: 24px;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 32px;
      background: #ffffff;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f2744;
      padding-bottom: 20px;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
      color: #ffffff;
      font-weight: 900;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      letter-spacing: -1px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f2744;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #2563eb;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .studio-meta {
      margin-top: 8px;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
    }
    .invoice-meta {
      text-align: right;
    }
    .tax-badge {
      display: inline-block;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f2744;
      margin-top: 6px;
      font-family: monospace;
    }
    .meta-details {
      margin-top: 8px;
      font-size: 11px;
      color: #475569;
      line-height: 1.6;
    }
    .meta-details strong {
      color: #0f172a;
    }
    .client-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 24px 0;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .card-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #2563eb;
      margin-bottom: 6px;
    }
    .client-name {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .client-business {
      font-size: 13px;
      font-weight: 600;
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    .client-info {
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      margin-top: 4px;
    }
    .status-stamp {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
    }
    .status-paid {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
    }
    .status-partial {
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
    }
    .status-pending {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #0f2744;
      color: #ffffff;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
      color: #1e293b;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: monospace; }
    .summary-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      margin-top: 10px;
    }
    .words-box {
      background: #f1f5f9;
      border-left: 3px solid #2563eb;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 11px;
      color: #334155;
      margin-bottom: 14px;
    }
    .words-box strong {
      color: #0f2744;
      display: block;
      margin-bottom: 2px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .terms-box {
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .terms-box strong {
      color: #1e293b;
      display: block;
      margin-bottom: 4px;
      font-size: 10px;
      text-transform: uppercase;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .totals-table td {
      padding: 8px 14px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .totals-table tr:last-child td {
      border-bottom: none;
    }
    .grand-total {
      background: #0f2744 !important;
      color: #ffffff !important;
      font-weight: 800;
      font-size: 14px !important;
    }
    .grand-total td {
      color: #ffffff !important;
    }
    .payment-box {
      margin-top: 24px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .pay-info {
      flex: 1;
      font-size: 11px;
      color: #166534;
      line-height: 1.6;
    }
    .pay-title {
      font-size: 13px;
      font-weight: 800;
      color: #14532d;
      margin-bottom: 4px;
    }
    .qr-container {
      text-align: center;
    }
    .qr-container img {
      width: 100px;
      height: 100px;
      border: 1px solid #86efac;
      border-radius: 8px;
      background: #ffffff;
      padding: 4px;
    }
    .qr-caption {
      font-size: 9px;
      color: #15803d;
      font-weight: 700;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .footer {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-note {
      font-size: 10px;
      color: #94a3b8;
      max-width: 400px;
      line-height: 1.5;
    }
    .signature-box {
      text-align: right;
    }
    .signature-name {
      font-size: 20px;
      font-weight: 800;
      color: #0f2744;
      font-family: 'Brush Script MT', cursive, sans-serif;
      margin-bottom: 2px;
    }
    .signatory-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    .signatory-sub {
      font-size: 10px;
      color: #64748b;
    }
    .stamp-seal {
      position: absolute;
      top: 160px;
      right: 40px;
      border: 3px dashed ${invoice.payment_status === "paid" ? "#059669" : "#d97706"};
      color: ${invoice.payment_status === "paid" ? "#059669" : "#d97706"};
      padding: 8px 18px;
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-radius: 8px;
      transform: rotate(-8deg);
      opacity: 0.85;
      pointer-events: none;
      text-align: center;
      line-height: 1.2;
    }
    .stamp-seal span {
      display: block;
      font-size: 9px;
      letter-spacing: 1px;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="stamp-seal">
      ${invoice.payment_status === "paid" ? "PAID IN FULL" : invoice.payment_status === "partial" ? "PARTIAL ADVANCE" : "PAYMENT DUE"}
      <span>WEBNOURA VERIFIED</span>
    </div>

    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-logo">
          <div class="logo-badge">WN</div>
          <div>
            <div class="brand-title">WebNoura</div>
            <div class="brand-subtitle">Creative Digital Studio · Karan</div>
          </div>
        </div>
        <div class="studio-meta">
          <div>Founder & Lead Developer: <strong>Karan</strong></div>
          <div>WhatsApp / Phone: <strong>+91 94637 37763</strong> · Email: <strong>webnourabykaran@gmail.com</strong></div>
          <div>Punjab, India · Place of Supply: <strong>Punjab (03)</strong></div>
          <div>Service SAC Code: <strong>998314</strong> (Information Technology & Web Design)</div>
        </div>
      </div>

      <div class="invoice-meta">
        <div class="tax-badge">Official Tax Invoice</div>
        <div class="invoice-title">${invoice.invoice_number}</div>
        <div class="meta-details">
          <div>Invoice Date: <strong>${invoice.issue_date}</strong></div>
          <div>Due Date: <strong>${invoice.due_date}</strong></div>
          ${invoice.paid_date ? `<div>Payment Date: <strong>${invoice.paid_date}</strong></div>` : ""}
        </div>
      </div>
    </div>

    <!-- Client & Payment Status Grid -->
    <div class="client-grid">
      <div class="card">
        <div class="card-title">Billed To (ਗਾਹਕ ਦਾ ਵੇਰਵਾ)</div>
        <div class="client-name">${invoice.client_name}</div>
        ${invoice.client_business ? `<div class="client-business">${invoice.client_business}</div>` : ""}
        <div class="client-info">
          ${invoice.client_phone ? `<div>Phone: <strong>${invoice.client_phone}</strong></div>` : ""}
          ${invoice.client_email ? `<div>Email: <strong>${invoice.client_email}</strong></div>` : ""}
          ${invoice.client_address ? `<div>Address: ${invoice.client_address}</div>` : ""}
          ${invoice.client_gst ? `<div>GSTIN: <strong>${invoice.client_gst}</strong></div>` : ""}
        </div>
      </div>

      <div class="card">
        <div class="card-title">Payment Overview</div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
          <div>
            <span style="font-size: 11px; color: #64748b;">Amount Paid:</span>
            <div style="font-size: 18px; font-weight: 800; color: #059669; font-family: monospace;">₹${invoice.amount_paid.toLocaleString("en-IN")}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 11px; color: #64748b;">Balance Due:</span>
            <div style="font-size: 18px; font-weight: 800; color: ${invoice.balance_due > 0 ? "#dc2626" : "#059669"}; font-family: monospace;">₹${invoice.balance_due.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div style="margin-top: 10px; font-size: 11px; color: #475569;">
          ${invoice.payment_method ? `<div>Mode: <strong>${invoice.payment_method.toUpperCase()}</strong></div>` : ""}
          ${invoice.transaction_id ? `<div>Ref/UTR: <span style="font-family: monospace;">${invoice.transaction_id}</span></div>` : ""}
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th style="width: 36px;">#</th>
          <th>Service / Deliverable Description</th>
          <th class="text-center" style="width: 70px;">SAC</th>
          <th class="text-center" style="width: 50px;">Qty</th>
          <th class="text-right" style="width: 90px;">Rate</th>
          <th class="text-right" style="width: 100px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (it, idx) => `<tr>
          <td class="font-mono text-center" style="color: #64748b;">${String(idx + 1).padStart(2, "0")}</td>
          <td><strong>${it.description}</strong></td>
          <td class="font-mono text-center" style="color: #64748b;">998314</td>
          <td class="font-mono text-center">${it.quantity}</td>
          <td class="font-mono text-right">₹${it.rate.toLocaleString("en-IN")}</td>
          <td class="font-mono text-right" style="font-weight: 700;">₹${it.amount.toLocaleString("en-IN")}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <!-- Totals and Words -->
    <div class="summary-section">
      <div>
        <div class="words-box">
          <strong>Amount in Words:</strong>
          ${words}
        </div>

        ${
          invoice.notes
            ? `<div class="terms-box" style="margin-bottom: 10px;">
          <strong>Deal Notes:</strong>
          ${invoice.notes}
        </div>`
            : ""
        }

        <div class="terms-box">
          <strong>Terms & Conditions:</strong>
          ${invoice.terms || "1. 1-Year High-Speed Cloud Hosting, Free SSL & Technical Support included.\n2. Final source code and domain ownership upon full settlement."}
        </div>
      </div>

      <div>
        <table class="totals-table">
          <tr>
            <td>Subtotal:</td>
            <td class="text-right font-mono">₹${invoice.subtotal.toLocaleString("en-IN")}</td>
          </tr>
          ${
            invoice.discount_amount > 0
              ? `<tr>
            <td style="color: #059669;">Special Discount:</td>
            <td class="text-right font-mono" style="color: #059669;">-₹${invoice.discount_amount.toLocaleString("en-IN")}</td>
          </tr>`
              : ""
          }
          ${
            invoice.tax_amount > 0
              ? `<tr>
            <td>Taxes / GST:</td>
            <td class="text-right font-mono">+₹${invoice.tax_amount.toLocaleString("en-IN")}</td>
          </tr>`
              : ""
          }
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td class="text-right font-mono">₹${invoice.total_amount.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="color: #059669; font-weight: 600;">Amount Paid:</td>
            <td class="text-right font-mono" style="color: #059669; font-weight: 700;">₹${invoice.amount_paid.toLocaleString("en-IN")}</td>
          </tr>
          <tr style="background: ${invoice.balance_due > 0 ? "#fef2f2" : "#f0fdf4"};">
            <td style="font-weight: 800; color: ${invoice.balance_due > 0 ? "#991b1b" : "#166534"};">Balance Payable:</td>
            <td class="text-right font-mono" style="font-weight: 900; font-size: 13px; color: ${invoice.balance_due > 0 ? "#b91c1c" : "#15803d"};">
              ₹${invoice.balance_due.toLocaleString("en-IN")}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Scannable UPI Payment Box -->
    ${
      invoice.balance_due > 0
        ? `<div class="payment-box">
      <div class="pay-info">
        <div class="pay-title">Direct UPI & Bank Payment Options</div>
        <div>Pay balance of <strong>₹${invoice.balance_due.toLocaleString("en-IN")}</strong> via Google Pay / PhonePe / Paytm / BHIM:</div>
        <div style="margin-top: 4px;">UPI ID: <strong style="font-family: monospace; font-size: 13px; color: #14532d;">9463737763@upi</strong> (Karan)</div>
        <div>WhatsApp / GPay Number: <strong>+91 94637 37763</strong></div>
        <div style="font-size: 10px; color: #15803d; margin-top: 2px;">Please share screenshot of UTR after transaction for instant confirmation.</div>
      </div>
      <div class="qr-container">
        <img src="${qrUrl}" alt="UPI QR Code" />
        <div class="qr-caption">Scan to Pay Exact Balance</div>
      </div>
    </div>`
        : ""
    }

    <!-- Footer -->
    <div class="footer">
      <div class="footer-note">
        This is an official computer-generated tax invoice issued by WebNoura Creative Studio.<br>
        For verification or inquiries, contact Karan at +91 94637 37763.
      </div>
      <div class="signature-box">
        <div class="signature-name">Karan</div>
        <div class="signatory-title">Authorized Signatory</div>
        <div class="signatory-sub">Founder & Principal Architect · WebNoura</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Downloads a self-contained offline HTML file of the invoice.
 */
export function downloadInvoiceHtml(invoice: AdminInvoice): void {
  const upiLink = getUpiPaymentUrl("9463737763@upi", "WebNoura by Karan", invoice.balance_due > 0 ? invoice.balance_due : invoice.total_amount, invoice.invoice_number);
  const qrUrl = getUpiQrImageUrl(upiLink);
  const words = numberToWordsIndian(invoice.total_amount);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice_number} - ${invoice.client_business || invoice.client_name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 24px; }
    .box { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #0f2744; color: #fff; padding: 10px; text-align: left; font-size: 12px; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>WebNoura Creative Studio</h2>
    <p>Invoice #${invoice.invoice_number} · Billed to ${invoice.client_name} (${invoice.client_business})</p>
    <p>Total: ₹${invoice.total_amount.toLocaleString("en-IN")} · Paid: ₹${invoice.amount_paid.toLocaleString("en-IN")} · Balance: ₹${invoice.balance_due.toLocaleString("en-IN")}</p>
    <p><strong>Amount in Words:</strong> ${words}</p>
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>
        ${invoice.items.map(it => `<tr><td>${it.description}</td><td>${it.quantity}</td><td>₹${it.rate.toLocaleString("en-IN")}</td><td>₹${it.amount.toLocaleString("en-IN")}</td></tr>`).join("")}
      </tbody>
    </table>
    <p>Payment via UPI: <strong>9463737763@upi</strong> (Phone: +91 94637 37763)</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `WebNoura-Invoice-${invoice.invoice_number}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
