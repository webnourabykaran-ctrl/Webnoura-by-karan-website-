import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Printer,
  Trash2,
  Edit,
  ExternalLink,
  CreditCard,
  Building,
  User,
  Phone,
  Calendar,
  Sparkles,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import { AdminInvoice, InvoicePaymentStatus } from "@/types/admin";
import { adminStore, INITIAL_INVOICES } from "@/lib/adminStore";
import { InvoiceModal } from "../invoices/InvoiceModal";
import { InvoiceViewerModal } from "../invoices/InvoiceViewerModal";
import { useAdminLanguage } from "@/lib/adminLanguage";
import { openPrintableInvoiceWindow } from "@/lib/invoiceUtils";

interface InvoicesTabProps {
  invoices: AdminInvoice[];
  onRefresh: () => void;
  onAddNewLead?: () => void;
}

export function InvoicesTab({ invoices, onRefresh, onAddNewLead }: InvoicesTabProps) {
  const { t, language } = useAdminLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<AdminInvoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<AdminInvoice | null>(null);

  // Financial Stats
  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const totalCollected = invoices.reduce((sum, i) => sum + (i.amount_paid || 0), 0);
  const totalBalanceDue = invoices.reduce((sum, i) => sum + (i.balance_due || 0), 0);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const paidCount = invoices.filter((i) => i.payment_status === "paid").length;
  const partialCount = invoices.filter((i) => i.payment_status === "partial").length;
  const pendingCount = invoices.filter((i) => i.payment_status === "pending" || i.payment_status === "overdue").length;

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "all" ||
      inv.payment_status === statusFilter ||
      (statusFilter === "pending" && inv.payment_status === "overdue");

    const q = searchTerm.toLowerCase();
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.client_name.toLowerCase().includes(q) ||
      inv.client_business.toLowerCase().includes(q) ||
      (inv.client_phone && inv.client_phone.includes(q)) ||
      (inv.client_email && inv.client_email.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleDelete = (id: string, invNum: string) => {
    if (window.confirm(`Are you sure you want to delete Invoice ${invNum}?`)) {
      adminStore.deleteInvoice(id);
      onRefresh();
      if (viewingInvoice?.id === id) setViewingInvoice(null);
    }
  };

  const handleMarkAsPaid = (inv: AdminInvoice) => {
    adminStore.updateInvoice(inv.id, {
      payment_status: "paid",
      amount_paid: inv.total_amount,
      balance_due: 0,
      paid_date: new Date().toISOString().slice(0, 10),
    });
    onRefresh();
  };

  const handleDirectWhatsApp = (inv: AdminInvoice) => {
    const statusText =
      inv.payment_status === "paid"
        ? "✅ PAID IN FULL"
        : inv.payment_status === "partial"
        ? `⚠️ PARTIAL ADVANCE (Paid: ₹${inv.amount_paid.toLocaleString("en-IN")}, Balance: ₹${inv.balance_due.toLocaleString("en-IN")})`
        : `⏳ PAYMENT DUE (₹${inv.total_amount.toLocaleString("en-IN")})`;

    const text = encodeURIComponent(
      `🧾 *INVOICE FROM WEBNOURA CREATIVE STUDIO*\n` +
      `────────────────────────────\n` +
      `*Invoice #:* ${inv.invoice_number}\n` +
      `*Client:* ${inv.client_name} (${inv.client_business || "Website Deal"})\n` +
      `*Total Deal Amount:* ₹${inv.total_amount.toLocaleString("en-IN")}\n` +
      `*Amount Received:* ₹${inv.amount_paid.toLocaleString("en-IN")}\n` +
      `*Balance Due:* ₹${inv.balance_due.toLocaleString("en-IN")}\n` +
      `*Status:* ${statusText}\n` +
      `────────────────────────────\n` +
      `WebNoura by Karan · +91 94637 37763\n` +
      `Thank you for working with us!`
    );

    let cleanPhone = (inv.client_phone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#00F0FF] border border-blue-400/40 text-[#061833] font-bold">
              <Receipt className="h-6 w-6 text-[#061833]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-extrabold text-white">
                  {t.invoicesTabTitle}
                </h1>
                <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-400">
                  {t.cloudSync}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                {t.invoicesTabDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const demo = INITIAL_INVOICES[0];
                const list = adminStore.getInvoices();
                if (!list.some((i) => i.invoice_number === demo.invoice_number)) {
                  adminStore.saveInvoices([demo, ...list]);
                }
                onRefresh();
                setViewingInvoice(demo);
              }}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-3 text-xs font-bold text-cyan-300 transition-all hover:scale-[1.02]"
              title="View or load demo hotel invoice"
            >
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span>{language === "pa" ? "ਡੈਮੋ ਬਿੱਲ ਦੇਖੋ (WN-2026-003)" : "View Demo Invoice"}</span>
            </button>

            <button
              onClick={() => {
                setEditingInvoice(null);
                setIsCreateOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span>{t.createInvoiceBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0A2548]/50 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94A3B8] font-medium">{t.totalInvoiced}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-black text-white">
              ₹{totalInvoiced.toLocaleString("en-IN")}
            </h3>
            <span className="text-[11px] font-mono text-[#94A3B8]">{invoices.length} {language === "pa" ? "ਬਿੱਲ" : "deals"}</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            {language === "pa" ? "ਪ੍ਰੋਜੈਕਟਾਂ ਦੇ ਬਿੱਲਾਂ ਦੀ ਕੁੱਲ ਰਕਮ" : "Total revenue generated from deals"}
          </p>
        </div>

        {/* Collected Payments */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-medium">{t.collectedPaid}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-black text-emerald-400">
              ₹{totalCollected.toLocaleString("en-IN")}
            </h3>
            <span className="text-[11px] font-mono text-emerald-300 font-bold">{collectionRate}%</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            {language === "pa" ? "ਬੈਂਕ / UPI ਰਾਹੀਂ ਆਈ ਪੇਮੈਂਟ" : "Cash & UPI received in bank"}
          </p>
        </div>

        {/* Pending Balance Due */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-medium">{t.pendingBalance}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-black text-amber-400">
              ₹{totalBalanceDue.toLocaleString("en-IN")}
            </h3>
            <span className="text-[11px] font-mono text-amber-300 font-bold">{pendingCount + partialCount} {language === "pa" ? "ਬਾਕੀ" : "due"}</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            {language === "pa" ? "ਵੈੱਬਸਾਈਟ ਪੂਰੀ ਹੋਣ 'ਤੇ ਲੈਣ ਵਾਲੀ ਰਕਮ" : "Receivable upon project completion"}
          </p>
        </div>

        {/* Paid Invoices Count */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-300 font-medium">{t.paidStatus}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="font-display text-2xl font-black text-cyan-400">
              {paidCount} / {invoices.length}
            </h3>
            <span className="text-[11px] font-mono text-cyan-300">{language === "pa" ? "ਪੂਰੇ ਹੋਏ" : "closed"}</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            {language === "pa" ? "ਕਲੀਅਰ ਹੋਏ ਕਲਾਇੰਟ ਬਿੱਲ" : "Invoices cleared & delivered"}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: `${t.allDeals} (${invoices.length})` },
            { id: "paid", label: `${t.paidFilter} (${paidCount})` },
            { id: "partial", label: `${t.partialFilter} (${partialCount})` },
            { id: "pending", label: `${t.pendingFilter} (${pendingCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "border border-[#1E4378] bg-[#0A2548]/40 text-[#94A3B8] hover:text-white hover:bg-[#0A2548]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            placeholder={t.searchInvoicePlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#1E4378] bg-[#0A2548]/60 pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices List / Grid */}
      {filteredInvoices.length === 0 ? (
        <div className="rounded-3xl border border-[#1E4378] bg-[#0A2548]/30 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="font-display text-base font-bold text-white">{t.noInvoicesFound}</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto mt-1">
            {t.noInvoicesDesc}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setIsCreateOpen(true);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>{t.createInvoiceBtn}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInvoices.map((inv) => {
            const pct = inv.total_amount > 0 ? Math.round((inv.amount_paid / inv.total_amount) * 100) : 0;

            return (
              <div
                key={inv.id}
                className="rounded-3xl border border-[#1E4378] bg-gradient-to-br from-[#0A2548]/80 to-[#061833] p-5 shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between gap-5 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#1E4378]/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-blue-400">
                          {inv.invoice_number}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                            inv.payment_status === "paid"
                              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                              : inv.payment_status === "partial"
                              ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                              : "bg-blue-500/20 border border-blue-500/40 text-blue-400"
                          }`}
                        >
                          {inv.payment_status === "paid"
                            ? "✓ PAID"
                            : inv.payment_status === "partial"
                            ? `PARTIAL (${pct}%)`
                            : "PENDING"}
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {inv.client_name}
                      </h4>
                      {inv.client_business && (
                        <p className="text-xs font-semibold text-[#60A5FA]">
                          {inv.client_business}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#94A3B8]">Total Deal:</span>
                      <p className="font-display text-lg font-black text-white">
                        ₹{inv.total_amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="my-3 space-y-1">
                    {inv.items.map((it, idx) => (
                      <p key={idx} className="text-xs text-[#94A3B8] truncate flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span className="truncate">{it.description}</span>
                        <span className="font-mono text-white text-[11px] ml-auto shrink-0">
                          ₹{it.amount.toLocaleString("en-IN")}
                        </span>
                      </p>
                    ))}
                  </div>

                  {/* Payment Progress Bar */}
                  <div className="my-3 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-emerald-400">
                        Paid: <strong>₹{inv.amount_paid.toLocaleString("en-IN")}</strong>
                      </span>
                      <span className={inv.balance_due > 0 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                        Balance: <strong>₹{inv.balance_due.toLocaleString("en-IN")}</strong>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#061833] border border-[#1E4378] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          inv.payment_status === "paid"
                            ? "bg-emerald-500"
                            : inv.payment_status === "partial"
                            ? "bg-gradient-to-r from-emerald-500 to-amber-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates & Method info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#94A3B8] pt-2 border-t border-[#1E4378]/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#64748B]" />
                      <span>Issued: {inv.issue_date}</span>
                    </span>
                    {inv.payment_method && (
                      <span className="font-mono text-[10px] uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10 text-white">
                        {inv.payment_method} {inv.transaction_id ? `· ${inv.transaction_id.slice(-6)}` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1E4378]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                      title={t.viewPrint}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{t.viewPrint}</span>
                    </button>

                    <button
                      onClick={() => handleDirectWhatsApp(inv)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 px-3 py-1.5 text-xs font-semibold text-[#25D366] transition-all"
                      title={t.sendWhatsApp}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{t.sendWhatsApp}</span>
                    </button>

                    <button
                      onClick={() => openPrintableInvoiceWindow(inv)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#0B2D5B] px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
                      title="Instant Print / PDF"
                    >
                      <Printer className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Print</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {inv.payment_status !== "paid" && (
                      <button
                        onClick={() => handleMarkAsPaid(inv)}
                        className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 transition-colors"
                        title={t.markPaid}
                      >
                        {t.markPaid}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingInvoice(inv);
                        setIsCreateOpen(true);
                      }}
                      className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Invoice"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(inv.id, inv.invoice_number)}
                      className="p-1.5 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Invoice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Create/Edit Modal */}
      <InvoiceModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingInvoice(null);
        }}
        initialInvoice={editingInvoice}
        onSuccess={(created) => {
          onRefresh();
          if (created) {
            setViewingInvoice(created);
          }
        }}
      />

      {/* Invoice Viewer Modal (Printable & WhatsApp) */}
      <InvoiceViewerModal
        isOpen={!!viewingInvoice}
        invoice={viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        onRefresh={onRefresh}
        onEdit={(inv) => {
          setViewingInvoice(null);
          setEditingInvoice(inv);
          setIsCreateOpen(true);
        }}
      />
    </div>
  );
}
