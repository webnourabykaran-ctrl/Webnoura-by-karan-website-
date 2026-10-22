import { useState } from "react";
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Send,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AdminInvoice } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";

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
  const settings = adminStore.getSettings();

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const buildWhatsAppMessage = () => {
    const statusText =
      invoice.payment_status === "paid"
        ? "✅ *PAID (ਪੂਰਾ ਭੁਗਤਾਨ ਹੋ ਚੁੱਕਾ ਹੈ)*"
        : invoice.payment_status === "partial"
        ? `⚠️ *PARTIAL ADVANCE RECEIVED* (Paid: ₹${invoice.amount_paid.toLocaleString("en-IN")}, Balance: ₹${invoice.balance_due.toLocaleString("en-IN")})`
        : `⏳ *PAYMENT PENDING* (Due: ₹${invoice.total_amount.toLocaleString("en-IN")})`;

    const itemsSummary = invoice.items
      .map((it, idx) => `  ${idx + 1}. ${it.description} - ₹${it.amount.toLocaleString("en-IN")}`)
      .join("\n");

    return `🧾 *INVOICE & BILLING RECEIPT FROM WEBNOURA*
────────────────────────────
*Invoice No:* ${invoice.invoice_number}
*Issue Date:* ${invoice.issue_date}
*Due Date:* ${invoice.due_date}

👤 *Client Details:*
*Name:* ${invoice.client_name}
*Business:* ${invoice.client_business || "N/A"}
*Contact:* ${invoice.client_phone || "N/A"}

💼 *Service Details:*
${itemsSummary}

💰 *Payment Breakdown:*
*Total Deal Value:* ₹${invoice.total_amount.toLocaleString("en-IN")}
*Amount Received:* ₹${invoice.amount_paid.toLocaleString("en-IN")}
*Balance Due:* ₹${invoice.balance_due.toLocaleString("en-IN")}
*Payment Status:* ${statusText}
${invoice.transaction_id ? `*Transaction / UTR:* ${invoice.transaction_id}` : ""}
${invoice.payment_method ? `*Payment Mode:* ${invoice.payment_method.toUpperCase()}` : ""}

${
  invoice.balance_due > 0
    ? `📲 *Payment Options (UPI / GPay / PhonePe / Paytm):*
*UPI ID:* 9463737763@upi or *Phone:* +91 94637 37763
`
    : ""
}────────────────────────────
*WebNoura Creative Studio by Karan*
Phone/WhatsApp: +91 94637 37763
Email: webnourabykaran@gmail.com
Website: webnoura-by-karan-website.vercel.app
_Thank you for trusting WebNoura with your digital presence!_`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-[#1E4378] bg-[#061833] shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:w-full print:max-w-none print:rounded-none">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E4378] bg-[#0A2548]/90 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono font-bold text-xs">
              INV
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base">
                  {invoice.invoice_number}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase ${
                    invoice.payment_status === "paid"
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                      : invoice.payment_status === "partial"
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                      : "bg-blue-500/20 border border-blue-500/40 text-blue-400"
                  }`}
                >
                  {invoice.payment_status === "paid"
                    ? "Paid in Full"
                    : invoice.payment_status === "partial"
                    ? `Partial Paid (₹${invoice.amount_paid.toLocaleString("en-IN")})`
                    : "Payment Pending"}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Billed to {invoice.client_name} ({invoice.client_business || "Direct Deal"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {invoice.payment_status !== "paid" && (
              <button
                onClick={handleMarkAsPaid}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                title="Mark this invoice as fully paid"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark as Paid</span>
              </button>
            )}

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
              title="Send bill on WhatsApp"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send WhatsApp</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] px-3 py-1.5 text-xs font-medium text-white transition-all"
              title="Copy invoice summary text"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(invoice);
                }}
                className="rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] px-3 py-1.5 text-xs text-white"
              >
                Edit
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE PAPER BODY */}
        <div className="max-h-[82vh] overflow-y-auto p-6 sm:p-10 text-white print:max-h-none print:p-8 print:text-black print:overflow-visible">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-8 border-b border-[#1E4378] print:border-gray-300">
            {/* Agency Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#00F0FF] text-[#061833] font-display font-extrabold text-xl shadow-lg print:border print:border-gray-400">
                  WN
                </div>
                <div>
                  <h1 className="font-display text-2xl font-black tracking-tight text-white print:text-black">
                    WEBNOURA
                  </h1>
                  <p className="text-xs tracking-wider uppercase text-[#38BDF8] print:text-blue-700 font-semibold">
                    Creative Digital Studio · Karan
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-xs text-[#94A3B8] print:text-gray-600">
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-[#3B82F6] print:text-black" />
                  <span>+91 94637 37763 (Karan)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-[#3B82F6] print:text-black" />
                  <span>webnourabykaran@gmail.com</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#3B82F6] print:text-black" />
                  <span>Punjab, India · webnoura-by-karan-website.vercel.app</span>
                </p>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right">
              <span className="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-mono font-bold text-blue-400 print:text-blue-800 print:border-blue-800 uppercase tracking-widest">
                TAX INVOICE / BILL
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white print:text-black mt-2">
                {invoice.invoice_number}
              </h2>
              <div className="mt-3 space-y-1 text-xs text-[#94A3B8] print:text-gray-700">
                <p>
                  <span className="text-[#64748B] print:text-gray-500">Invoice Date:</span>{" "}
                  <strong className="text-white print:text-black">{invoice.issue_date}</strong>
                </p>
                <p>
                  <span className="text-[#64748B] print:text-gray-500">Payment Due:</span>{" "}
                  <strong className="text-white print:text-black">{invoice.due_date}</strong>
                </p>
                {invoice.paid_date && (
                  <p>
                    <span className="text-[#64748B] print:text-gray-500">Paid Date:</span>{" "}
                    <strong className="text-emerald-400 print:text-emerald-700">{invoice.paid_date}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client & Billing Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Billed To */}
            <div className="rounded-2xl border border-[#1E4378] bg-[#0A2548]/40 p-5 print:border-gray-300 print:bg-gray-50">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8] print:text-blue-700 font-bold">
                BILLED TO (ਗਾਹਕ ਦਾ ਵੇਰਵਾ):
              </span>
              <h3 className="font-display text-lg font-bold text-white print:text-black mt-1">
                {invoice.client_name}
              </h3>
              {invoice.client_business && (
                <p className="text-sm font-semibold text-[#60A5FA] print:text-blue-800">
                  {invoice.client_business}
                </p>
              )}
              <div className="mt-3 space-y-1 text-xs text-[#94A3B8] print:text-gray-600">
                {invoice.client_phone && <p>Phone: {invoice.client_phone}</p>}
                {invoice.client_email && <p>Email: {invoice.client_email}</p>}
                {invoice.client_address && <p>Address: {invoice.client_address}</p>}
                {invoice.client_gst && <p>GSTIN: {invoice.client_gst}</p>}
              </div>
            </div>

            {/* Payment Status Card */}
            <div
              className={`rounded-2xl border p-5 ${
                invoice.payment_status === "paid"
                  ? "border-emerald-500/40 bg-emerald-500/10 print:border-emerald-400 print:bg-emerald-50"
                  : invoice.payment_status === "partial"
                  ? "border-amber-500/40 bg-amber-500/10 print:border-amber-400 print:bg-amber-50"
                  : "border-blue-500/40 bg-blue-500/10 print:border-blue-400 print:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#94A3B8] print:text-gray-700">
                  PAYMENT SUMMARY:
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold uppercase ${
                    invoice.payment_status === "paid"
                      ? "bg-emerald-500/20 text-emerald-400 print:text-emerald-800"
                      : invoice.payment_status === "partial"
                      ? "bg-amber-500/20 text-amber-400 print:text-amber-800"
                      : "bg-blue-500/20 text-blue-400 print:text-blue-800"
                  }`}
                >
                  {invoice.payment_status === "paid"
                    ? "✓ PAID IN FULL"
                    : invoice.payment_status === "partial"
                    ? "⚡ PARTIAL ADVANCE"
                    : "⏳ DUE PAYMENT"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-[#94A3B8] print:text-gray-500">Amount Paid:</p>
                  <p className="text-lg font-bold text-emerald-400 print:text-emerald-700">
                    ₹{invoice.amount_paid.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] print:text-gray-500">Balance Due:</p>
                  <p
                    className={`text-lg font-bold ${
                      invoice.balance_due > 0
                        ? "text-rose-400 print:text-rose-700"
                        : "text-emerald-400 print:text-emerald-700"
                    }`}
                  >
                    ₹{invoice.balance_due.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {(invoice.transaction_id || invoice.payment_method) && (
                <div className="mt-3 pt-3 border-t border-white/10 print:border-gray-200 text-xs text-[#94A3B8] print:text-gray-600">
                  {invoice.payment_method && (
                    <p>
                      Method: <span className="text-white print:text-black uppercase font-medium">{invoice.payment_method}</span>
                    </p>
                  )}
                  {invoice.transaction_id && (
                    <p className="font-mono text-[11px]">
                      UTR/Ref: <span className="text-white print:text-black">{invoice.transaction_id}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="my-8 rounded-2xl border border-[#1E4378] overflow-hidden print:border-gray-300">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0A2548] border-b border-[#1E4378] text-[#94A3B8] print:bg-gray-100 print:text-gray-700 print:border-gray-300">
                <tr>
                  <th className="py-3 px-4 w-12 font-mono">#</th>
                  <th className="py-3 px-4 font-semibold text-white print:text-black">Service Description (ਕੰਮ ਦਾ ਵੇਰਵਾ)</th>
                  <th className="py-3 px-4 text-center font-mono w-20">Qty</th>
                  <th className="py-3 px-4 text-right font-mono w-28">Rate</th>
                  <th className="py-3 px-4 text-right font-mono w-28 text-white print:text-black">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E4378]/50 print:divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-white/[0.02] print:hover:bg-transparent">
                    <td className="py-3.5 px-4 font-mono text-[#64748B] print:text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white print:text-black">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#94A3B8] print:text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#94A3B8] print:text-gray-600">
                      ₹{item.rate.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white print:text-black">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Totals */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 my-8">
            {/* Notes / Terms */}
            <div className="sm:max-w-md space-y-3">
              {invoice.notes && (
                <div className="rounded-xl border border-[#1E4378]/70 bg-[#0A2548]/30 p-3.5 text-xs print:border-gray-300 print:bg-gray-50">
                  <p className="font-semibold text-[#38BDF8] print:text-blue-800 mb-1">Deal Notes:</p>
                  <p className="text-[#94A3B8] print:text-gray-700">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div className="rounded-xl border border-[#1E4378]/70 bg-[#0A2548]/30 p-3.5 text-xs print:border-gray-300 print:bg-gray-50">
                  <p className="font-semibold text-[#38BDF8] print:text-blue-800 mb-1">Terms & Conditions:</p>
                  <p className="text-[#94A3B8] print:text-gray-700">{invoice.terms}</p>
                </div>
              )}
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-80 rounded-2xl border border-[#1E4378] bg-[#0A2548]/50 p-5 space-y-2.5 text-xs sm:text-sm print:border-gray-300 print:bg-gray-50">
              <div className="flex justify-between text-[#94A3B8] print:text-gray-600">
                <span>Subtotal (ਕੁੱਲ ਰਕਮ):</span>
                <span className="font-mono text-white print:text-black">
                  ₹{invoice.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                  <span>Special Discount:</span>
                  <span className="font-mono">-₹{invoice.discount_amount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {invoice.tax_amount > 0 && (
                <div className="flex justify-between text-[#94A3B8] print:text-gray-600">
                  <span>Taxes / GST:</span>
                  <span className="font-mono">+₹{invoice.tax_amount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="border-t border-[#1E4378] pt-2 flex justify-between text-base font-extrabold text-white print:text-black print:border-gray-300">
                <span>Grand Total:</span>
                <span className="font-mono text-lg text-[#38BDF8] print:text-blue-700">
                  ₹{invoice.total_amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-emerald-400 print:text-emerald-700 pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono font-bold">
                  ₹{invoice.amount_paid.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-[#1E4378] pt-2 flex justify-between font-bold print:border-gray-300">
                <span className="text-[#94A3B8] print:text-gray-600">Balance Payable:</span>
                <span
                  className={`font-mono text-base ${
                    invoice.balance_due > 0
                      ? "text-rose-400 print:text-rose-700"
                      : "text-emerald-400 print:text-emerald-700"
                  }`}
                >
                  ₹{invoice.balance_due.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions (If Balance Due > 0) */}
          {invoice.balance_due > 0 && (
            <div className="my-8 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-transparent p-5 print:border-blue-300 print:bg-blue-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-white print:text-black text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-400" />
                    How to Pay Balance (ਬਾਕੀ ਰਕਮ ਕਿਵੇਂ ਜਮ੍ਹਾ ਕਰਵਾਉਣੀ ਹੈ):
                  </h4>
                  <p className="text-xs text-[#94A3B8] print:text-gray-600 mt-1">
                    Scan or enter UPI ID to transfer remaining balance of{" "}
                    <strong className="text-white print:text-black">₹{invoice.balance_due.toLocaleString("en-IN")}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-blue-500/30 bg-[#061833] px-3.5 py-2 text-xs font-mono font-bold text-blue-300 print:bg-white print:text-blue-900">
                    UPI: 9463737763@upi
                  </div>
                  <span className="text-xs text-[#94A3B8] print:text-gray-600">
                    GPay / PhonePe / Paytm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer & Signature */}
          <div className="pt-8 border-t border-[#1E4378] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 print:border-gray-300">
            <div className="text-xs text-[#64748B] print:text-gray-500 space-y-1">
              <p>This is a computer-generated tax invoice issued by WebNoura Creative Studio.</p>
              <p>For any queries regarding this bill, please contact Karan at +91 94637 37763.</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-display text-xl font-bold tracking-tight text-[#38BDF8] print:text-blue-700 italic">
                Karan
              </div>
              <p className="text-xs font-semibold text-white print:text-black mt-1">
                Authorized Signatory
              </p>
              <p className="text-[11px] text-[#94A3B8] print:text-gray-500">
                Founder &amp; Lead Developer · WebNoura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
