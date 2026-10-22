import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Globe,
  MousePointerClick,
  Kanban,
  Tag,
  BellRing,
  Star,
  Power,
} from "lucide-react";
import { adminStore } from "@/lib/adminStore";

export type AdminTab =
  | "overview"
  | "analytics"
  | "enquiries"
  | "project_tracker"
  | "coupons"
  | "triggers_log"
  | "testimonials"
  | "portfolio"
  | "services"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  unreadCount: number;
  onLogout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  unreadCount,
  onLogout,
  open,
  setOpen,
}: AdminSidebarProps) {
  const settings = adminStore.getSettings();

  const navSections = [
    {
      category: "MAIN HUB (ਮੁੱਖ ਭਾਗ)",
      items: [
        { id: "overview" as AdminTab, label: "Dashboard", sublabel: "ਮੁੱਖ ਸਮਰੀ · Studio Overview", icon: LayoutDashboard },
        { id: "enquiries" as AdminTab, label: "Client Enquiries", sublabel: "ਗਾਹਕਾਂ ਦੇ ਮੈਸੇਜ · WhatsApp Leads", icon: Inbox, badge: unreadCount },
        { id: "analytics" as AdminTab, label: "Visitors & Clicks", sublabel: "ਵੈੱਬਸਾਈਟ ਟ੍ਰੈਫਿਕ · Visitor Report", icon: MousePointerClick },
      ],
    },
    {
      category: "CLIENTS & PROJECTS (ਕੰਮ ਅਤੇ ਆਰਡਰ)",
      items: [
        { id: "project_tracker" as AdminTab, label: "Active Projects", sublabel: "ਚੱਲ ਰਹੇ ਆਰਡਰ · Pipeline Tracker", icon: Kanban },
        { id: "coupons" as AdminTab, label: "Promo Codes", sublabel: "ਕੂਪਨ ਤੇ ਆਫ਼ਰ · Discounts & ₹4,999", icon: Tag },
        { id: "triggers_log" as AdminTab, label: "Notification Logs", sublabel: "ਮੈਸੇਜ ਰਿਕਾਰਡ · WhatsApp Triggers", icon: BellRing },
      ],
    },
    {
      category: "WEBSITE CONTENT (ਵੈੱਬਸਾਈਟ ਡਾਟਾ)",
      items: [
        { id: "portfolio" as AdminTab, label: "Portfolio Works", sublabel: "ਵੈੱਬਸਾਈਟ ਸੈਂਪਲ · Live Demos", icon: Briefcase },
        { id: "services" as AdminTab, label: "Services & Pricing", sublabel: "ਰੇਟ ਤੇ ਪਲਾਨ · ₹4,999 Packages", icon: Layers },
        { id: "testimonials" as AdminTab, label: "Reviews Manager", sublabel: "ਗਾਹਕਾਂ ਦੀ ਫੀਡਬੈਕ · Client Reviews", icon: Star },
      ],
    },
    {
      category: "SYSTEM & SETTINGS (ਕੰਟਰੋਲ)",
      items: [
        { id: "settings" as AdminTab, label: "Settings & Mode", sublabel: "ਵੈੱਬਸਾਈਟ ਆਨ/ਆਫ਼ · Passwords & Config", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#1E4378] bg-[#061833] text-[#F8F9FA] transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 border-b border-[#1E4378] px-6 py-5">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white p-1 ring-2 ring-[#3B82F6]/60 shadow-md">
              <img src="/logo.jpg?v=2" alt="Webnoura" className="h-full w-full rounded-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-extrabold tracking-tight text-white">
                Web<span className="text-[#3B82F6]">noura</span>
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#93C5FD] uppercase">
                Admin Console · Karan
              </span>
            </div>
          </div>

          {/* Categorized Navigation */}
          <nav className="mt-4 px-3 space-y-5" aria-label="Admin Navigation">
            {navSections.map((sec) => (
              <div key={sec.category}>
                <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#93C5FD]/70 font-semibold block mb-1.5">
                  {sec.category}
                </span>

                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setOpen(false);
                        }}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-200 ${
                          isActive
                            ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30 font-bold"
                            : "text-[#CBD5E1] hover:bg-[#0B2D5B] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-[#93C5FD]"}`} />
                          <div className="text-left min-w-0">
                            <span className="block truncate font-bold text-xs">{item.label}</span>
                            <span className={`block truncate text-[10px] font-normal ${isActive ? "text-white/80" : "text-[#64748B]"}`}>
                              {item.sublabel}
                            </span>
                          </div>
                        </div>

                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 font-mono text-[10px] font-bold ${
                              isActive
                                ? "bg-white text-[#0B2D5B]"
                                : "bg-[#3B82F6] text-white shadow-sm"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Website Status & Profile */}
        <div className="border-t border-[#1E4378] p-4 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-[#1E4378] bg-[#0B2D5B]/50 px-3.5 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#3B82F6] hover:bg-[#0B2D5B] hover:text-white transition-all"
          >
            <span className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-[#3B82F6]" />
              <span>Live Website</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold ${
                settings.websiteOnline ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              ● {settings.websiteOnline ? "Online" : "Maintenance"}
            </span>
          </a>

          {/* Karan's Admin Profile */}
          <div className="flex items-center justify-between rounded-2xl bg-[#0B2D5B] p-3 border border-[#1E4378]">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-cyan-400 p-0.5">
                <div className="h-full w-full rounded-full bg-[#061833] flex items-center justify-center text-xs font-bold text-white">
                  K
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0B2D5B]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Karan</p>
                <p className="font-mono text-[9px] text-[#93C5FD]">Owner &amp; Admin</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Logout from Admin"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#1E4378] text-[#CBD5E1] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
