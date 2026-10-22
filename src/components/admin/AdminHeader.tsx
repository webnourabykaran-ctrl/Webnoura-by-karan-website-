import { Menu, RefreshCw, Plus, Download, Sparkles, Check, Power, RotateCcw } from "lucide-react";
import { useState } from "react";
import { adminStore } from "@/lib/adminStore";

interface AdminHeaderProps {
  title: string;
  onOpenSidebar: () => void;
  onRefresh: () => void;
  onAddNewLead: () => void;
  syncing?: boolean;
}

export function AdminHeader({
  title,
  onOpenSidebar,
  onRefresh,
  onAddNewLead,
  syncing = false,
}: AdminHeaderProps) {
  const [copied, setCopied] = useState(false);
  const settings = adminStore.getSettings();

  const handleExportCSV = () => {
    adminStore.exportEnquiriesToCSV();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleWebsiteOnline = () => {
    const nextState = !settings.websiteOnline;
    adminStore.toggleWebsiteOnline(nextState);
    onRefresh();
  };

  const handleRestartSystem = () => {
    if (
      confirm(
        "Are you sure you want to RESTART & RESET the entire admin system? All inquiries, active projects, coupons, and logs will be restored to clean baseline data."
      )
    ) {
      adminStore.resetAllData();
      onRefresh();
      alert("Admin system successfully restarted with clean baseline data!");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#1E4378] bg-[#061833]/90 px-4 md:px-8 backdrop-blur-md text-[#F8F9FA]">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E4378] bg-[#0B2D5B] text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-white capitalize">
            {title}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] text-emerald-300 font-semibold">
              Live Cloud Sync · Real-Time
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons & Website ON/OFF Switch */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Website ON/OFF Switch Button */}
        <button
          onClick={handleToggleWebsiteOnline}
          title={settings.websiteOnline ? "Turn Website Offline (Maintenance)" : "Turn Website Live (Online)"}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-md ${
            settings.websiteOnline
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
              : "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
          }`}
        >
          <Power className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-mono">
            Website: {settings.websiteOnline ? "ONLINE (LIVE)" : "OFFLINE (MAINTENANCE)"}
          </span>
          <span className="sm:hidden font-mono">
            {settings.websiteOnline ? "ON" : "OFF"}
          </span>
        </button>

        {/* View Live Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live public website in new tab"
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#0B2D5B] hover:border-[#3B82F6] text-[#CBD5E1] hover:text-white px-3 py-1.5 text-xs font-semibold transition-all"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>View Site ↗</span>
        </a>

        {/* Sync button */}
        <button
          onClick={onRefresh}
          disabled={syncing}
          title="Reload & Sync Store"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#0B2D5B] px-3 py-1.5 text-xs font-semibold text-[#CBD5E1] hover:border-[#3B82F6] hover:text-white transition-all duration-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-[#3B82F6]" : "text-[#93C5FD]"}`} />
          <span className="hidden md:inline">{syncing ? "Syncing..." : "Sync"}</span>
        </button>

        {/* Export CSV button */}
        <button
          onClick={handleExportCSV}
          title="Export all leads to CSV"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#1E4378] bg-[#0B2D5B] px-3 py-1.5 text-xs font-semibold text-[#CBD5E1] hover:border-[#3B82F6] hover:text-white transition-all duration-200"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5 text-[#93C5FD]" />}
          <span className="hidden lg:inline">{copied ? "Exported" : "CSV"}</span>
        </button>

        {/* Add Lead CTA */}
        <button
          onClick={onAddNewLead}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3.5 py-1.5 text-xs font-bold transition-all duration-200 shadow-md shadow-[#3B82F6]/30 hover:shadow-lg hover:shadow-[#3B82F6]/40 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </button>
      </div>
    </header>
  );
}
