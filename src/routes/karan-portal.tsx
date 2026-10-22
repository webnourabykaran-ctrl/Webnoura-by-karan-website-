import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { adminStore } from "@/lib/adminStore";
import { analyticsTracker } from "@/lib/analytics";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { AnalyticsTab } from "@/components/admin/tabs/AnalyticsTab";
import { EnquiriesTab } from "@/components/admin/tabs/EnquiriesTab";
import { ProjectTrackerTab } from "@/components/admin/tabs/ProjectTrackerTab";
import { CouponsTab } from "@/components/admin/tabs/CouponsTab";
import { TriggersLogTab } from "@/components/admin/tabs/TriggersLogTab";
import { TestimonialsTab } from "@/components/admin/tabs/TestimonialsTab";
import { PortfolioTab } from "@/components/admin/tabs/PortfolioTab";
import { ServicesTab } from "@/components/admin/tabs/ServicesTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";
import { AddLeadModal } from "@/components/admin/AddLeadModal";
import {
  AdminEnquiry,
  AdminProject,
  AdminService,
  SiteSettings,
  AnalyticsData,
  ActiveProject,
  PromoCoupon,
  TriggerLog,
  ClientTestimonial,
} from "@/types/admin";

export const Route = createFileRoute("/karan-portal")({
  head: () => ({
    meta: [
      { title: "WebNoura Admin Console | Managed by Karan" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Data states
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(adminStore.getSettings());
  const [analytics, setAnalytics] = useState<AnalyticsData>(analyticsTracker.getAnalytics());
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [coupons, setCoupons] = useState<PromoCoupon[]>([]);
  const [triggers, setTriggers] = useState<TriggerLog[]>([]);
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>([]);

  const reloadData = () => {
    setEnquiries(adminStore.getEnquiries());
    setProjects(adminStore.getProjects());
    setServices(adminStore.getServices());
    setSettings(adminStore.getSettings());
    setAnalytics(analyticsTracker.getAnalytics());
    setActiveProjects(adminStore.getActiveProjects());
    setCoupons(adminStore.getCoupons());
    setTriggers(adminStore.getTriggersLog());
    setTestimonials(adminStore.getTestimonials());
  };

  useEffect(() => {
    setMounted(true);
    adminStore.checkAndMigrateStore();
    setAuthed(adminStore.isAuthenticated());
    reloadData();

    const handleStoreChange = () => {
      reloadData();
      setAuthed(adminStore.isAuthenticated());
    };

    const handleAnalyticsChange = () => {
      setAnalytics(analyticsTracker.getAnalytics());
    };

    window.addEventListener("webnoura_store_change", handleStoreChange);
    window.addEventListener("webnoura_analytics_change", handleAnalyticsChange);
    return () => {
      window.removeEventListener("webnoura_store_change", handleStoreChange);
      window.removeEventListener("webnoura_analytics_change", handleAnalyticsChange);
    };
  }, []);

  const handleRefresh = async () => {
    setSyncing(true);
    await adminStore.syncFromSupabase();
    reloadData();
    setTimeout(() => setSyncing(false), 600);
  };

  if (!mounted || !authed) {
    return <AdminAuthGate onSuccess={() => setAuthed(true)} />;
  }

  const unreadCount = enquiries.filter((e) => e.status === "new").length;

  const tabTitles: Record<AdminTab, string> = {
    overview: "Studio Dashboard & Metrics",
    analytics: "Website Visitors & Click Analytics",
    enquiries: "Client Enquiries & CRM",
    project_tracker: "Active Projects Production Pipeline",
    coupons: "Promo Codes & Discount Manager",
    triggers_log: "Automated Email & WhatsApp Triggers",
    testimonials: "Testimonials & Reviews Showcase",
    portfolio: "Portfolio Showcase",
    services: "Services & Pricing Packages",
    settings: "Site Settings & Security Mode",
  };

  return (
    <div className="min-h-screen bg-[#061833] text-[#F8F9FA] selection:bg-[#3B82F6] selection:text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        onLogout={() => {
          adminStore.logout();
          setAuthed(false);
        }}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <AdminHeader
          title={tabTitles[activeTab]}
          onOpenSidebar={() => setSidebarOpen(true)}
          onRefresh={handleRefresh}
          onAddNewLead={() => setIsAddLeadOpen(true)}
          syncing={syncing}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              enquiries={enquiries}
              analytics={analytics}
              setActiveTab={setActiveTab}
              onOpenEnquiry={(enq) => {
                setSelectedEnquiry(enq);
                setActiveTab("enquiries");
              }}
              onAddNewLead={() => setIsAddLeadOpen(true)}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab analytics={analytics} onRefresh={handleRefresh} />
          )}

          {activeTab === "enquiries" && (
            <EnquiriesTab
              enquiries={enquiries}
              selectedEnquiry={selectedEnquiry}
              onSelectEnquiry={setSelectedEnquiry}
              onAddNewLead={() => setIsAddLeadOpen(true)}
              onRefresh={reloadData}
            />
          )}

          {activeTab === "project_tracker" && (
            <ProjectTrackerTab projects={activeProjects} onRefresh={reloadData} />
          )}

          {activeTab === "coupons" && (
            <CouponsTab coupons={coupons} onRefresh={reloadData} />
          )}

          {activeTab === "triggers_log" && (
            <TriggersLogTab logs={triggers} onRefresh={reloadData} />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsTab testimonials={testimonials} onRefresh={reloadData} />
          )}

          {activeTab === "portfolio" && (
            <PortfolioTab projects={projects} onRefresh={reloadData} />
          )}

          {activeTab === "services" && (
            <ServicesTab services={services} onRefresh={reloadData} />
          )}

          {activeTab === "settings" && (
            <SettingsTab settings={settings} onRefresh={reloadData} />
          )}
        </main>

        <footer className="border-t border-[#1E4378] bg-[#061833] py-6 px-4 md:px-8 text-center text-xs text-[#94A3B8]">
          <p>© 2026 WebNoura by Karan. Admin Command Center · All systems operational.</p>
        </footer>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onSuccess={reloadData}
      />
    </div>
  );
}
