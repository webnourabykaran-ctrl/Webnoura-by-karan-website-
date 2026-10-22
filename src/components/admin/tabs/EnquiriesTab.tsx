import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Star, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Building, 
  Trash2, 
  Send, 
  ArrowUpRight, 
  X, 
  Check, 
  Save, 
  ExternalLink,
  Clock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { AdminEnquiry, EnquiryStatus } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";
import { formRateLimiter, useLockedClients } from "@/lib/formRateLimit";

interface EnquiriesTabProps {
  enquiries: AdminEnquiry[];
  selectedEnquiry: AdminEnquiry | null;
  onSelectEnquiry: (enquiry: AdminEnquiry | null) => void;
  onAddNewLead: () => void;
  onRefresh: () => void;
}

export function EnquiriesTab({
  enquiries,
  selectedEnquiry,
  onSelectEnquiry,
  onAddNewLead,
  onRefresh,
}: EnquiriesTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeNoteText, setActiveNoteText] = useState("");
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);

  // Rate limit spam timer controller state
  const lockedClients = useLockedClients();
  const [manualUnlockEmail, setManualUnlockEmail] = useState("");
  const [timerFeedback, setTimerFeedback] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const handleUnlockSingle = (idOrEmail: string, name?: string) => {
    formRateLimiter.unlockClient(idOrEmail);
    setTimerFeedback(`✓ Timer turned off! Form unlocked for ${name || idOrEmail}.`);
    setTimeout(() => setTimerFeedback(""), 4000);
  };

  const handleUnlockAll = () => {
    formRateLimiter.unlockAll();
    setTimerFeedback("✓ All client form cooldown timers have been turned off!");
    setTimeout(() => setTimerFeedback(""), 4000);
  };

  const handleManualUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUnlockEmail.trim()) return;
    const clean = manualUnlockEmail.trim().toLowerCase();
    formRateLimiter.unlockClient(clean);
    setTimerFeedback(`✓ Timer turned off for ${clean}! They can now submit enquiries freely.`);
    setManualUnlockEmail("");
    setShowManualInput(false);
    setTimeout(() => setTimerFeedback(""), 4000);
  };

  const handleTestLock = () => {
    formRateLimiter.testLockClient("demo.client@webnoura.com", "Demo Client (Test)", "+91 94637 37763");
    setTimerFeedback("🧪 Demo client test-locked with a 1-hour timer! You can now test turning it off.");
    setTimeout(() => setTimerFeedback(""), 4000);
  };

  // Filtered enquiries
  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      // Search text
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.business_name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        item.details.toLowerCase().includes(q);

      // Status
      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      // Type
      const matchType = typeFilter === "all" || item.website_type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [enquiries, search, statusFilter, typeFilter]);

  const websiteTypes = useMemo(() => {
    const set = new Set<string>();
    enquiries.forEach((e) => {
      if (e.website_type) set.add(e.website_type);
    });
    return Array.from(set);
  }, [enquiries]);

  const handleStatusChange = (id: string, status: EnquiryStatus) => {
    adminStore.updateEnquiryStatus(id, status);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      onSelectEnquiry({ ...selectedEnquiry, status });
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    adminStore.toggleStarEnquiry(id);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      onSelectEnquiry({ ...selectedEnquiry, starred: !selectedEnquiry.starred });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      adminStore.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        onSelectEnquiry(null);
      }
    }
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    adminStore.updateEnquiry(selectedEnquiry.id, { notes: activeNoteText });
    onSelectEnquiry({ ...selectedEnquiry, notes: activeNoteText });
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "new":
        return <span className="inline-flex items-center rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-400">New Lead</span>;
      case "contacted":
        return <span className="inline-flex items-center rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-indigo-400">Contacted</span>;
      case "in_discussion":
        return <span className="inline-flex items-center rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">In Discussion</span>;
      case "proposal_sent":
        return <span className="inline-flex items-center rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-purple-400">Proposal Sent</span>;
      case "in_progress":
        return <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">In Progress</span>;
      case "completed":
        return <span className="inline-flex items-center rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-300">Completed</span>;
      case "declined":
        return <span className="inline-flex items-center rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-400">Declined</span>;
    }
  };

  const statusOptions: { label: string; value: EnquiryStatus }[] = [
    { label: "New Lead", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "In Discussion", value: "in_discussion" },
    { label: "Proposal Sent", value: "proposal_sent" },
    { label: "In Progress (Building)", value: "in_progress" },
    { label: "Completed & Live", value: "completed" },
    { label: "Declined / Cancelled", value: "declined" },
  ];

  return (
    <div className="space-y-6">
      {/* Client Spam Timer & Cooldown Controller */}
      <div className={`rounded-3xl border p-5 shadow-xl transition-all ${
        lockedClients.length > 0 
          ? "border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-[#0B2D5B] to-[#0A2548]" 
          : "border-[#1E4378] bg-[#0B2D5B]/70 backdrop-blur-md"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
              lockedClients.length > 0
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            }`}>
              {lockedClients.length > 0 ? (
                <Clock className="h-5 w-5 text-amber-400 animate-spin" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-white">
                  Form Spam Protection & Client Cooldown Timers
                </h3>
                {lockedClients.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                    {lockedClients.length} Client{lockedClients.length > 1 ? "s" : ""} Timer Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                    <Check className="h-3 w-3" /> All Forms Clear
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                When a client submits the website form repeatedly (3+ times in an hour), a 1-hour spam lockout activates. You can turn off any client's timer instantly below.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {lockedClients.length > 0 && (
              <button
                type="button"
                onClick={handleUnlockAll}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                <Unlock className="h-3.5 w-3.5" /> Turn Off All Timers
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:border-[#3B82F6] text-[#CBD5E1] hover:text-white px-3 py-2 text-xs font-semibold transition-all"
            >
              <Unlock className="h-3.5 w-3.5 text-[#93C5FD]" />
              <span>{showManualInput ? "Close Email Unlock" : "Unlock by Email"}</span>
            </button>

            <button
              type="button"
              onClick={handleTestLock}
              title="Simulate locking a test client to verify unlock functionality"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-2 text-xs font-bold transition-all"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>+ Test-Lock Client</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {timerFeedback && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs font-mono font-bold text-emerald-300 animate-fade-in flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              {timerFeedback}
            </span>
            <button onClick={() => setTimerFeedback("")} className="text-[#94A3B8] hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Manual Unlock Form */}
        {showManualInput && (
          <form onSubmit={handleManualUnlockSubmit} className="mt-4 pt-4 border-t border-[#1E4378] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="email"
              placeholder="Enter client's email address (e.g. client@gmail.com)"
              value={manualUnlockEmail}
              onChange={(e) => setManualUnlockEmail(e.target.value)}
              className="flex-1 rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 text-xs font-bold transition-all whitespace-nowrap shadow-md shadow-[#3B82F6]/30"
            >
              Turn Off Timer for this Email
            </button>
          </form>
        )}

        {/* Active Locked Clients Cards */}
        {lockedClients.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-500/30 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lockedClients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl border border-amber-500/40 bg-[#061833]/90 p-3.5 shadow-lg flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white truncate" title={client.email}>
                      {client.name ? `${client.name} · ` : ""}{client.email}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 shrink-0">
                      <Clock className="h-2.5 w-2.5 animate-spin" /> {client.formattedTime}
                    </span>
                  </div>

                  {client.phone && (
                    <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                      Phone: {client.phone}
                    </p>
                  )}

                  <p className="text-[11px] text-[#64748B] mt-1">
                    {client.attemptsCount} repeated submissions · Form locked for 1 hour
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnlockSingle(client.id, client.name || client.email)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 text-xs font-bold transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.02]"
                >
                  <Unlock className="h-3.5 w-3.5" /> Turn Off Timer (Unlock Client)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Easy 3-Step Guidance Banner (ਸੌਖੀ ਗਾਈਡ) */}
      <div className="rounded-2xl border border-[#3B82F6]/30 bg-gradient-to-r from-[#0B2D5B] to-[#0A2548] p-4 text-xs text-[#CBD5E1] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="text-base">💡</span>
            <span>ਸੌਖੀ ਗਾਈਡ (How to Use Leads & WhatsApp):</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6] text-white font-bold text-[10px]">1</span>
              <span>ਨਾਮ 'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਪੂਰੀ ਡਿਟੇਲ ਪੜ੍ਹੋ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">2</span>
              <span>ਹਰੇ WhatsApp ਬਟਨ ਨਾਲ ਸਿੱਧੀ ਚੈਟ ਕਰੋ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-[10px]">3</span>
              <span>ਜੇ ਕਲਾਇੰਟ ਲਾਕ ਹੋਵੇ ਤਾਂ ਉੱਪਰੋਂ 'Turn Off Timer' ਦਬਾਓ</span>
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Filters, Add Button */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by client name, business, email, phone, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833]/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => adminStore.exportEnquiriesToCSV()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#061833]/80 text-[#CBD5E1] hover:text-white px-3.5 py-2.5 text-xs font-semibold transition-all"
            >
              <Download className="h-3.5 w-3.5 text-[#93C5FD]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onAddNewLead}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/30"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E4378]/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Leads" },
              { id: "new", label: "New" },
              { id: "in_discussion", label: "In Discussion" },
              { id: "proposal_sent", label: "Quoted" },
              { id: "in_progress", label: "In Progress" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  statusFilter === tab.id
                    ? "bg-[#3B82F6] text-white font-bold"
                    : "text-[#CBD5E1] hover:bg-[#061833] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Website Type Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8]">Website Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-[#1E4378] bg-[#061833] px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Types</option>
              {websiteTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Card List */}
      <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 backdrop-blur-md shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Search className="mx-auto h-12 w-12 text-[#64748B]" />
            <h3 className="mt-4 font-display text-lg font-bold text-white">No inquiries found</h3>
            <p className="mt-1 text-xs text-[#94A3B8]">
              {search || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filters."
                : "No inquiries currently recorded in your database."}
            </p>
            <button
              onClick={onAddNewLead}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" /> Create First Lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#F8F9FA]">
              <thead className="border-b border-[#1E4378] bg-[#061833]/80 font-mono text-xs uppercase tracking-wider text-[#93C5FD]">
                <tr>
                  <th className="py-4 pl-6 pr-2 w-10"></th>
                  <th className="py-4 px-4">Client & Business</th>
                  <th className="py-4 px-4">Website Type</th>
                  <th className="py-4 px-4">Budget & Pages</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Received Date</th>
                  <th className="py-4 pr-6 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E4378]/60">
                {filtered.map((enq) => {
                  const dateStr = new Date(enq.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => {
                        onSelectEnquiry(enq);
                        setActiveNoteText(enq.notes || "");
                      }}
                      className="group hover:bg-[#061833]/50 transition-colors cursor-pointer"
                    >
                      {/* Star Button */}
                      <td className="py-4 pl-6 pr-2">
                        <button
                          onClick={(e) => handleToggleStar(enq.id, e)}
                          title={enq.starred ? "Unstar" : "Star lead"}
                          className={`text-slate-500 hover:text-amber-400 transition-colors ${
                            enq.starred ? "text-amber-400" : ""
                          }`}
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      </td>

                      {/* Client Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E4378] text-white font-bold text-xs group-hover:bg-[#3B82F6] transition-colors">
                            {enq.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white group-hover:text-[#93C5FD] transition-colors">
                                {enq.name}
                              </p>
                              {formRateLimiter.isClientLocked(enq.email, enq.phone).isLocked && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlockSingle(enq.email, enq.name);
                                  }}
                                  title="Click to turn off spam timer for this client"
                                  className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 hover:bg-emerald-500/25 border border-amber-500/40 hover:border-emerald-500/50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 hover:text-emerald-300 transition-all"
                                >
                                  <Clock className="h-2.5 w-2.5 animate-spin text-amber-400" />
                                  <span>Timer Active ({formRateLimiter.isClientLocked(enq.email, enq.phone).formattedTime}) · Turn Off 🔓</span>
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-[#94A3B8] font-medium flex items-center gap-1">
                              <Building className="h-3 w-3 text-[#64748B]" />
                              {enq.business_name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Website Type */}
                      <td className="py-4 px-4">
                        <span className="rounded-lg bg-[#061833] border border-[#1E4378] px-2.5 py-1 text-xs text-[#CBD5E1]">
                          {enq.website_type}
                        </span>
                      </td>

                      {/* Budget & Pages */}
                      <td className="py-4 px-4">
                        <p className="font-mono text-xs font-bold text-white">{enq.budget || "Unspecified"}</p>
                        <p className="font-mono text-[11px] text-[#64748B]">{enq.pages || "Pages not stated"}</p>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                          className="rounded-lg border border-[#1E4378] bg-[#061833] px-2.5 py-1 font-mono text-xs text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs text-[#94A3B8]">{dateStr}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Direct WhatsApp button */}
                          {enq.phone && (
                            <a
                              href={`https://wa.me/${enq.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(enq.name)},%20this%20is%20Karan%20from%20WebNoura.%20Thank%20you%20for%20your%20website%20inquiry%20regarding%20${encodeURIComponent(enq.business_name)}!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {/* Email button */}
                          <a
                            href={`mailto:${enq.email}?subject=WebNoura%20Website%20Enquiry%20-%20${encodeURIComponent(enq.business_name)}`}
                            title="Send Email"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E4378] bg-[#061833] text-[#CBD5E1] hover:border-[#3B82F6] hover:text-white transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(enq.id)}
                            title="Delete Lead"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E4378] bg-[#061833] text-[#64748B] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Lead Modal / Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#1E4378] bg-[#0B2D5B] p-6 md:p-8 text-white shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => onSelectEnquiry(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-white hover:border-[#3B82F6] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6] text-white font-extrabold text-xl shadow-lg shadow-[#3B82F6]/30">
                {selectedEnquiry.name.charAt(0).toUpperCase()}
              </div>
              <div className="pr-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-2xl font-extrabold text-white">
                    {selectedEnquiry.name}
                  </h2>
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
                <p className="text-sm text-[#93C5FD] font-semibold mt-1">
                  {selectedEnquiry.business_name}
                </p>
                <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Active Lockout Alert Bar */}
            {formRateLimiter.isClientLocked(selectedEnquiry.email, selectedEnquiry.phone).isLocked && (
              <div className="mt-5 rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-[#061833] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock className="h-5 w-5 animate-spin" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-amber-300 block">
                      Client Form Cooldown Timer Active ({formRateLimiter.isClientLocked(selectedEnquiry.email, selectedEnquiry.phone).formattedTime} remaining)
                    </span>
                    <p className="text-xs text-amber-200/80 mt-0.5">
                      This client submitted repeated enquiries and their form is temporarily paused on the website.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnlockSingle(selectedEnquiry.email, selectedEnquiry.name)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-600/30 shrink-0 hover:scale-105"
                >
                  <Unlock className="h-4 w-4" /> Turn Off Client Timer
                </button>
              </div>
            )}

            {/* Contact Action Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[#1E4378] py-4">
              {selectedEnquiry.phone && (
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(selectedEnquiry.name)},%20this%20is%20Karan%20from%20WebNoura.%20Thank%20you%20for%20your%20website%20inquiry%20regarding%20${encodeURIComponent(selectedEnquiry.business_name)}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
                >
                  <Send className="h-4 w-4" /> WhatsApp Client ({selectedEnquiry.phone})
                </a>
              )}

              <a
                href={`mailto:${selectedEnquiry.email}?subject=WebNoura%20Website%20Proposal%20-%20${encodeURIComponent(selectedEnquiry.business_name)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:border-[#3B82F6] text-white px-4 py-2 text-xs font-bold transition-all"
              >
                <Mail className="h-4 w-4 text-[#3B82F6]" /> Send Email ({selectedEnquiry.email})
              </a>

              {selectedEnquiry.phone && (
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:border-[#3B82F6] text-white px-4 py-2 text-xs font-bold transition-all"
                >
                  <Phone className="h-4 w-4 text-[#3B82F6]" /> Call Directly
                </a>
              )}
            </div>

            {/* Project Specifications Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[#1E4378] bg-[#061833]/70 p-3.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] block">Website Type</span>
                <span className="font-bold text-sm text-white mt-1 block">{selectedEnquiry.website_type}</span>
              </div>
              <div className="rounded-xl border border-[#1E4378] bg-[#061833]/70 p-3.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] block">Budget Range</span>
                <span className="font-bold text-sm text-[#93C5FD] mt-1 block">{selectedEnquiry.budget || "Not specified"}</span>
              </div>
              <div className="rounded-xl border border-[#1E4378] bg-[#061833]/70 p-3.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] block">Estimated Pages</span>
                <span className="font-bold text-sm text-white mt-1 block">{selectedEnquiry.pages || "Single / Flexible"}</span>
              </div>
            </div>

            {/* Client Project Details */}
            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-2">
                Client Project Message
              </span>
              <div className="rounded-2xl border border-[#1E4378] bg-[#061833]/90 p-4 text-sm leading-relaxed text-[#CBD5E1] whitespace-pre-wrap">
                {selectedEnquiry.details}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1]">
                  Private Admin Notes (Internal Only)
                </span>
                {savedNoteSuccess && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400">
                    <Check className="h-3.5 w-3.5" /> Saved!
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
                placeholder="Add private notes on quotations discussed, meeting times, or next steps..."
                className="w-full rounded-2xl border border-[#1E4378] bg-[#061833]/90 p-4 text-sm text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#2563EB] transition-colors"
                >
                  <Save className="h-3.5 w-3.5" /> Save Note
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-[#1E4378] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#94A3B8]">Move Pipeline Stage:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                  className="rounded-lg border border-[#1E4378] bg-[#061833] px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
