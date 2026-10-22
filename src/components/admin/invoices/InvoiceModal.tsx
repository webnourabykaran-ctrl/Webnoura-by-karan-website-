import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  DollarSign,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle2,
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
  const [discountAmount, setDiscountAmount] = useState("0");
  const [taxAmount, setTaxAmount] = useState("0");

  // Payment Details
  const [paymentStatus, setPaymentStatus] = useState<InvoicePaymentStatus>("partial");
  const [amountPaidInput, setAmountPaidInput] = useState("2500");
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
      setEnquiries(adminStore.getEnquiries());
      setProjects(adminStore.getActiveProjects());

      if (initialInvoice) {
        setClientName(initialInvoice.client_name);
        setClientBusiness(initialInvoice.client_business);
        setClientPhone(initialInvoice.client_phone || "");
        setClientEmail(initialInvoice.client_email || "");
        setClientAddress(initialInvoice.client_address || "");
        setClientGst(initialInvoice.client_gst || "");

        setInvoiceNumber(initialInvoice.invoice_number);
        setIssueDate(initialInvoice.issue_date);
        setDueDate(initialInvoice.due_date);

        setItems(initialInvoice.items.length > 0 ? initialInvoice.items : [
          { id: "itm-1", description: "Website Development", quantity: 1, rate: 4999, amount: 4999 },
        ]);
        setDiscountAmount(String(initialInvoice.discount_amount || 0));
        setTaxAmount(String(initialInvoice.tax_amount || 0));

        setPaymentStatus(initialInvoice.payment_status);
        setAmountPaidInput(String(initialInvoice.amount_paid || 0));
        setPaymentMethod(initialInvoice.payment_method || "upi");
        setTransactionId(initialInvoice.transaction_id || "");
        setPaidDate(initialInvoice.paid_date || "");

        setNotes(initialInvoice.notes || "");
        setTerms(initialInvoice.terms || "");
      } else {
        // Auto-generate next invoice number
        const existing = adminStore.getInvoices();
        const nextNum = existing.length + 1;
        const autoInvNum = `WN-2026-${String(nextNum).padStart(3, "0")}`;

        const today = new Date().toISOString().slice(0, 10);
        const due = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

        setInvoiceNumber(autoInvNum);
        setIssueDate(today);
        setDueDate(due);
        setPaidDate(today);
        setPaymentStatus("partial");
        setAmountPaidInput("2500");
        setDiscountAmount("0");
        setTaxAmount("0");
        setTransactionId(`UPI/${Date.now().toString().slice(-8)}`);
        setNotes("50% advance received. Balance payable on live launch.");
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

  // Auto-calculated totals
  const subtotal = items.reduce((sum, it) => sum + (it.amount || 0), 0);
  const discountVal = parseFloat(discountAmount) || 0;
  const taxVal = parseFloat(taxAmount) || 0;
  const totalAmount = Math.max(0, subtotal - discountVal + taxVal);

  const amountPaid =
    paymentStatus === "paid"
      ? totalAmount
      : paymentStatus === "pending"
      ? 0
      : Math.min(totalAmount, parseFloat(amountPaidInput) || 0);

  const balanceDue = Math.max(0, totalAmount - amountPaid);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index] } as InvoiceItem;

    if (field === "quantity" || field === "rate") {
      const qty = field === "quantity" ? parseInt(value, 10) || 1 : item.quantity;
      const rate = field === "rate" ? parseFloat(value) || 0 : item.rate;
      item.quantity = qty;
      item.rate = rate;
      item.amount = qty * rate;
    } else {
      (item as any)[field] = value;
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: "itm-" + Date.now().toString(36),
        description: "Domain & High-Speed Cloud Hosting Setup",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAutofillEnquiry = (enqId: string) => {
    const enq = enquiries.find((e) => e.id === enqId);
    if (!enq) return;
    setClientName(enq.name);
    setClientBusiness(enq.business_name || "");
    setClientPhone(enq.phone || "");
    setClientEmail(enq.email || "");
    setItems([
      {
        id: "itm-1",
        description: `${enq.website_type || "Business Website"} Development (${enq.details.slice(0, 70)}...)`,
        quantity: 1,
        rate: 4999,
        amount: 4999,
      },
    ]);
  };

  const handleAutofillProject = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    setClientName(proj.client_name);
    setClientBusiness(proj.business_name);
    setClientPhone(proj.client_phone || "");
    setClientEmail(proj.client_email || "");
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
    if (!clientName.trim()) return;

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
      items,
      subtotal,
      discount_amount: discountVal,
      tax_amount: taxVal,
      total_amount: totalAmount,
      amount_paid: amountPaid,
      balance_due: balanceDue,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      transaction_id: transactionId.trim() || undefined,
      paid_date: paidDate || undefined,
      notes: notes.trim() || undefined,
      terms: terms.trim() || undefined,
    };

    let resultInvoice: AdminInvoice;
    if (initialInvoice) {
      const updated = adminStore.updateInvoice(initialInvoice.id, invoicePayload);
      resultInvoice = updated || { ...initialInvoice, ...invoicePayload, updated_at: new Date().toISOString() };
    } else {
      resultInvoice = adminStore.addInvoice(invoicePayload);
    }

    onSuccess(resultInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#1E4378] bg-[#061833] text-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E4378] bg-[#0A2548] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                {initialInvoice ? "Edit Invoice (ਬਿੱਲ ਬਦਲੋ)" : "Create Deal Invoice (ਨਵਾਂ ਬਿੱਲ ਬਣਾਓ)"}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Generate, track payments &amp; share client invoices via WhatsApp or PDF
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          {/* Quick Prefill Shortcuts */}
          {(enquiries.length > 0 || projects.length > 0) && !initialInvoice && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>Quick Autofill Deal (ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਲੀਡ ਤੋਂ ਡਾਟਾ ਭਰੋ):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {enquiries.length > 0 && (
                  <div>
                    <label className="text-[11px] text-[#94A3B8] block mb-1">From Client Enquiries:</label>
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
                    <label className="text-[11px] text-[#94A3B8] block mb-1">From Active Projects:</label>
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
              1. Client &amp; Business Details (ਗਾਹਕ ਦਾ ਵੇਰਵਾ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Business / Brand Name
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
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

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Billing Address / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mall Road, Amritsar, Punjab"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Invoice Numbers & Dates */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E4378]/60 pb-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              2. Invoice Metadata (ਬਿੱਲ ਨੰਬਰ ਅਤੇ ਮਿਤੀਆਂ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs font-mono font-bold text-blue-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Issue Date
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Payment Due Date
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
            <div className="flex items-center justify-between border-b border-[#1E4378]/60 pb-2">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-400" />
                3. Services &amp; Packages (ਕੰਮ ਅਤੇ ਰੇਟ)
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-2xl border border-[#1E4378] bg-[#0A2548]/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#64748B]">Item #{idx + 1}</span>

                    {/* Preset Picker */}
                    <select
                      onChange={(e) => {
                        const preset = PRESET_SERVICES[parseInt(e.target.value, 10)];
                        if (preset) {
                          handleItemChange(idx, "description", preset.desc);
                          handleItemChange(idx, "rate", preset.rate);
                        }
                      }}
                      defaultValue=""
                      className="rounded-lg border border-[#1E4378] bg-[#061833] px-2 py-1 text-[11px] text-[#94A3B8] focus:outline-none"
                    >
                      <option value="" disabled>Choose preset service...</option>
                      {PRESET_SERVICES.map((p, pIdx) => (
                        <option key={pIdx} value={pIdx}>
                          {p.desc.slice(0, 40)}... (₹{p.rate})
                        </option>
                      ))}
                    </select>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
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
                      <label className="block text-[11px] text-[#94A3B8] mb-1">Total (₹)</label>
                      <input
                        type="text"
                        readOnly
                        value={`₹${item.amount.toLocaleString("en-IN")}`}
                        className="w-full rounded-xl border border-[#1E4378]/50 bg-[#061833]/60 px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">Subtotal</label>
                <input
                  type="text"
                  readOnly
                  value={`₹${subtotal.toLocaleString("en-IN")}`}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/40 px-3 py-2 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/40 px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">Grand Total (₹)</label>
                <input
                  type="text"
                  readOnly
                  value={`₹${totalAmount.toLocaleString("en-IN")}`}
                  className="w-full rounded-xl border border-blue-500/50 bg-blue-500/20 px-3 py-2 text-xs font-mono font-extrabold text-[#38BDF8]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E4378]/60 pb-2">
              <CreditCard className="h-4 w-4 text-blue-400" />
              4. Payment &amp; Transaction Details (ਪੇਮੈਂਟ ਸਥਿਤੀ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Payment Status (ਭੁਗਤਾਨ ਦੀ ਸਥਿਤੀ) *
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as InvoicePaymentStatus)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="partial">Partial Paid (ਅਡਵਾਂਸ ਮਿਲ ਗਿਆ, ਬਾਕੀ ਰਹਿੰਦਾ)</option>
                  <option value="paid">Fully Paid (ਪੂਰਾ ਭੁਗਤਾਨ ਪ੍ਰਾਪਤ ਹੋ ਚੁੱਕਾ ਹੈ)</option>
                  <option value="pending">Payment Pending (ਬਿਲਕੁਲ ਬਾਕੀ ਹੈ)</option>
                  <option value="overdue">Overdue (ਲੇਟ ਹੋ ਗਿਆ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Amount Received / Paid (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  disabled={paymentStatus === "paid" || paymentStatus === "pending"}
                  value={
                    paymentStatus === "paid"
                      ? totalAmount
                      : paymentStatus === "pending"
                      ? 0
                      : amountPaidInput
                  }
                  onChange={(e) => setAmountPaidInput(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-400 focus:border-blue-500 focus:outline-none disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Remaining Balance Due (ਬਾਕੀ ਰਕਮ)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`₹${balanceDue.toLocaleString("en-IN")}`}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-xs font-mono font-bold text-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="upi">UPI (GPay, PhonePe, Paytm)</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="cash">Cash in Hand</option>
                  <option value="card">Card Payment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
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

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E4378]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] px-5 py-2.5 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
            >
              {initialInvoice ? "Save Invoice Changes" : "Generate Invoice & View"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
