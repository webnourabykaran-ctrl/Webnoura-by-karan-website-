import React, { createContext, useContext, useState, useEffect } from "react";

export type AdminLanguage = "en" | "pa";

const LANG_STORAGE_KEY = "webnoura_admin_lang";

export interface Translations {
  // Navigation
  dashboard: string;
  dashboardSub: string;
  enquiries: string;
  enquiriesSub: string;
  visitors: string;
  visitorsSub: string;
  activeProjects: string;
  activeProjectsSub: string;
  invoices: string;
  invoicesSub: string;
  coupons: string;
  couponsSub: string;
  notifications: string;
  notificationsSub: string;
  portfolio: string;
  portfolioSub: string;
  services: string;
  servicesSub: string;
  reviews: string;
  reviewsSub: string;
  settings: string;
  settingsSub: string;
  logout: string;

  // Header & Global
  cloudSync: string;
  websiteOnline: string;
  websiteOffline: string;
  viewSite: string;
  sync: string;
  syncing: string;
  addLead: string;
  csv: string;
  exported: string;
  systemActive: string;
  greeting: string;
  studioSubtitle: string;

  // Overview Quick Hub
  quickEnquiriesTitle: string;
  quickEnquiriesDesc: string;
  quickEnquiriesCta: string;
  quickVisitorsTitle: string;
  quickVisitorsDesc: string;
  quickVisitorsCta: string;
  quickOrdersTitle: string;
  quickOrdersDesc: string;
  quickOrdersCta: string;
  quickInvoicesTitle: string;
  quickInvoicesDesc: string;
  quickInvoicesCta: string;
  quickSettingsTitle: string;
  quickSettingsDesc: string;
  quickSettingsCta: string;

  // Invoices & Billing
  invoicesTabTitle: string;
  invoicesTabDesc: string;
  createInvoiceBtn: string;
  totalInvoiced: string;
  collectedPaid: string;
  pendingBalance: string;
  paidStatus: string;
  allDeals: string;
  paidFilter: string;
  partialFilter: string;
  pendingFilter: string;
  searchInvoicePlaceholder: string;
  noInvoicesFound: string;
  noInvoicesDesc: string;
  viewPrint: string;
  sendWhatsApp: string;
  markPaid: string;
  edit: string;
  delete: string;

  // Common statuses & labels
  statusNew: string;
  statusInDiscussion: string;
  statusQuoted: string;
  statusInProgress: string;
  statusCompleted: string;
  statusDeclined: string;
  totalLeads: string;
  totalVisits: string;
  todayVisits: string;
  weeklyVisits: string;
  monthlyVisits: string;
  allTime: string;
  clicks: string;
  topClicked: string;
  seeClicksCta: string;
  liveTrafficHeading: string;
  footerText: string;
}

export const TRANSLATIONS: Record<AdminLanguage, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    dashboardSub: "Studio Overview & Metrics",
    enquiries: "Client Enquiries",
    enquiriesSub: "WhatsApp Leads & Submissions",
    visitors: "Visitors & Clicks",
    visitorsSub: "Website Traffic & Click Report",
    activeProjects: "Active Projects",
    activeProjectsSub: "Live Production Pipeline",
    invoices: "Invoices & Deals",
    invoicesSub: "Deal Invoices & PDF Share",
    coupons: "Promo Codes",
    couponsSub: "Discounts & Offers Manager",
    notifications: "Notification Logs",
    notificationsSub: "Automated WhatsApp & Email Logs",
    portfolio: "Portfolio Works",
    portfolioSub: "Live Client Website Demos",
    services: "Services & Pricing",
    servicesSub: "Packages & Rate Plans",
    reviews: "Reviews Manager",
    reviewsSub: "Client Testimonials & Feedback",
    settings: "Settings & Mode",
    settingsSub: "Maintenance Mode & Passwords",
    logout: "Log Out",

    // Header & Global
    cloudSync: "Live Cloud Sync · Real-Time",
    websiteOnline: "Website: ONLINE (LIVE)",
    websiteOffline: "Website: OFFLINE (MAINTENANCE)",
    viewSite: "View Site ↗",
    sync: "Sync",
    syncing: "Syncing...",
    addLead: "Add Lead",
    csv: "Export CSV",
    exported: "Exported",
    systemActive: "System Active",
    greeting: "Welcome Karan!",
    studioSubtitle: "WebNoura Command Center · Manage client messages, track live visitors, create invoices, and configure settings.",

    // Overview Quick Hub
    quickEnquiriesTitle: "1. Client Messages",
    quickEnquiriesDesc: "Review form enquiries, chat directly on WhatsApp, or manage client response timers.",
    quickEnquiriesCta: "Open Leads ↗",
    quickVisitorsTitle: "2. Website Visitors",
    quickVisitorsDesc: "See how many people visited, what devices they used, and which buttons they clicked.",
    quickVisitorsCta: "View Traffic ↗",
    quickOrdersTitle: "3. Active Orders",
    quickOrdersDesc: "Track websites currently in design, development, and testing phases with target deadlines.",
    quickOrdersCta: "Track Projects ↗",
    quickInvoicesTitle: "4. Deals & Invoices",
    quickInvoicesDesc: "Generate client billing receipts, record advance payments, and share on WhatsApp or print PDF.",
    quickInvoicesCta: "Create Invoice ↗",
    quickSettingsTitle: "5. Settings & Control",
    quickSettingsDesc: "Toggle website online/offline maintenance switch, update promo banners or change admin passwords.",
    quickSettingsCta: "Open Settings ↗",

    // Invoices & Billing
    invoicesTabTitle: "Client Invoices & Deals Billing",
    invoicesTabDesc: "Create official WebNoura invoices for client deals, record advance payments, and share directly via WhatsApp or printable PDF.",
    createInvoiceBtn: "+ Create Deal Invoice",
    totalInvoiced: "Total Invoiced",
    collectedPaid: "Collected / Paid",
    pendingBalance: "Pending Balance",
    paidStatus: "Paid Status",
    allDeals: "All Deals",
    paidFilter: "Paid",
    partialFilter: "Partial",
    pendingFilter: "Pending",
    searchInvoicePlaceholder: "Search by client, invoice #, phone...",
    noInvoicesFound: "No Invoices Found",
    noInvoicesDesc: "No invoices match your current search or filter. Generate your first invoice when a client confirms a project deal!",
    viewPrint: "View & Print",
    sendWhatsApp: "WhatsApp",
    markPaid: "✓ Mark Paid",
    edit: "Edit",
    delete: "Delete",

    // Common statuses & labels
    statusNew: "New",
    statusInDiscussion: "In Discussion",
    statusQuoted: "Quoted",
    statusInProgress: "In Progress",
    statusCompleted: "Completed",
    statusDeclined: "Declined",
    totalLeads: "Total Inquiries",
    totalVisits: "Total Visits",
    todayVisits: "Today",
    weeklyVisits: "This Week",
    monthlyVisits: "This Month",
    allTime: "All-Time",
    clicks: "Button Clicks",
    topClicked: "Most Clicked Button:",
    seeClicksCta: "See What Visitors Clicked ↗",
    liveTrafficHeading: "Live Website Traffic & Click Intelligence",
    footerText: "© 2026 WebNoura by Karan. Admin Command Center · All systems operational.",
  },

  pa: {
    // Navigation
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    dashboardSub: "ਮੁੱਖ ਸਮਰੀ · Studio Overview",
    enquiries: "ਗਾਹਕਾਂ ਦੇ ਮੈਸੇਜ",
    enquiriesSub: "ਵਟਸਐਪ ਲੀਡਸ · WhatsApp Leads",
    visitors: "ਵੈੱਬਸਾਈਟ ਵਿਜ਼ਿਟਰਸ",
    visitorsSub: "ਵੈੱਬਸਾਈਟ ਟ੍ਰੈਫਿਕ · Visitor Report",
    activeProjects: "ਚੱਲ ਰਹੇ ਆਰਡਰ",
    activeProjectsSub: "ਪ੍ਰੋਜੈਕਟ ਪਾਈਪਲਾਈਨ · Pipeline Tracker",
    invoices: "ਬਿੱਲ ਤੇ ਪੇਮੈਂਟਸ",
    invoicesSub: "ਬਿੱਲ ਬਣਾਓ · Invoices & PDF Share",
    coupons: "ਪ੍ਰੋਮੋ ਕੋਡ ਤੇ ਆਫ਼ਰ",
    couponsSub: "ਕੂਪਨ ਤੇ ਛੋਟ · Discounts & ₹4,999",
    notifications: "ਮੈਸੇਜ ਰਿਕਾਰਡ",
    notificationsSub: "ਆਟੋਮੈਟਿਕ ਵਟਸਐਪ ਲੌਗ · Triggers",
    portfolio: "ਪੋਰਟਫੋਲੀਓ ਪ੍ਰੋਜੈਕਟ",
    portfolioSub: "ਵੈੱਬਸਾਈਟ ਸੈਂਪਲ · Live Demos",
    services: "ਸਰਵਿਸ ਤੇ ਰੇਟ",
    servicesSub: "ਰੇਟ ਤੇ ਪੈਕੇਜ · ₹4,999 Packages",
    reviews: "ਗਾਹਕਾਂ ਦੀ ਫੀਡਬੈਕ",
    reviewsSub: "ਕਲਾਇੰਟ ਰੀਵਿਊ · Client Reviews",
    settings: "ਸੈਟਿੰਗਸ & ਕੰਟਰੋਲ",
    settingsSub: "ਵੈੱਬਸਾਈਟ ਆਨ/ਆਫ਼ · Passwords & Config",
    logout: "ਲੌਗਆਊਟ",

    // Header & Global
    cloudSync: "ਲਾਈਵ ਕਲਾਊਡ ਸਿੰਕ · ਰੀਅਲ-ਟਾਈਮ",
    websiteOnline: "ਵੈੱਬਸਾਈਟ: ਲਾਈਵ (ਚਾਲੂ)",
    websiteOffline: "ਵੈੱਬਸਾਈਟ: ਬੰਦ (ਮੁਰੰਮਤ)",
    viewSite: "ਵੈੱਬਸਾਈਟ ਦੇਖੋ ↗",
    sync: "ਸਿੰਕ ਕਰੋ",
    syncing: "ਸਿੰਕ ਹੋ ਰਿਹਾ...",
    addLead: "ਨਵੀਂ ਲੀਡ ਜੋੜੋ",
    csv: "CSV ਡਾਊਨਲੋਡ",
    exported: "ਸੇਵ ਹੋ ਗਿਆ",
    systemActive: "ਸਿਸਟਮ ਚਾਲੂ (Active)",
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਰਨ ਜੀ!",
    studioSubtitle: "ਵੈੱਬਨੌਰਾ ਸਟੂਡੀਓ ਕੰਟਰੋਲ · ਨਵੇਂ ਗਾਹਕਾਂ ਨਾਲ WhatsApp 'ਤੇ ਗੱਲ ਕਰੋ, ਵਿਜ਼ਿਟਰ ਰਿਪੋਰਟ ਦੇਖੋ, ਬਿੱਲ ਬਣਾਓ ਅਤੇ ਸੈਟਿੰਗਸ ਬਦਲੋ।",

    // Overview Quick Hub
    quickEnquiriesTitle: "1. ਗਾਹਕਾਂ ਦੇ ਮੈਸੇਜ",
    quickEnquiriesDesc: "ਨਵੇਂ ਫ਼ਾਰਮ ਵੇਖੋ, ਸਿੱਧਾ WhatsApp ਚੈਟ ਕਰੋ, ਜਾਂ ਕਲਾਇੰਟ ਟਾਈਮਰ ਬੰਦ ਕਰੋ।",
    quickEnquiriesCta: "ਮੈਸੇਜ (Leads) ↗",
    quickVisitorsTitle: "2. ਵਿਜ਼ਿਟਰਸ",
    quickVisitorsDesc: "ਵੇਖੋ ਕਿੰਨੇ ਲੋਕ ਆਏ, ਕਿਹੜੇ ਸ਼ਹਿਰੋਂ ਦੇਖਿਆ ਅਤੇ ਕਿਹੜੇ ਬਟਨ ਦਬਾਏ।",
    quickVisitorsCta: "ਵਿਜ਼ਿਟਰ (Traffic) ↗",
    quickOrdersTitle: "3. ਚੱਲ ਰਹੇ ਆਰਡਰ",
    quickOrdersDesc: "ਜਿਹੜੀਆਂ ਵੈੱਬਸਾਈਟਾਂ ਬਣ ਰਹੀਆਂ ਹਨ, ਉਹਨਾਂ ਦਾ ਸਟੇਟਸ ਤੇ ਡੈੱਡਲਾਈਨ ਟਰੈਕ ਕਰੋ।",
    quickOrdersCta: "ਆਰਡਰ (Projects) ↗",
    quickInvoicesTitle: "4. ਬਿੱਲ ਤੇ ਪੇਮੈਂਟਸ",
    quickInvoicesDesc: "ਗਾਹਕਾਂ ਨੂੰ ਬਿੱਲ ਬਣਾ ਕੇ ਭੇਜੋ, ਪੇਮੈਂਟ ਰਿਕਾਰਡ ਕਰੋ ਤੇ WhatsApp 'ਤੇ ਸ਼ੇਅਰ ਕਰੋ।",
    quickInvoicesCta: "ਬਿੱਲ ਬਣਾਓ (Billing) ↗",
    quickSettingsTitle: "5. ਸੈਟਿੰਗਸ & ਕੰਟਰੋਲ",
    quickSettingsDesc: "ਵੈੱਬਸਾਈਟ ਆਨ/ਆਫ਼ ਕਰੋ, ਨਵਾਂ ਆਫ਼ਰ ਲਗਾਓ ਜਾਂ ਐਡਮਿਨ ਪਾਸਵਰਡ ਬਦਲੋ।",
    quickSettingsCta: "ਸੈਟਿੰਗਸ (Settings) ↗",

    // Invoices & Billing
    invoicesTabTitle: "ਗਾਹਕਾਂ ਦੇ ਬਿੱਲ ਅਤੇ ਪੇਮੈਂਟਸ (Invoices & Billing)",
    invoicesTabDesc: "ਕਲਾਇੰਟ ਡੀਲਜ਼ ਲਈ WebNoura ਇਨਵੌਇਸ ਬਣਾਓ, ਅਡਵਾਂਸ ਪੇਮੈਂਟ ਰਿਕਾਰਡ ਕਰੋ ਅਤੇ WhatsApp 'ਤੇ ਸ਼ੇਅਰ ਜਾਂ PDF ਪ੍ਰਿੰਟ ਕਰੋ।",
    createInvoiceBtn: "+ ਨਵਾਂ ਬਿੱਲ ਬਣਾਓ (Create Invoice)",
    totalInvoiced: "ਕੁੱਲ ਬਿੱਲ ਰਕਮ",
    collectedPaid: "ਪ੍ਰਾਪਤ ਹੋਈ ਰਕਮ (Collected)",
    pendingBalance: "ਬਾਕੀ ਰਹਿੰਦੀ ਰਕਮ (Pending)",
    paidStatus: "ਪੂਰੇ ਹੋਏ ਬਿੱਲ (Closed)",
    allDeals: "ਸਾਰੇ ਬਿੱਲ",
    paidFilter: "ਪੂਰਾ ਭੁਗਤਾਨ",
    partialFilter: "ਅਡਵਾਂਸ ਦਿੱਤਾ",
    pendingFilter: "ਬਾਕੀ ਹੈ",
    searchInvoicePlaceholder: "ਗਾਹਕ ਦਾ ਨਾਮ, ਬਿੱਲ ਨੰਬਰ ਜਾਂ ਫ਼ੋਨ ਲੱਭੋ...",
    noInvoicesFound: "ਕੋਈ ਬਿੱਲ ਨਹੀਂ ਮਿਲਿਆ",
    noInvoicesDesc: "ਤੁਹਾਡੇ ਫਿਲਟਰ ਮੁਤਾਬਕ ਕੋਈ ਬਿੱਲ ਨਹੀਂ ਮਿਲਿਆ। ਜਦੋਂ ਕੋਈ ਨਵੀਂ ਡੀਲ ਹੋਵੇ, ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ ਤੋਂ ਨਵਾਂ ਬਿੱਲ ਬਣਾਓ!",
    viewPrint: "ਵੇਖੋ ਅਤੇ ਪ੍ਰਿੰਟ",
    sendWhatsApp: "ਵਟਸਐਪ 'ਤੇ ਭੇਜੋ",
    markPaid: "✓ ਪੇਮੈਂਟ ਹੋ ਗਈ",
    edit: "ਬਦਲੋ",
    delete: "ਮਿਟਾਓ",

    // Common statuses & labels
    statusNew: "ਨਵਾਂ",
    statusInDiscussion: "ਗੱਲਬਾਤ ਚੱਲ ਰਹੀ ਹੈ",
    statusQuoted: "ਰੇਟ ਭੇਜਿਆ",
    statusInProgress: "ਕੰਮ ਚੱਲ ਰਿਹਾ ਹੈ",
    statusCompleted: "ਮੁਕੰਮਲ",
    statusDeclined: "ਰੱਦ ਕੀਤਾ",
    totalLeads: "ਕੁੱਲ ਆਏ ਗਾਹਕ",
    totalVisits: "ਕੁੱਲ ਵਿਜ਼ਿਟਰ",
    todayVisits: "ਅੱਜ (Today)",
    weeklyVisits: "ਇਸ ਹਫ਼ਤੇ (Week)",
    monthlyVisits: "ਇਸ ਮਹੀਨੇ (Month)",
    allTime: "ਸ਼ੁਰੂ ਤੋਂ ਲੈ ਕੇ ਹੁਣ ਤੱਕ",
    clicks: "ਬਟਨ ਕਲਿੱਕ (Clicks)",
    topClicked: "ਸਭ ਤੋਂ ਵੱਧ ਕਲਿੱਕ ਹੋਇਆ ਬਟਨ:",
    seeClicksCta: "ਕਲਿੱਕ ਰਿਪੋਰਟ ਦੇਖੋ ↗",
    liveTrafficHeading: "ਲਾਈਵ ਵੈੱਬਸਾਈਟ ਟ੍ਰੈਫਿਕ ਅਤੇ ਕਲਿੱਕ ਰਿਕਾਰਡ",
    footerText: "© 2026 WebNoura by Karan. ਐਡਮਿਨ ਕਮਾਂਡ ਸੈਂਟਰ · ਸਾਰੇ ਸਿਸਟਮ ਠੀਕ ਕੰਮ ਕਰ ਰਹੇ ਹਨ।",
  },
};

interface AdminLanguageContextType {
  language: AdminLanguage;
  setLanguage: (lang: AdminLanguage) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const AdminLanguageContext = createContext<AdminLanguageContextType>({
  language: "pa",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: TRANSLATIONS.pa,
});

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AdminLanguage>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as AdminLanguage;
      if (saved === "en" || saved === "pa") return saved;
    }
    return "pa"; // Default to Punjabi
  });

  const setLanguage = (lang: AdminLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      window.dispatchEvent(new CustomEvent("webnoura_admin_lang_change", { detail: { lang } }));
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pa" : "en");
  };

  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e.detail?.lang && (e.detail.lang === "en" || e.detail.lang === "pa")) {
        setLanguageState(e.detail.lang);
      }
    };
    window.addEventListener("webnoura_admin_lang_change", handleLangChange);
    return () => window.removeEventListener("webnoura_admin_lang_change", handleLangChange);
  }, []);

  return (
    <AdminLanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  );
}

export const useAdminLanguage = () => useContext(AdminLanguageContext);
