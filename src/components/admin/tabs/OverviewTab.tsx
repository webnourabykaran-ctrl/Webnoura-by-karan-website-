import { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight, 
  MessageSquare, 
  Plus, 
  Download, 
  Clock, 
  Send,
  Building,
  Sparkles,
  PhoneCall,
  Eye,
  MousePointerClick,
  Activity,
  Inbox,
  Kanban,
  Settings,
  ShieldCheck,
  Globe,
  Tag
} from "lucide-react";
import { AdminTab } from "../AdminSidebar";
import { adminStore } from "@/lib/adminStore";
import { AdminEnquiry, AnalyticsData } from "@/types/admin";
import { calculateWeeklyVisits, calculateMonthlyVisits } from "@/lib/analytics";
import { useLockedClients } from "@/lib/formRateLimit";

interface OverviewTabProps {
  enquiries: AdminEnquiry[];
  analytics?: AnalyticsData;
  setActiveTab: (tab: AdminTab) => void;
  onOpenEnquiry: (enquiry: AdminEnquiry) => void;
  onAddNewLead: () => void;
}

export function OverviewTab({
  enquiries,
  analytics,
  setActiveTab,
  onOpenEnquiry,
  onAddNewLead,
}: OverviewTabProps) {
  // Settings & locked clients
  const settings = adminStore.getSettings();
  const lockedClients = useLockedClients();

  // Visitor totals
  const totalVisits = analytics?.totalVisits || 0;
  const todayVisits = analytics?.todayVisits || 0;
  const weeklyVisits = analytics?.weeklyVisits ?? calculateWeeklyVisits(analytics?.dailyVisits);
  const monthlyVisits = analytics?.monthlyVisits ?? calculateMonthlyVisits(analytics?.dailyVisits);
  const totalClicks = Object.values(analytics?.clickCounts || {}).reduce((a, b) => a + b, 0);
  const topClicked = Object.entries(analytics?.clickCounts || {}).sort((a, b) => b[1] - a[1])[0];

  // Compute analytics
  const totalLeads = enquiries.length;
  const newLeads = enquiries.filter((e) => e.status === "new").length;
  const inPipeline = enquiries.filter((e) => ["in_discussion", "proposal_sent", "in_progress"].includes(e.status)).length;
  const completed = enquiries.filter((e) => e.status === "completed").length;
  const conversionRate = totalLeads > 0 ? Math.round((completed / totalLeads) * 100) : 0;

  // Approximate pipeline value calculation based on budget text
  const totalPipelineValue = enquiries.reduce((acc, curr) => {
    if (curr.status === "declined") return acc;
    const match = curr.budget?.match(/\d+/g);
    if (match && match.length > 0) {
      // If contains 'k', multiply
      const val = parseInt(match[0], 10);
      const isThousands = curr.budget?.toLowerCase().includes("k") || val < 1000;
      return acc + (isThousands ? val * 1000 : val);
    }
    return acc + 25000; // Average default project value
  }, 0);

  // Group by website types
  const typeCounts: Record<string, number> = {};
  enquiries.forEach((e) => {
    const type = e.website_type || "Other";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const websiteTypeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  // Recent enquiries (latest 5)
  const recentEnquiries = enquiries.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-blue-400">New</span>;
      case "in_discussion":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-400">In Discussion</span>;
      case "proposal_sent":
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-purple-400">Quoted</span>;
      case "in_progress":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400">In Progress</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-cyan-300">Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 border border-slate-500/30 px-2.5 py-0.5 text-[11px] font-mono text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & 4-Card Quick Hub (ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਕੰਮ) */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-br from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E4378]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👋</span>
              <h2 className="font-display text-xl md:text-2xl font-extrabold text-white">
                ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਰਨ ਜੀ! <span className="text-[#93C5FD] font-semibold text-base md:text-lg">(WebNoura Studio Control)</span>
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#94A3B8] mt-1.5 max-w-2xl">
              ਇੱਥੋਂ ਤੁਸੀਂ ਆਪਣੀ ਵੈੱਬਸਾਈਟ ਬਹੁਤ ਸੌਖੀ ਤਰ੍ਹਾਂ ਸੰਭਾਲ ਸਕਦੇ ਹੋ — ਨਵੇਂ ਗਾਹਕਾਂ ਨਾਲ WhatsApp 'ਤੇ ਗੱਲ ਕਰੋ, ਵਿਜ਼ਿਟਰ ਰਿਪੋਰਟ ਦੇਖੋ ਅਤੇ ਸੈਟਿੰਗਸ ਬਦਲੋ।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              ਸਿਸਟਮ ਚਾਲੂ (Active)
            </span>
          </div>
        </div>

        {/* 4 Big Direct Shortcut Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Client Enquiries */}
          <div
            onClick={() => setActiveTab("enquiries")}
            className="group cursor-pointer rounded-2xl border border-[#1E4378] bg-[#061833]/80 hover:bg-[#0B2D5B] hover:border-[#3B82F6] p-5 transition-all duration-200 hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 group-hover:scale-110 transition-transform">
                <Inbox className="h-5 w-5" />
              </div>
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
                newLeads > 0 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse" 
                  : "bg-slate-500/20 text-slate-300"
              }`}>
                {newLeads > 0 ? `${newLeads} ਨਵੇਂ ਮੈਸੇਜ` : `${totalLeads} ਕੁੱਲ ਲੀਡਸ`}
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-white mt-4 group-hover:text-[#93C5FD] transition-colors">
              1. ਗਾਹਕਾਂ ਦੇ ਮੈਸੇਜ
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
              ਨਵੇਂ ਫ਼ਾਰਮ ਵੇਖੋ, ਸਿੱਧਾ WhatsApp ਚੈਟ ਕਰੋ, ਜਾਂ ਕਲਾਇੰਟ ਟਾਈਮਰ ਬੰਦ ਕਰੋ।
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#3B82F6] group-hover:text-white transition-colors">
              <span>ਮੈਸੇਜ ਖੋਲ੍ਹੋ (Leads)</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Website Visitors */}
          <div
            onClick={() => setActiveTab("analytics")}
            className="group cursor-pointer rounded-2xl border border-[#1E4378] bg-[#061833]/80 hover:bg-[#0B2D5B] hover:border-emerald-500 p-5 transition-all duration-200 hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {todayVisits} ਅੱਜ ਆਏ
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-white mt-4 group-hover:text-emerald-300 transition-colors">
              2. ਵੈੱਬਸਾਈਟ ਵਿਜ਼ਿਟਰਸ
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
              ਵੇਖੋ ਕਿੰਨੇ ਲੋਕ ਆਏ, ਕਿਹੜੇ ਸ਼ਹਿਰੋਂ ਦੇਖਿਆ ਅਤੇ ਕਿਹੜੇ ਬਟਨ ਦਬਾਏ।
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:text-white transition-colors">
              <span>ਵਿਜ਼ਿਟਰ ਵੇਖੋ (Traffic)</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Active Projects */}
          <div
            onClick={() => setActiveTab("project_tracker")}
            className="group cursor-pointer rounded-2xl border border-[#1E4378] bg-[#061833]/80 hover:bg-[#0B2D5B] hover:border-amber-500 p-5 transition-all duration-200 hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 group-hover:scale-110 transition-transform">
                <Kanban className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {inPipeline} ਆਰਡਰ ਚਾਲੂ
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-white mt-4 group-hover:text-amber-300 transition-colors">
              3. ਚੱਲ ਰਹੇ ਪ੍ਰੋਜੈਕਟ
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
              ਜਿਹੜੀਆਂ ਵੈੱਬਸਾਈਟਾਂ ਬਣ ਰਹੀਆਂ ਹਨ, ਉਹਨਾਂ ਦਾ ਸਟੇਟਸ ਤੇ ਡੈੱਡਲਾਈਨ ਟਰੈਕ ਕਰੋ।
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-white transition-colors">
              <span>ਕੰਮ ਟਰੈਕ ਕਰੋ (Projects)</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Website Settings */}
          <div
            onClick={() => setActiveTab("settings")}
            className="group cursor-pointer rounded-2xl border border-[#1E4378] bg-[#061833]/80 hover:bg-[#0B2D5B] hover:border-purple-500 p-5 transition-all duration-200 hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5" />
              </div>
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                settings.websiteOnline 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                  : "bg-rose-500/20 text-rose-300 border-rose-500/40"
              }`}>
                {settings.websiteOnline ? "ਵੈੱਬਸਾਈਟ LIVE" : "ਵੈੱਬਸਾਈਟ ਬੰਦ"}
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-white mt-4 group-hover:text-purple-300 transition-colors">
              4. ਸੈਟਿੰਗਸ & ਕੰਟਰੋਲ
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
              ਵੈੱਬਸਾਈਟ ਆਨ/ਆਫ਼ ਕਰੋ, ਨਵਾਂ ਆਫ਼ਰ ਲਗਾਓ ਜਾਂ ਐਡਮਿਨ ਪਾਸਵਰਡ ਬਦਲੋ।
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:text-white transition-colors">
              <span>ਸੈਟਿੰਗਸ ਖੋਲ੍ਹੋ (Settings)</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Visitors & Click Intelligence Banner */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#93C5FD]">
              <Activity className="h-5 w-5 text-[#3B82F6] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm text-white">Live Website Traffic & Clicks (ਲਾਈਵ ਵਿਜ਼ਿਟਰ ਰਿਕਾਰਡ)</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Active
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {todayVisits} ਅੱਜ (Today) · {weeklyVisits} ਇਸ ਹਫ਼ਤੇ (Week) · {monthlyVisits} ਇਸ ਮਹੀਨੇ (Month) · {totalVisits} ਕੁੱਲ ਵਿਜ਼ਿਟ (All-Time) · {totalClicks} ਬਟਨ ਕਲਿੱਕ (Clicks)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {topClicked && (
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833]/70 px-3 py-1.5 text-xs">
                <MousePointerClick className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[#94A3B8]">ਸਭ ਤੋਂ ਵੱਧ ਕਲਿੱਕ:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{topClicked[0]}</span>
                <span className="font-mono text-amber-400 font-bold">({topClicked[1]})</span>
              </div>
            )}

            <button
              onClick={() => setActiveTab("analytics")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/20"
            >
              See What Visitors Clicked <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Inquiries */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Total Inquiries (ਕੁੱਲ ਆਏ ਗਾਹਕ)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{totalLeads}</span>
            {newLeads > 0 && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400">
                +{newLeads} new
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Client website requests received</p>
        </div>

        {/* Active Deals in Pipeline */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Active Deals (ਚੱਲ ਰਹੇ ਆਰਡਰ)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{inPipeline}</span>
            <span className="text-xs text-amber-300 font-medium">in discussion / build</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Active proposals & live builds</p>
        </div>

        {/* Estimated Pipeline Value */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Pipeline Value (ਅੰਦਾਜ਼ਨ ਕਮਾਈ)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">
              ₹{totalPipelineValue.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Estimated potential deal volume</p>
        </div>

        {/* Delivered / Completed */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Launched (ਕੰਪਲੀਟ ਵੈੱਬਸਾਈਟਾਂ)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{completed}</span>
            <span className="text-xs text-cyan-300 font-medium">{conversionRate}% win rate</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Completed & live client websites</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-2xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] to-[#0A2548] p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#93C5FD]">
              <Sparkles className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Quick Action Center</h2>
              <p className="text-xs text-[#94A3B8]">Frequently used studio management shortcuts</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onAddNewLead}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/20"
            >
              <Plus className="h-4 w-4" /> Add Lead
            </button>

            {lockedClients.length > 0 && (
              <button
                onClick={() => setActiveTab("enquiries")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3.5 py-2 text-xs font-bold transition-all shadow-md shadow-amber-500/20 animate-pulse"
              >
                <Clock className="h-4 w-4 text-amber-400" />
                <span>{lockedClients.length} Client Timer Active · Turn Off ➔</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("project_tracker")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#061833]/70 text-[#CBD5E1] hover:text-white px-3.5 py-2 text-xs font-semibold transition-all"
            >
              <span>Active Projects Tracker ➔</span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#061833]/70 text-[#CBD5E1] hover:text-white px-3.5 py-2 text-xs font-semibold transition-all"
            >
              <span>Promo Codes ➔</span>
            </button>

            <button
              onClick={() => adminStore.exportEnquiriesToCSV()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#061833]/70 text-[#CBD5E1] hover:text-white px-3.5 py-2 text-xs font-semibold transition-all"
            >
              <Download className="h-4 w-4 text-[#93C5FD]" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Enquiries & Category Breakdown */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Inquiries List (8 cols) */}
        <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 md:p-8 backdrop-blur-md lg:col-span-8 shadow-xl">
          <div className="flex items-center justify-between pb-5 border-b border-[#1E4378]">
            <div>
              <h2 className="font-display text-lg font-extrabold text-white">Recent Client Enquiries</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Incoming leads from the website and referrals</p>
            </div>
            <button
              onClick={() => setActiveTab("enquiries")}
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#93C5FD] hover:text-white transition-colors"
            >
              View All ({totalLeads}) <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 divide-y divide-[#1E4378]/60">
            {recentEnquiries.length === 0 ? (
              <div className="py-12 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-[#64748B]" />
                <p className="mt-3 text-sm font-semibold text-[#CBD5E1]">No inquiries yet</p>
                <p className="text-xs text-[#94A3B8] mt-1">When someone submits your website form, it will show up here.</p>
              </div>
            ) : (
              recentEnquiries.map((enq) => {
                const dateStr = new Date(enq.created_at).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={enq.id}
                    onClick={() => onOpenEnquiry(enq)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-2 hover:bg-[#061833]/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E4378] text-white font-bold text-sm group-hover:bg-[#3B82F6] transition-colors">
                        {enq.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white group-hover:text-[#93C5FD] transition-colors">
                            {enq.name}
                          </h3>
                          {getStatusBadge(enq.status)}
                        </div>
                        <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
                          {enq.business_name} · <span className="text-[#CBD5E1]">{enq.website_type}</span>
                        </p>
                        <p className="text-xs text-[#64748B] line-clamp-1 mt-1 max-w-md">
                          "{enq.details}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-mono text-xs font-bold text-white">{enq.budget || "Quote on request"}</p>
                        <span className="font-mono text-[10px] text-[#64748B] flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {dateStr}
                        </span>
                      </div>

                      {/* WhatsApp shortcut */}
                      {enq.phone && (
                        <a
                          href={`https://wa.me/${enq.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(enq.name)},%20this%20is%20Karan%20from%20WebNoura.%20Thank%20you%20for%20reaching%20out!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Chat on WhatsApp"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Website Category & Distribution (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Category Demand */}
          <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 backdrop-blur-md shadow-xl">
            <h2 className="font-display text-base font-extrabold text-white">
              Website Demands by Industry
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Most requested project types</p>

            <div className="mt-6 space-y-4">
              {websiteTypeEntries.map(([type, count]) => {
                const percent = Math.round((count / (totalLeads || 1)) * 100);
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#CBD5E1] truncate pr-2">{type}</span>
                      <span className="font-mono text-[11px] font-bold text-white">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#061833]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-cyan-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Studio Overview Card */}
          <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-br from-[#061833] via-[#0B2D5B] to-[#0A2548] p-6 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white p-1">
                <img src="/logo.jpg?v=2" alt="Webnoura" className="h-full w-full rounded-full object-contain" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">WebNoura by Karan</p>
                <p className="font-mono text-[10px] text-[#93C5FD]">Studio Operational Status: Active</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#CBD5E1]">
              All client forms and submissions on the website are synchronized. Direct contact links are configured to connect with clients immediately via WhatsApp and Email.
            </p>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#93C5FD] hover:text-white"
              >
                Open Live Site <ArrowUpRight className="h-3 w-3" />
              </a>
              <button
                onClick={() => setActiveTab("settings")}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                Settings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
