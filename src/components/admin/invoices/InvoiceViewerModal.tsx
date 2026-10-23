import { useState } from "react";
import {
  X,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Download,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Moon,
  Sun,
  Edit,
} from "lucide-react";
import { AdminInvoice } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";
import {
  numberToWordsIndian,
  formatINR,
  getUpiPaymentUrl,
  getUpiQrImageUrl,
  openPrintableInvoiceWindow,
  downloadInvoiceHtml,
} from "@/lib/invoiceUtils";

interface InvoiceViewerModalProps {
  invoice: AdminInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onEdit?: (invoice: AdminInvoice) => void;
}

export function InvoiceViewerModal({
  invoice,
  isOpen,
  onClose,
  onRefresh,
  onEdit,
}: InvoiceViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [paperTheme, setPaperTheme] = useState<"light" | "dark">("light");

  if (!isOpen || !invoice) return null;

  const upiLink = getUpiPaymentUrl(
    "9463737763@upi",
    "WebNoura by Karan",
    invoice.balance_due > 0 ? invoice.balance_due : invoice.total_amount,
    invoice.invoice_number
  );
  const qrUrl = getUpiQrImageUrl(upiLink);
  const amountWords = numberToWordsIndian(invoice.total_amount);

  const handlePrint = () => {
    openPrintableInvoiceWindow(invoice);
  };

  const handleDownload = () => {
    downloadInvoiceHtml(invoice);
  };

  const buildWhatsAppMessage = () => {
    const statusText =
      invoice.payment_status === "paid"
        ? "✅ *PAID IN FULL (ਪੂਰਾ ਭੁਗਤਾਨ ਪ੍ਰਾਪਤ ਹੋਇਆ)*"
        : invoice.payment_status === "partial"
        ? `⚠️ *PARTIAL ADVANCE RECEIVED* (Paid: ₹${invoice.amount_paid.toLocaleString("en-IN")}, Balance: ₹${invoice.balance_due.toLocaleString("en-IN")})`
        : `⏳ *PAYMENT PENDING* (Total Due: ₹${invoice.total_amount.toLocaleString("en-IN")})`;

    const itemsSummary = invoice.items
      .map(
        (it, idx) =>
          `  ${idx + 1}. *${it.description}* (Qty: ${it.quantity}) - ₹${it.amount.toLocaleString("en-IN")}`
      )
      .join("\n");

    return `🧾 *TAX INVOICE & RECEIPT FROM WEBNOURA*
────────────────────────────
*Invoice No:* ${invoice.invoice_number}
*Issue Date:* ${invoice.issue_date}
*Payment Due:* ${invoice.due_date}

👤 *Billed To (Client):*
*Name:* ${invoice.client_name}
*Business:* ${invoice.client_business || "N/A"}
*Contact:* ${invoice.client_phone || "N/A"}

💼 *Deliverables & Services:*
${itemsSummary}

💰 *Payment Breakdown:*
*Total Deal Value:* ₹${invoice.total_amount.toLocaleString("en-IN")}
*Amount Received:* ₹${invoice.amount_paid.toLocaleString("en-IN")}
*Balance Payable:* ₹${invoice.balance_due.toLocaleString("en-IN")}
*Status:* ${statusText}
${invoice.transaction_id ? `*Transaction / UTR:* ${invoice.transaction_id}\n` : ""}${invoice.payment_method ? `*Payment Mode:* ${invoice.payment_method.toUpperCase()}\n` : ""}
${
  invoice.balance_due > 0
    ? `📲 *Direct Payment Options (GPay / PhonePe / Paytm / UPI):*
*UPI ID:* 9463737763@upi
*Mobile:* +91 94637 37763 (Karan)
`
    : ""
}────────────────────────────
*WebNoura Creative Studio by Karan*
Phone / WhatsApp: +91 94637 37763
Email: webnourabykaran@gmail.com
Website: webnoura-by-karan-website.vercel.app
_Thank you for choosing WebNoura!_`;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    let cleanPhone = (invoice.client_phone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(buildWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMarkAsPaid = () => {
    adminStore.updateInvoice(invoice.id, {
      payment_status: "paid",
      amount_paid: invoice.total_amount,
      balance_due: 0,
      paid_date: new Date().toISOString().slice(0, 10),
    });
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-[#1E4378] bg-[#07172E] shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E4378] bg-[#0A2548]/95 px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs">
              INV
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-white text-base">
                  {invoice.invoice_number}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider ${
                    invoice.payment_status === "paid"
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                      : invoice.payment_status === "partial"
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                      : "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                  }`}
                >
                  {invoice.payment_status === "paid"
                    ? "✓ Paid in Full"
                    : invoice.payment_status === "partial"
                    ? `⚡ Partial Paid (${formatINR(invoice.amount_paid)})`
                    : "⏳ Payment Pending"}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Billed to <strong className="text-white">{invoice.client_name}</strong>{" "}
                ({invoice.client_business || "Direct Deal"})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Paper Theme Toggle */}
            <button
              onClick={() => setPaperTheme(paperTheme === "light" ? "dark" : "light")}
              className="flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] px-3 py-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
              title="Toggle preview theme (Official White Paper vs Dark Studio)"
            >
              {paperTheme === "light" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Dark View</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">White Paper</span>
                </>
              )}
            </button>

            {/* Quick Mark Paid */}
            {invoice.payment_status !== "paid" && (
              <button
                onClick={handleMarkAsPaid}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                title="Mark this invoice as fully paid"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark as Paid</span>
              </button>
            )}

            {/* WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
              title="Share bill details directly via WhatsApp"
            >
              <Send className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-md"
              title="Print or Save as PDF in pristine A4 resolution"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            {/* Download HTML */}
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] text-[#94A3B8] hover:text-white transition-colors"
              title="Download standalone invoice HTML"
            >
              <Download className="h-4 w-4" />
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopySummary}
              className="p-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] text-[#94A3B8] hover:text-white transition-colors"
              title="Copy invoice summary to clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>

            {/* Edit Invoice */}
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(invoice);
                }}
                className="p-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] text-[#94A3B8] hover:text-white transition-colors"
                title="Edit this invoice"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="max-h-[82vh] overflow-y-auto p-3 sm:p-6 bg-[#040E1E]/80">
          {/* THE ACTUAL INVOICE SHEET */}
          <div
            className={`relative mx-auto w-full max-w-3xl rounded-2xl p-6 sm:p-10 shadow-2xl transition-all duration-200 ${
              paperTheme === "light"
                ? "bg-white text-slate-900 border border-slate-200"
                : "bg-[#0A2548] text-white border border-[#1E4378]"
            }`}
          >
            {/* Header: Studio Brand, Stamp & Invoice Meta */}
            <div
              className={`flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b ${
                paperTheme === "light" ? "border-slate-300" : "border-[#1E4378]"
              }`}
            >
              {/* Studio Info */}
              <div className="w-full md:w-auto flex-1 max-w-sm">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 p-1 shadow-sm overflow-hidden">
                    <img
                      src="/logo.jpg"
                      alt="WebNoura Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1
                        className={`font-display text-2xl font-black uppercase tracking-tight ${
                          paperTheme === "light" ? "text-slate-950" : "text-white"
                        }`}
                      >
                        WebNoura
                      </h1>
                      <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-500 uppercase">
                        Studio
                      </span>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Creative Digital Studio by Karan
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-4 space-y-1 text-xs ${
                    paperTheme === "light" ? "text-slate-600" : "text-[#94A3B8]"
                  }`}
                >
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-blue-500" />
                    <span>+91 94637 37763 (Karan)</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-blue-500" />
                    <span>webnourabykaran@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-blue-500" />
                    <span>Punjab, India · Place of Supply: Punjab (03)</span>
                  </p>
                  <p className="text-[11px]">
                    SAC Code: <strong className={paperTheme === "light" ? "text-slate-900" : "text-white"}>998314</strong> (IT Design & Web Development)
                  </p>
                </div>
              </div>

              {/* Official Rubber Stamp Seal (Centered, Non-overlapping) */}
              <div className="shrink-0 self-center md:self-start my-2 md:my-0 flex flex-col items-center justify-center">
                <div
                  className={`pointer-events-none select-none rounded-xl border-2 border-dashed px-4 py-2 sm:px-5 sm:py-2.5 text-center font-mono uppercase tracking-wider rotate-[-5deg] transition-transform shadow-sm ${
                    paperTheme === "light"
                      ? invoice.payment_status === "paid"
                        ? "border-emerald-600 text-emerald-800 bg-emerald-50/90 ring-2 ring-emerald-600/30 shadow-emerald-500/10"
                        : invoice.payment_status === "partial"
                        ? "border-amber-600 text-amber-800 bg-amber-50/90 ring-2 ring-amber-600/30 shadow-amber-500/10"
                        : "border-rose-600 text-rose-800 bg-rose-50/90 ring-2 ring-rose-600/30 shadow-rose-500/10"
                      : invoice.payment_status === "paid"
                      ? "border-emerald-400 text-emerald-300 bg-emerald-500/10 ring-2 ring-emerald-400/40 shadow-emerald-500/20"
                      : invoice.payment_status === "partial"
                      ? "border-amber-400 text-amber-300 bg-amber-500/10 ring-2 ring-amber-400/40 shadow-amber-500/20"
                      : "border-rose-400 text-rose-300 bg-rose-500/10 ring-2 ring-rose-400/40 shadow-rose-500/20"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-black tracking-widest opacity-80">
                    <span>★</span>
                    <span>WEBNOURA STUDIO</span>
                    <span>★</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black tracking-widest my-0.5">
                    {invoice.payment_status === "paid"
                      ? "PAID IN FULL"
                      : invoice.payment_status === "partial"
                      ? "PARTIAL ADVANCE"
                      : "PAYMENT DUE"}
                  </div>
                  <div className="text-[8px] sm:text-[9px] tracking-normal font-sans opacity-90 font-bold">
                    {invoice.payment_status === "paid"
                      ? invoice.paid_date
                        ? `SETTLED ON ${invoice.paid_date}`
                        : "VERIFIED & SETTLED"
                      : invoice.payment_status === "partial"
                      ? `ADV: ${formatINR(invoice.amount_paid)} · BAL: ${formatINR(invoice.balance_due)}`
                      : "ACTION REQUIRED"}
                  </div>
                </div>
              </div>

              {/* Invoice Numbers & Dates */}
              <div className="w-full md:w-auto text-left md:text-right pt-2 md:pt-0 shrink-0">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest ${
                    paperTheme === "light"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  Tax Invoice / Bill
                </span>
                <h2
                  className={`font-mono text-2xl sm:text-3xl font-black mt-2 tracking-tight ${
                    paperTheme === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  {invoice.invoice_number}
                </h2>
                <div
                  className={`mt-3 space-y-1 text-xs ${
                    paperTheme === "light" ? "text-slate-600" : "text-[#94A3B8]"
                  }`}
                >
                  <p>
                    <span>Date of Issue:</span>{" "}
                    <strong className={paperTheme === "light" ? "text-slate-900" : "text-white"}>
                      {invoice.issue_date}
                    </strong>
                  </p>
                  <p>
                    <span>Due Date:</span>{" "}
                    <strong className={paperTheme === "light" ? "text-slate-900" : "text-white"}>
                      {invoice.due_date}
                    </strong>
                  </p>
                  {invoice.paid_date && (
                    <p>
                      <span>Paid Date:</span>{" "}
                      <strong className="text-emerald-600 font-bold">{invoice.paid_date}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Billed To & Payment Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
              {/* Client Box */}
              <div
                className={`rounded-xl p-4 border ${
                  paperTheme === "light"
                    ? "bg-slate-50 border-slate-200"
                    : "bg-[#061833]/60 border-[#1E4378]"
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-600 block mb-1">
                  BILLED TO (ਗਾਹਕ ਦਾ ਵੇਰਵਾ):
                </span>
                <h3
                  className={`font-display text-base sm:text-lg font-bold ${
                    paperTheme === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  {invoice.client_name}
                </h3>
                {invoice.client_business && (
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">
                    {invoice.client_business}
                  </p>
                )}
                <div
                  className={`mt-2.5 space-y-1 text-xs ${
                    paperTheme === "light" ? "text-slate-600" : "text-[#94A3B8]"
                  }`}
                >
                  {invoice.client_phone && <p>Phone: {invoice.client_phone}</p>}
                  {invoice.client_email && <p>Email: {invoice.client_email}</p>}
                  {invoice.client_address && <p>Address: {invoice.client_address}</p>}
                  {invoice.client_gst && (
                    <p>
                      GSTIN: <strong className={paperTheme === "light" ? "text-slate-900" : "text-white"}>{invoice.client_gst}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary Box */}
              <div
                className={`rounded-xl p-4 border flex flex-col justify-between ${
                  invoice.payment_status === "paid"
                    ? paperTheme === "light"
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-emerald-500/10 border-emerald-500/30"
                    : invoice.payment_status === "partial"
                    ? paperTheme === "light"
                      ? "bg-amber-50/60 border-amber-200"
                      : "bg-amber-500/10 border-amber-500/30"
                    : paperTheme === "light"
                    ? "bg-rose-50/60 border-rose-200"
                    : "bg-rose-500/10 border-rose-500/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                      PAYMENT STATUS:
                    </span>
                    <span
                      className={`text-xs font-mono font-bold uppercase ${
                        invoice.payment_status === "paid"
                          ? "text-emerald-700"
                          : invoice.payment_status === "partial"
                          ? "text-amber-700"
                          : "text-rose-700"
                      }`}
                    >
                      {invoice.payment_status === "paid"
                        ? "✓ Paid in Full"
                        : invoice.payment_status === "partial"
                        ? "⚡ Advance Received"
                        : "⏳ Unpaid / Pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-[10px] text-slate-500">Amount Paid:</p>
                      <p className="font-mono text-lg font-extrabold text-emerald-600">
                        {formatINR(invoice.amount_paid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Balance Due:</p>
                      <p
                        className={`font-mono text-lg font-extrabold ${
                          invoice.balance_due > 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {formatINR(invoice.balance_due)}
                      </p>
                    </div>
                  </div>
                </div>

                {(invoice.payment_method || invoice.transaction_id) && (
                  <div
                    className={`mt-2 pt-2 border-t text-[11px] ${
                      paperTheme === "light" ? "border-slate-200 text-slate-600" : "border-white/10 text-[#94A3B8]"
                    }`}
                  >
                    {invoice.payment_method && (
                      <span>Method: <strong className="uppercase">{invoice.payment_method}</strong> </span>
                    )}
                    {invoice.transaction_id && (
                      <span className="font-mono">· Ref: {invoice.transaction_id}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div
              className={`rounded-xl border overflow-hidden my-6 ${
                paperTheme === "light" ? "border-slate-200" : "border-[#1E4378]"
              }`}
            >
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead
                  className={
                    paperTheme === "light"
                      ? "bg-slate-900 text-white font-mono text-xs uppercase"
                      : "bg-[#061833] text-[#94A3B8] font-mono text-xs uppercase"
                  }
                >
                  <tr>
                    <th className="py-3 px-3.5 w-10 text-center">#</th>
                    <th className="py-3 px-3.5 font-bold">Service / Deliverable (ਕੰਮ ਦਾ ਵੇਰਵਾ)</th>
                    <th className="py-3 px-3 text-center w-16">SAC</th>
                    <th className="py-3 px-3 text-center w-14">Qty</th>
                    <th className="py-3 px-3 text-right w-24">Rate</th>
                    <th className="py-3 px-3.5 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    paperTheme === "light"
                      ? "divide-slate-200 text-slate-800"
                      : "divide-[#1E4378]/50 text-slate-200"
                  }`}
                >
                  {invoice.items.map((it, idx) => (
                    <tr
                      key={it.id || idx}
                      className={
                        idx % 2 === 0
                          ? paperTheme === "light"
                            ? "bg-white"
                            : "bg-transparent"
                          : paperTheme === "light"
                          ? "bg-slate-50/70"
                          : "bg-white/[0.02]"
                      }
                    >
                      <td className="py-3 px-3.5 text-center font-mono text-slate-400 text-xs">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3 px-3.5 font-semibold">
                        {it.description}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-xs text-slate-400">
                        998314
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {it.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatINR(it.rate)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-sm">
                        {formatINR(it.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Words Row */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 my-6">
              {/* Left Column: Words, Notes, Terms */}
              <div className="sm:max-w-md space-y-3">
                {/* Amount in words */}
                <div
                  className={`rounded-xl p-3 border-l-4 border-l-blue-600 ${
                    paperTheme === "light"
                      ? "bg-slate-50 border border-slate-200 text-slate-700"
                      : "bg-[#061833]/60 border border-[#1E4378] text-slate-300"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-600 block mb-0.5">
                    Amount in Words:
                  </span>
                  <p className="text-xs font-semibold">{amountWords}</p>
                </div>

                {invoice.notes && (
                  <div
                    className={`rounded-xl p-3 text-xs border ${
                      paperTheme === "light"
                        ? "bg-slate-50 border-slate-200 text-slate-600"
                        : "bg-[#061833]/60 border-[#1E4378] text-[#94A3B8]"
                    }`}
                  >
                    <strong className="text-blue-600 block mb-0.5 text-[10px] uppercase font-mono">
                      Deal Remarks / Notes:
                    </strong>
                    <p>{invoice.notes}</p>
                  </div>
                )}

                <div
                  className={`rounded-xl p-3 text-xs border ${
                    paperTheme === "light"
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : "bg-[#061833]/60 border-[#1E4378] text-[#94A3B8]"
                  }`}
                >
                  <strong className="text-blue-600 block mb-0.5 text-[10px] uppercase font-mono">
                    Terms &amp; Conditions:
                  </strong>
                  <p className="whitespace-pre-line text-[11px] leading-relaxed">
                    {invoice.terms ||
                      "1. 1-Year High-Speed Cloud Hosting, Free SSL & Technical Support included.\n2. Final source code and custom domain deployment upon full payment."}
                  </p>
                </div>
              </div>

              {/* Right Column: Financial Breakdown Table */}
              <div
                className={`w-full sm:w-80 rounded-xl p-4 border space-y-2 text-xs sm:text-sm ${
                  paperTheme === "light"
                    ? "bg-slate-50 border-slate-200 text-slate-800"
                    : "bg-[#061833]/70 border-[#1E4378] text-slate-200"
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-mono font-medium">{formatINR(invoice.subtotal)}</span>
                </div>

                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono font-medium">-{formatINR(invoice.discount_amount)}</span>
                  </div>
                )}

                {invoice.tax_amount > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Taxes / GST:</span>
                    <span className="font-mono font-medium">+{formatINR(invoice.tax_amount)}</span>
                  </div>
                )}

                <div
                  className={`border-t pt-2 flex justify-between font-extrabold text-base ${
                    paperTheme === "light" ? "border-slate-300 text-slate-900" : "border-[#1E4378] text-white"
                  }`}
                >
                  <span>Grand Total:</span>
                  <span className="font-mono text-lg text-blue-600">
                    {formatINR(invoice.total_amount)}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                  <span>Amount Paid:</span>
                  <span className="font-mono">{formatINR(invoice.amount_paid)}</span>
                </div>

                <div
                  className={`border-t pt-2 flex justify-between font-extrabold text-sm sm:text-base ${
                    paperTheme === "light" ? "border-slate-300" : "border-[#1E4378]"
                  }`}
                >
                  <span className={invoice.balance_due > 0 ? "text-rose-600" : "text-emerald-600"}>
                    Balance Payable:
                  </span>
                  <span
                    className={`font-mono ${
                      invoice.balance_due > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {formatINR(invoice.balance_due)}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct UPI Scannable Payment Box (When Balance > 0) */}
            {invoice.balance_due > 0 && (
              <div
                className={`rounded-xl p-4 sm:p-5 my-6 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  paperTheme === "light"
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                    : "bg-emerald-950/20 border-emerald-500/30 text-emerald-100"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-display font-bold text-sm text-emerald-800 dark:text-emerald-300">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>How to Pay Remaining Balance (ਬਾਕੀ ਰਕਮ ਕਿਵੇਂ ਜਮ੍ਹਾ ਕਰਵਾਉਣੀ ਹੈ):</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    Scan the QR code with any UPI App (Google Pay, PhonePe, Paytm, BHIM) to pay the balance of{" "}
                    <strong>{formatINR(invoice.balance_due)}</strong> directly.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-mono font-bold text-emerald-900 border border-emerald-300 shadow-sm">
                      UPI ID: 9463737763@upi
                    </span>
                    <span className="text-xs text-emerald-700">
                      or WhatsApp / Mobile: +91 94637 37763
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-center">
                  <img
                    src={qrUrl}
                    alt="Scan UPI QR Code"
                    className="h-24 w-24 rounded-lg bg-white p-1 border border-emerald-300 shadow-sm"
                  />
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 mt-1 block uppercase tracking-wider">
                    Scan to Pay
                  </span>
                </div>
              </div>
            )}

            {/* Footer & Authorized Signatory */}
            <div
              className={`pt-6 border-t flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 ${
                paperTheme === "light" ? "border-slate-300" : "border-[#1E4378]"
              }`}
            >
              <div
                className={`text-[11px] space-y-1 ${
                  paperTheme === "light" ? "text-slate-500" : "text-[#64748B]"
                }`}
              >
                <p>This is a computer-generated official tax invoice issued by WebNoura Creative Studio.</p>
                <p>For any billing inquiries, please contact Karan at +91 94637 37763.</p>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-display text-2xl font-black italic text-blue-600 tracking-tight">
                  Karan
                </div>
                <p
                  className={`text-xs font-bold mt-0.5 ${
                    paperTheme === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  Authorized Signatory
                </p>
                <p
                  className={`text-[10px] ${
                    paperTheme === "light" ? "text-slate-500" : "text-[#94A3B8]"
                  }`}
                >
                  Founder &amp; Principal Developer · WebNoura
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
