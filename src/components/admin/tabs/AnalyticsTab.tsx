import { useState, useMemo } from "react";
import {
  Users,
  MousePointerClick,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Eye,
  Filter,
  Search,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Compass,
  PhoneCall,
  Activity,
  Layers,
  CheckCircle2,
  Check,
  Calendar,
  BarChart3,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { AnalyticsData, ClickEvent } from "@/types/admin";
import {
  analyticsTracker,
  calculateWeeklyVisits,
  calculateMonthlyVisits,
  getDailyActivityHistory,
} from "@/lib/analytics";

interface AnalyticsTabProps {
  analytics: AnalyticsData;
  onRefresh: () => void;
}

export function AnalyticsTab({ analytics, onRefresh }: AnalyticsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<"all" | "month" | "week" | "today">("all");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      window.dispatchEvent(new CustomEvent("webnoura_analytics_change"));
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 2000);
      }, 500);
    }
  };

  // Calculate totals
  const totalVisits = analytics.totalVisits || 0;
  const uniqueVisitors = analytics.uniqueVisitors || 0;
  const todayVisits = analytics.todayVisits || 0;
  const weeklyVisits = analytics.weeklyVisits ?? calculateWeeklyVisits(analytics.dailyVisits);
  const monthlyVisits = analytics.monthlyVisits ?? calculateMonthlyVisits(analytics.dailyVisits);

  const dailyHistory = useMemo(() => {
    return getDailyActivityHistory(analytics.dailyVisits || {}, 7);
  }, [analytics.dailyVisits]);

  const maxDailyVisit = useMemo(() => {
    const counts = dailyHistory.map((d) => d.visits);
    return Math.max(...counts, 1);
  }, [dailyHistory]);

  const peakDay = useMemo(() => {
    return [...dailyHistory].sort((a, b) => b.visits - a.visits)[0] || {
      date: new Date().toISOString().slice(0, 10),
      dayName: "Today",
      formattedDate: "Today",
      visits: todayVisits,
    };
  }, [dailyHistory, todayVisits]);

  const totalClicks = useMemo(() => {
    return Object.values(analytics.clickCounts || {}).reduce((sum, count) => sum + count, 0);
  }, [analytics.clickCounts]);

  // Click leaderboard sorted descending
  const leaderboard = useMemo(() => {
    const entries = Object.entries(analytics.clickCounts || {}).map(([name, count]) => {
      // Find category from recent clicks if available
      const sample = analytics.clicks?.find((c) => c.name === name);
      let cat: ClickEvent["category"] = sample?.category || "cta";

      if (name.toLowerCase().includes("demo")) cat = "demo";
      else if (name.toLowerCase().includes("package") || name.includes("₹")) cat = "service";
      else if (name.toLowerCase().includes("whatsapp") || name.toLowerCase().includes("email") || name.toLowerCase().includes("instagram") || name.toLowerCase().includes("phone")) cat = "contact";
      else if (name.toLowerCase().includes("navigation") || name.startsWith("Navigation")) cat = "navigation";

      return {
        name,
        count,
        category: cat,
        sampleTarget: sample?.target,
      };
    });

    return entries.sort((a, b) => b.count - a.count);
  }, [analytics.clickCounts, analytics.clicks]);

  // Filtered leaderboard
  const filteredLeaderboard = useMemo(() => {
    return leaderboard.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [leaderboard, searchTerm, selectedCategory]);

  // Device stats
  const deviceTotal = (analytics.deviceBreakdown.mobile || 0) + (analytics.deviceBreakdown.desktop || 0) + (analytics.deviceBreakdown.tablet || 0) || 1;
  const mobilePct = Math.round(((analytics.deviceBreakdown.mobile || 0) / deviceTotal) * 100);
  const desktopPct = Math.round(((analytics.deviceBreakdown.desktop || 0) / deviceTotal) * 100);
  const tabletPct = Math.round(((analytics.deviceBreakdown.tablet || 0) / deviceTotal) * 100);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "cta":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-blue-400">Main CTA</span>;
      case "demo":
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-purple-400">Live Demo</span>;
      case "service":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400">Pricing Package</span>;
      case "contact":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-400">Contact / Chat</span>;
      case "navigation":
        return <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-cyan-300">Navigation</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 border border-slate-500/30 px-2.5 py-0.5 text-[11px] font-mono text-slate-400">{category}</span>;
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device === "mobile") return <Smartphone className="h-3.5 w-3.5 text-blue-400" />;
    if (device === "tablet") return <Tablet className="h-3.5 w-3.5 text-amber-400" />;
    return <Monitor className="h-3.5 w-3.5 text-emerald-400" />;
  };

  const formatTimeAgo = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(isoString).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const handleReset = () => {
    analyticsTracker.resetAnalytics();
    onRefresh();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Status */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#93C5FD]">
              <Activity className="h-6 w-6 text-[#3B82F6] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-extrabold text-white">
                  Website Visitors & Click Tracking <span className="text-[#93C5FD] font-semibold text-sm">(ਵੈੱਬਸਾਈਟ ਵਿਜ਼ਿਟਰ ਰਿਪੋਰਟ)</span>
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Real-time
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                ਵੇਖੋ ਅੱਜ, ਇਸ ਹਫ਼ਤੇ ਅਤੇ ਇਸ ਮਹੀਨੇ ਕਿੰਨੇ ਲੋਕਾਂ ਨੇ ਵੈੱਬਸਾਈਟ ਖੋਲ੍ਹੀ ਅਤੇ ਕਿਹੜੇ ਬਟਨ (WhatsApp / Call / Packages) ਦਬਾਏ।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:bg-[#1E4378]/50 text-[#CBD5E1] hover:text-white px-3.5 py-2 text-xs font-semibold transition-all disabled:opacity-60 shadow-sm"
              title="Refresh and sync real-time website analytics"
            >
              <RotateCcw className={`h-4 w-4 text-[#93C5FD] transition-transform ${isRefreshing ? "animate-spin text-[#3B82F6]" : ""}`} />
              {isRefreshing ? (
                <span>Refreshing...</span>
              ) : justRefreshed ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Refreshed!
                </span>
              ) : (
                <span>Refresh</span>
              )}
            </button>

            <button
              onClick={() => {
                analyticsTracker.recordVisit(true);
                handleRefreshClick();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 px-3 py-2 text-xs font-semibold transition-all"
              title="Record a test visit to see live metrics increment immediately"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> +1 Test Visit
            </button>

            {showConfirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-xs font-bold transition-all shadow-md"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="rounded-xl border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-white px-3 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 text-xs font-semibold transition-all"
                title="Reset analytics back to fresh default"
              >
                Reset Stats
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeframe Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E4378]/60 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#93C5FD]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#94A3B8]">ਸਮਾਂ ਚੁਣੋ (Select Range):</span>
        </div>
        <div className="inline-flex rounded-xl border border-[#1E4378] bg-[#061833] p-1 gap-1">
          {[
            { id: "all", label: "All-Time (ਕੁੱਲ)", count: totalVisits },
            { id: "month", label: "Monthly (ਮਹੀਨਾ)", count: monthlyVisits },
            { id: "week", label: "Weekly (ਹਫ਼ਤਾ)", count: weeklyVisits },
            { id: "today", label: "Today (ਅੱਜ)", count: todayVisits },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id as typeof timeframe)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                timeframe === item.id
                  ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {item.label}
              <span className="ml-1.5 opacity-80 font-mono text-[10px]">({item.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6 Visitor & Interaction KPI Cards (Includes Weekly & Monthly) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Today's Visits */}
        <div className="rounded-2xl border border-emerald-500/30 bg-[#0B2D5B]/70 p-5 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Visits Today
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{todayVisits.toLocaleString("en-IN")}</span>
            <span className="text-xs text-emerald-400 font-bold">Active Today</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Visits recorded since midnight</p>
        </div>

        {/* Weekly Visitors (Requested) */}
        <div className="rounded-2xl border border-[#3B82F6]/40 bg-[#0B2D5B]/70 p-5 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Weekly Visitors</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{weeklyVisits.toLocaleString("en-IN")}</span>
            <span className="inline-flex items-center text-xs font-bold text-[#93C5FD]">
              Last 7 Days
            </span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Rolling 7-day visitor traffic</p>
        </div>

        {/* Monthly Visitors (Requested) */}
        <div className="rounded-2xl border border-indigo-500/30 bg-[#0B2D5B]/70 p-5 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-indigo-300">Monthly Visitors</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{monthlyVisits.toLocaleString("en-IN")}</span>
            <span className="text-xs text-indigo-300 font-medium">Last 30 Days</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Rolling 30-day website audience reach</p>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Unique Visitors</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{uniqueVisitors.toLocaleString("en-IN")}</span>
            <span className="text-xs text-purple-300 font-medium">Distinct Individuals</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Separate users who browsed WebNoura</p>
        </div>

        {/* Total Visits (All Time) */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Total All-Time Visits</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{totalVisits.toLocaleString("en-IN")}</span>
            <span className="inline-flex items-center text-xs font-bold text-cyan-400">
              <TrendingUp className="h-3 w-3 mr-0.5" /> Cumulative
            </span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Total historical page sessions</p>
        </div>

        {/* Total Clicks Logged */}
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Total Interaction Clicks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <MousePointerClick className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-white">{totalClicks.toLocaleString("en-IN")}</span>
            <span className="text-xs text-amber-300 font-medium">Interactions</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">Buttons, packages & demos tapped</p>
        </div>
      </div>

      {/* Weekly Visitor Traffic Graph (Last 7 Days) */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-br from-[#0B2D5B]/80 via-[#0A2548]/90 to-[#061833] p-6 md:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E4378]/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#3B82F6]" />
              <h2 className="font-display text-base md:text-lg font-extrabold text-white">
                Weekly & Daily Visitor Activity Trend
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Visual day-by-day traffic distribution across the last 7 calendar days
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833]/80 px-3 py-1.5 text-xs text-[#CBD5E1]">
              <span className="text-[#94A3B8]">7D Weekly:</span>
              <strong className="font-mono text-white">{weeklyVisits}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833]/80 px-3 py-1.5 text-xs text-[#CBD5E1]">
              <span className="text-[#94A3B8]">Daily Avg:</span>
              <strong className="font-mono text-emerald-400">{Math.max(1, Math.round(weeklyVisits / 7))} / day</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#061833]/80 px-3 py-1.5 text-xs text-[#CBD5E1]">
              <span className="text-[#94A3B8]">30D Monthly:</span>
              <strong className="font-mono text-indigo-300">{monthlyVisits}</strong>
            </span>
          </div>
        </div>

        {/* 7-Day Interactive Visual Bar Chart */}
        <div className="mt-8">
          <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-52 pt-6 pb-2 px-2 border-b border-[#1E4378]/40">
            {dailyHistory.map((day, idx) => {
              const heightPct = Math.max(12, Math.round((day.visits / maxDailyVisit) * 100));
              const isToday = idx === dailyHistory.length - 1;
              const isPeak = day.visits === peakDay.visits && day.visits > 0;

              return (
                <div key={day.date} className="flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 z-20 pointer-events-none whitespace-nowrap rounded-lg border border-[#1E4378] bg-[#061833] px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-xl">
                    {day.formattedDate}: {day.visits} visits
                  </div>

                  {/* Visit count label above bar */}
                  <span className={`text-[11px] font-mono font-bold mb-2 transition-colors ${
                    isToday ? "text-emerald-400 font-extrabold" : "text-[#CBD5E1] group-hover:text-white"
                  }`}>
                    {day.visits}
                  </span>

                  {/* Vertical bar */}
                  <div className="w-full max-w-[42px] h-full flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 relative ${
                        isToday
                          ? "bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/50"
                          : isPeak
                          ? "bg-gradient-to-t from-[#1E4378] via-[#3B82F6] to-cyan-400 shadow-md shadow-[#3B82F6]/20"
                          : "bg-gradient-to-t from-[#0B2D5B] via-[#1E4378] to-[#3B82F6]/70 group-hover:to-[#3B82F6]"
                      }`}
                    >
                      {isToday && (
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* Day label beneath */}
                  <div className="mt-3 text-center">
                    <span className={`block text-xs font-bold leading-none ${
                      isToday ? "text-emerald-400" : "text-[#CBD5E1]"
                    }`}>
                      {day.dayName}
                    </span>
                    <span className="block text-[10px] font-mono text-[#94A3B8] mt-1">
                      {day.formattedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#94A3B8] pt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-emerald-600 to-emerald-400" />
                Today's Active Traffic
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-[#1E4378] to-[#3B82F6]" />
                Past Days Visits
              </span>
            </div>
            <span>
              Peak Day: <strong>{peakDay.dayName} ({peakDay.formattedDate})</strong> with {peakDay.visits} visits
            </span>
          </div>
        </div>
      </div>

      {/* Device Breakdown Card */}
      <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 md:p-8 backdrop-blur-md shadow-xl">
        <h2 className="font-display text-base font-extrabold text-white">
          Visitor Devices Breakdown
        </h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Where your visitors are viewing your website from
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {/* Mobile */}
          <div className="rounded-2xl border border-[#1E4378] bg-[#061833]/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Mobile Phones</span>
              </div>
              <span className="font-mono text-sm font-bold text-[#93C5FD]">{mobilePct}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#061833]">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${mobilePct}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-mono text-[#94A3B8]">
              {analytics.deviceBreakdown.mobile || 0} visits
            </p>
          </div>

          {/* Desktop */}
          <div className="rounded-2xl border border-[#1E4378] bg-[#061833]/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Desktop / Laptop</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-400">{desktopPct}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#061833]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${desktopPct}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-mono text-[#94A3B8]">
              {analytics.deviceBreakdown.desktop || 0} visits
            </p>
          </div>

          {/* Tablet */}
          <div className="rounded-2xl border border-[#1E4378] bg-[#061833]/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Tablet / iPad</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-400">{tabletPct}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#061833]">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${tabletPct}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-mono text-[#94A3B8]">
              {analytics.deviceBreakdown.tablet || 0} visits
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Click Leaderboard (8 cols) & Live Stream (4 cols) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Click Leaderboard */}
        <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 md:p-8 backdrop-blur-md lg:col-span-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E4378]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-extrabold text-white">
                  Visitor Click Leaderboard
                </h2>
                <span className="rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#93C5FD]">
                  {leaderboard.length} elements
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Exact breakdown of every button, demo link, package, and contact CTA clicked by visitors
              </p>
            </div>
          </div>

          {/* Filter Pills and Search */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search clicked item or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "cta", label: "CTAs" },
                { id: "demo", label: "Live Demos" },
                { id: "service", label: "Packages" },
                { id: "contact", label: "Contacts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === tab.id
                      ? "bg-[#3B82F6] text-white"
                      : "bg-[#061833] text-[#94A3B8] hover:text-white border border-[#1E4378]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table / Rows */}
          <div className="mt-6 space-y-3">
            {filteredLeaderboard.length === 0 ? (
              <div className="py-12 text-center">
                <MousePointerClick className="mx-auto h-10 w-10 text-[#64748B]" />
                <p className="mt-3 text-sm font-semibold text-[#CBD5E1]">No click events recorded yet</p>
                <p className="text-xs text-[#94A3B8] mt-1">When visitors click website buttons, packages, or demo links, they appear here live.</p>
              </div>
            ) : (
              filteredLeaderboard.map((item, index) => {
                const maxCount = leaderboard[0]?.count || 1;
                const percentage = Math.round((item.count / (totalClicks || 1)) * 100);
                const barWidth = Math.max(8, Math.round((item.count / maxCount) * 100));

                return (
                  <div
                    key={item.name}
                    className="group rounded-2xl border border-[#1E4378]/80 bg-[#061833]/50 hover:bg-[#061833] p-4 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-extrabold ${
                            index === 0
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : index === 1
                              ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                              : index === 2
                              ? "bg-amber-700/20 text-amber-400 border border-amber-700/40"
                              : "bg-[#1E4378]/40 text-[#94A3B8]"
                          }`}
                        >
                          #{index + 1}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-white group-hover:text-[#93C5FD] transition-colors">
                              {item.name}
                            </h3>
                            {getCategoryBadge(item.category)}
                          </div>
                          {item.sampleTarget && (
                            <p className="text-[11px] font-mono text-[#64748B] truncate max-w-sm mt-0.5">
                              Target: {item.sampleTarget}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-display text-base font-extrabold text-white">
                            {item.count}{" "}
                            <span className="text-xs font-mono font-normal text-[#94A3B8]">clicks</span>
                          </span>
                          <p className="text-[10px] font-mono text-[#93C5FD]">
                            {percentage}% of total
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Popularity Bar */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#061833]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-cyan-400 transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Activity Stream (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E4378]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#3B82F6]" />
                <h2 className="font-display text-base font-extrabold text-white">
                  Live Click Stream
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#93C5FD]">Latest events</span>
            </div>

            <div className="mt-4 space-y-3.5 max-h-[560px] overflow-y-auto pr-1">
              {!analytics.clicks || analytics.clicks.length === 0 ? (
                <p className="text-xs text-[#94A3B8] text-center py-8">
                  No clicks logged yet in this session.
                </p>
              ) : (
                analytics.clicks.slice(0, 20).map((click) => (
                  <div
                    key={click.id}
                    className="rounded-xl border border-[#1E4378]/60 bg-[#061833]/60 p-3 hover:border-[#3B82F6]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getDeviceIcon(click.device)}
                        <span className="text-[10px] font-mono text-[#94A3B8] capitalize">
                          {click.device}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#93C5FD]">
                        {formatTimeAgo(click.timestamp)}
                      </span>
                    </div>

                    <p className="font-bold text-xs text-white mt-1.5 line-clamp-1">
                      {click.name}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      {getCategoryBadge(click.category)}
                      {click.target && (
                        <span className="text-[10px] font-mono text-[#64748B] truncate max-w-[120px]">
                          {click.target}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-br from-[#061833] via-[#0B2D5B] to-[#0A2548] p-6 text-white shadow-xl">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-sm">How Click Tracking Works</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#CBD5E1]">
              Every time any visitor taps <strong>"GET A WEBSITE"</strong>, examines a <strong>₹4,999 Package</strong>, launches a <strong>Live Demo</strong>, or taps <strong>WhatsApp / Call</strong>, it increments real-time counts instantly here in your console.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#93C5FD] hover:text-white"
              >
                Test on Live Site <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
