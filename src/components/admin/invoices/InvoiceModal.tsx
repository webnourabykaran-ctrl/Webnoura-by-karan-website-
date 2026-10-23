import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  AdminInvoice,
  InvoiceItem,
  InvoicePaymentStatus,
  PaymentMethod,
  AdminEnquiry,
  ActiveProject,
} from "@/types/admin";
import { adminStore } from "@/lib/adminStore";
import { formatINR } from "@/lib/invoiceUtils";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdInvoice?: AdminInvoice) => void;
  initialInvoice?: AdminInvoice | null;
}

const PRESET_SERVICES = [
  { desc: "Business & Hotel Website (High Converting, Mobile Optimized)", rate: 4999 },
  { desc: "Restaurant & Café Website (Digital Menu, Reservation Links, Dining Showcase)", rate: 4999 },
  { desc: "Gym & Fitness Website (Training Zones, Equipment Showcase, Lead Form)", rate: 4999 },
  { desc: "Portfolio & Creative Agency Website (Luxury Motion, Live Projects)", rate: 4999 },
  { desc: "Domain Registration, High-Speed Cloud Hosting & SSL Setup (1 Year)", rate: 1499 },
  { desc: "Google Business Profile, SEO & Local Search Setup", rate: 1999 },
  { desc: "Annual Website Maintenance, Cloud Backups & Technical Support", rate: 2999 },
  { desc: "Custom Full-Stack Web Application / E-Commerce System", rate: 14999 },
];

export function InvoiceModal({
  isOpen,
  onClose,
  onSuccess,
  initialInvoice,
}: InvoiceModalProps) {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientBusiness, setClientBusiness] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientGst, setClientGst] = useState("");

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "itm-1",
      description: "Business & Hotel Website (High Converting, Mobile Optimized)",
      quantity: 1,
      rate: 4999,
      amount: 4999,
    },
  ]);

  // Pricing adjustments
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  // Payment Details
  const [paymentStatus, setPaymentStatus] = useState<InvoicePaymentStatus>("partial");
  const [amountPaid, setAmountPaid] = useState<number>(2500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [transactionId, setTransactionId] = useState("");
  const [paidDate, setPaidDate] = useState("");

  // Notes & Terms
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(
    "1. 1-Year High-Speed Cloud Hosting, Free SSL & Technical Support included.\n2. Final source and custom domain deployment upon full payment."
  );

  useEffect(() => {
    if (isOpen) {
      setValidationError(null);
      setEnquiries(adminStore.getEnquiries());
      setProjects(adminStore.getActiveProjects());

      if (initialInvoice) {
        setClientName(initialInvoice.client_name || "");
        setClientBusiness(initialInvoice.client_business || "");
        setClientPhone(initialInvoice.client_phone || "");
        setClientEmail(initialInvoice.client_email || "");
        setClientAddress(initialInvoice.client_address || "");
        setClientGst(initialInvoice.client_gst || "");

        setInvoiceNumber(initialInvoice.invoice_number || "");
        setIssueDate(initialInvoice.issue_date || "");
        setDueDate(initialInvoice.due_date || "");

        setItems(
          initialInvoice.items && initialInvoice.items.length > 0
            ? initialInvoice.items
            : [
                {
                  id: "itm-1",
                  description: "Business Website Development",
                  quantity: 1,
                  rate: 4999,
                  amount: 4999,
                },
              ]
        );

        setDiscountAmount(initialInvoice.discount_amount || 0);
        setTaxAmount(initialInvoice.tax_amount || 0);
        if (initialInvoice.tax_amount && initialInvoice.subtotal > 0) {
          const estimatedPct = Math.round((initialInvoice.tax_amount / (initialInvoice.subtotal - (initialInvoice.discount_amount || 0))) * 100);
          setTaxPercent(estimatedPct === 18 ? 18 : estimatedPct === 5 ? 5 : estimatedPct === 12 ? 12 : 0);
        } else {
          setTaxPercent(0);
        }

        setPaymentStatus(initialInvoice.payment_status || "partial");
        setAmountPaid(initialInvoice.amount_paid || 0);
        setPaymentMethod(initialInvoice.payment_method || "upi");
        setTransactionId(initialInvoice.transaction_id || "");
        setPaidDate(initialInvoice.paid_date || "");

        setNotes(initialInvoice.notes || "");
        setTerms(
          initialInvoice.terms ||
            "1. 1-Year High-Speed Cloud Hosting, Free SSL & Technical Support included.\n2. Final source and custom domain deployment upon full payment."
        );
      } else {
        // Auto-generate invoice number
        const existing = adminStore.getInvoices();
        const nextNum = existing.length + 1;
        const autoInvNum = `WN-2026-${String(nextNum).padStart(3, "0")}`;

        const today = new Date().toISOString().slice(0, 10);
        const due = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

        setInvoiceNumber(autoInvNum);
        setIssueDate(today);
        setDueDate(due);
        setPaidDate(today);
        setDiscountAmount(0);
        setTaxPercent(0);
        setTaxAmount(0);
        setPaymentStatus("partial");
        setAmountPaid(2500);
        setPaymentMethod("upi");
        setTransactionId(`UPI/${Date.now().toString().slice(-8)}`);
        setNotes("50% advance received. Remaining balance payable upon domain deployment.");
        setTerms(
          "1. 1-Year High-Speed Cloud Hosting, Free SSL & Technical Support included.\n2. Final source and custom domain deployment upon full payment."
        );
        setItems([
          {
            id: "itm-1",
            description: "Business & Hotel Website (High Converting, Mobile Optimized)",
            quantity: 1,
            rate: 4999,
            amount: 4999,
          },
        ]);
      }
    }
  }, [isOpen, initialInvoice]);

  if (!isOpen) return null;

  // Real-time calculations
  const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const netBeforeTax = Math.max(0, subtotal - (Number(discountAmount) || 0));
  const effectiveTax = taxPercent > 0 ? Math.round((netBeforeTax * taxPercent) / 100) : taxAmount;
  const totalAmount = Math.max(0, netBeforeTax + effectiveTax);
  const effectivePaid = Math.min(totalAmount, Math.max(0, Number(amountPaid) || 0));
  const balanceDue = Math.max(0, totalAmount - effectivePaid);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === "quantity") {
      const q = Math.max(1, parseInt(value, 10) || 1);
      item.quantity = q;
      item.amount = q * (item.rate || 0);
    } else if (field === "rate") {
      const r = Math.max(0, parseFloat(value) || 0);
      item.rate = r;
      item.amount = (item.quantity || 1) * r;
    } else if (field === "amount") {
      item.amount = Math.max(0, parseFloat(value) || 0);
    } else {
      (item as any)[field] = value;
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = (presetDesc?: string, presetRate?: number) => {
    setItems([
      ...items,
      {
        id: "itm-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        description: presetDesc || "Domain & High-Speed Cloud Hosting Setup (1 Year)",
        quantity: 1,
        rate: presetRate !== undefined ? presetRate : 1499,
        amount: presetRate !== undefined ? presetRate : 1499,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleTaxPreset = (pct: number) => {
    setTaxPercent(pct);
    if (pct === 0) {
      setTaxAmount(0);
    } else {
      setTaxAmount(Math.round((netBeforeTax * pct) / 100));
    }
  };

  const handlePaymentPreset = (mode: "full" | "half" | "quarter" | "zero") => {
    if (mode === "full") {
      setAmountPaid(totalAmount);
      setPaymentStatus("paid");
    } else if (mode === "half") {
      const half = Math.round(totalAmount / 2);
      setAmountPaid(half);
      setPaymentStatus("partial");
    } else if (mode === "quarter") {
      const qtr = Math.round(totalAmount / 4);
      setAmountPaid(qtr);
      setPaymentStatus("partial");
    } else {
      setAmountPaid(0);
      setPaymentStatus("pending");
    }
  };

  const handleAutofillEnquiry = (enqId: string) => {
    const enq = enquiries.find((e) => e.id === enqId);
    if (!enq) return;
    if (enq.name) setClientName(enq.name);
    if (enq.business_name) setClientBusiness(enq.business_name);
    if (enq.phone) setClientPhone(enq.phone);
    if (enq.email) setClientEmail(enq.email);

    const desc = `${enq.website_type || "Business Website"} Development (${enq.details.slice(0, 60)}...)`;
    setItems([
      {
        id: "itm-1",
        description: desc,
        quantity: 1,
        rate: 4999,
        amount: 4999,
      },
    ]);
  };

  const handleAutofillProject = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    if (proj.client_name) setClientName(proj.client_name);
    if (proj.business_name) setClientBusiness(proj.business_name);
    if (proj.client_phone) setClientPhone(proj.client_phone);
    if (proj.client_email) setClientEmail(proj.client_email);

    setItems([
      {
        id: "itm-1",
        description: `${proj.project_title} (${proj.package_name})`,
        quantity: 1,
        rate: 4999,
        amount: 4999,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setValidationError("Please enter the client's full name (ਗਾਹਕ ਦਾ ਨਾਮ ਭਰਨਾ ਜ਼ਰੂਰੀ ਹੈ)");
      return;
    }

    if (items.length === 0 || !items.some((it) => it.description.trim())) {
      setValidationError("Please add at least one valid service item (ਘੱਟੋ-ਘੱਟ ਇੱਕ ਕੰਮ ਦਾ ਵੇਰਵਾ ਭਰੋ)");
      return;
    }

    // Determine accurate payment status
    let finalStatus: InvoicePaymentStatus = paymentStatus;
    if (effectivePaid >= totalAmount && totalAmount > 0) {
      finalStatus = "paid";
    } else if (effectivePaid > 0 && effectivePaid < totalAmount) {
      finalStatus = "partial";
    } else if (effectivePaid === 0) {
      finalStatus = "pending";
    }

    const invoicePayload = {
      invoice_number: invoiceNumber.trim() || `WN-2026-${Date.now().toString().slice(-3)}`,
      client_name: clientName.trim(),
      client_business: clientBusiness.trim() || "Individual Client",
      client_phone: clientPhone.trim() || undefined,
      client_email: clientEmail.trim() || undefined,
      client_address: clientAddress.trim() || undefined,
      client_gst: clientGst.trim() || undefined,
      issue_date: issueDate || new Date().toISOString().slice(0, 10),
      due_date: dueDate || new Date().toISOString().slice(0, 10),
      items: items.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 1,
        rate: Number(it.rate) || 0,
        amount: Number(it.amount) || 0,
      })),
      subtotal,
      discount_amount: Number(discountAmount) || 0,
      tax_amount: effectiveTax,
      total_amount: totalAmount,
      amount_paid: effectivePaid,
      balance_due: balanceDue,
      payment_status: finalStatus,
      payment_method: paymentMethod,
      transaction_id: transactionId.trim() || undefined,
      paid_date: paidDate || (effectivePaid > 0 ? issueDate : undefined),
      notes: notes.trim() || undefined,
      terms: terms.trim() || undefined,
    };

    let resultInvoice: AdminInvoice;
    if (initialInvoice) {
      const updated = adminStore.updateInvoice(initialInvoice.id, invoicePayload);
      resultInvoice = updated || {
        ...initialInvoice,
        ...invoicePayload,
        updated_at: new Date().toISOString(),
      };
    } else {
      resultInvoice = adminStore.addInvoice(invoicePayload);
    }

    onSuccess(resultInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#1E4378] bg-[#07172E] text-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E4378] bg-[#0A2548] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-[#07172E] font-bold shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                {initialInvoice ? "Edit Invoice (ਬਿੱਲ ਵਿੱਚ ਬਦਲਾਅ ਕਰੋ)" : "Generate Deal Invoice (ਨਵਾਂ ਬਿੱਲ ਬਣਾਓ)"}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Professional client billing with auto tax, dynamic UPI QR &amp; instant WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="flex items-center gap-2.5 bg-rose-500/20 border-b border-rose-500/40 px-6 py-3 text-xs font-semibold text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto p-6 space-y-6">
          {/* Quick Prefill from Leads/Projects */}
          {(enquiries.length > 0 || projects.length > 0) && !initialInvoice && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>Quick Autofill Deal (ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਲੀਡ ਤੋਂ ਆਟੋ-ਭਰੋ):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {enquiries.length > 0 && (
                  <div>
                    <label className="text-[11px] text-[#94A3B8] block mb-1">From Enquiries:</label>
                    <select
                      onChange={(e) => handleAutofillEnquiry(e.target.value)}
                      defaultValue=""
                      className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="" disabled>Select enquiry lead...</option>
                      {enquiries.map((enq) => (
                        <option key={enq.id} value={enq.id}>
                          {enq.name} - {enq.business_name || enq.website_type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {projects.length > 0 && (
                  <div>
                    <label className="text-[11px] text-[#94A3B8] block mb-1">From Projects:</label>
                    <select
                      onChange={(e) => handleAutofillProject(e.target.value)}
                      defaultValue=""
                      className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="" disabled>Select active project...</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.client_name} - {proj.business_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 1: Client Information */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E4378]/60 pb-2">
              <User className="h-4 w-4 text-blue-400" />
              1. Client &amp; Business Information (ਗਾਹਕ ਦਾ ਵੇਰਵਾ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Business / Brand / Shop Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Majha Café & Restaurant"
                  value={clientBusiness}
                  onChange={(e) => setClientBusiness(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  WhatsApp / Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Billing City / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mall Road, Amritsar, Punjab"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Client GSTIN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 03AAAAA0000A1Z5"
                  value={clientGst}
                  onChange={(e) => setClientGst(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Invoice Metadata */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E4378]/60 pb-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              2. Invoice Identification (ਬਿੱਲ ਨੰਬਰ ਅਤੇ ਮਿਤੀਆਂ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs font-mono font-bold text-cyan-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Line Items */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E4378]/60 pb-2">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-400" />
                3. Services &amp; Packages (ਸੇਵਾਵਾਂ ਅਤੇ ਕੀਮਤ)
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Add Item</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Service Chips */}
            <div>
              <p className="text-[11px] text-[#94A3B8] mb-1.5">Quick add standard package:</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SERVICES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddItem(p.desc, p.rate)}
                    className="rounded-lg border border-[#1E4378] bg-[#061833] hover:border-blue-500/60 px-2.5 py-1 text-[11px] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    + {p.desc.split("(")[0].trim()} (₹{p.rate.toLocaleString("en-IN")})
                  </button>
                ))}
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-2xl border border-[#1E4378] bg-[#0A2548]/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      Item #{idx + 1}
                    </span>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Service / package description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#94A3B8] mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#94A3B8] mb-1">Rate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                        className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#94A3B8] mb-1">Amount (₹)</label>
                      <input
                        type="text"
                        readOnly
                        value={formatINR(item.amount)}
                        className="w-full rounded-xl border border-[#1E4378]/50 bg-[#061833]/60 px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adjustments: Discount & GST Tax */}
            <div className="rounded-2xl border border-[#1E4378] bg-[#0A2548]/30 p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                    Special Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                  />
                </div>

                {/* GST / Tax Presets */}
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                    GST / Tax Rate
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { label: "0% (Exempt)", val: 0 },
                      { label: "18% GST", val: 18 },
                      { label: "5% GST", val: 5 },
                      { label: "12% GST", val: 12 },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => handleTaxPreset(p.val)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          taxPercent === p.val
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-[#061833] border border-[#1E4378] text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtotal & Grand Total Preview Cards */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#1E4378]/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Subtotal:</span>
                  <span className="font-mono font-bold text-white text-sm">{formatINR(subtotal)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tax Amount:</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">+{formatINR(effectiveTax)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Grand Total:</span>
                  <span className="font-mono font-black text-emerald-400 text-base">{formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E4378]/60 pb-2">
              <CreditCard className="h-4 w-4 text-blue-400" />
              4. Payment &amp; Advance Split (ਪੇਮੈਂਟ ਅਤੇ ਅਡਵਾਂਸ)
            </h3>

            {/* Quick 1-click Advance Presets */}
            <div>
              <span className="text-[11px] text-[#94A3B8] block mb-1.5">Quick Advance Shortcuts:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePaymentPreset("half")}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors"
                >
                  ⚡ 50% Advance ({formatINR(Math.round(totalAmount / 2))})
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentPreset("full")}
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors"
                >
                  ✓ 100% Paid in Full ({formatINR(totalAmount)})
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentPreset("quarter")}
                  className="rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-300 transition-colors"
                >
                  25% Advance ({formatINR(Math.round(totalAmount / 4))})
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentPreset("zero")}
                  className="rounded-xl border border-slate-600 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors"
                >
                  0% Unpaid (Pending)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Amount Received / Advance (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={amountPaid === 0 ? "" : amountPaid}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    setAmountPaid(val);
                    if (val >= totalAmount && totalAmount > 0) setPaymentStatus("paid");
                    else if (val > 0) setPaymentStatus("partial");
                    else setPaymentStatus("pending");
                  }}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Remaining Balance Due (ਬਾਕੀ ਰਕਮ)
                </label>
                <input
                  type="text"
                  readOnly
                  value={formatINR(balanceDue)}
                  className={`w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-xs font-mono font-black ${
                    balanceDue > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="upi">UPI (Google Pay, PhonePe, Paytm, BHIM)</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="cash">Cash in Hand</option>
                  <option value="card">Card Payment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Transaction / UTR Reference ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI/529182049182"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Notes & Terms */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E4378]/60 pb-2">
              <FileText className="h-4 w-4 text-blue-400" />
              5. Deal Notes &amp; Terms (ਸ਼ਰਤਾਂ ਅਤੇ ਨੋਟਸ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Notes / Payment Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 50% advance received. Remaining payable upon deployment."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Terms &amp; Conditions (ਬਿੱਲ ਦੀਆਂ ਸ਼ਰਤਾਂ)
                </label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1E4378]">
            <div className="text-xs text-[#94A3B8]">
              Total Deal: <strong className="text-white">{formatINR(totalAmount)}</strong> · Due:{" "}
              <strong className={balanceDue > 0 ? "text-rose-400" : "text-emerald-400"}>
                {formatINR(balanceDue)}
              </strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] px-5 py-2.5 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
              >
                {initialInvoice ? "Save Changes" : "Generate Invoice & View"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
