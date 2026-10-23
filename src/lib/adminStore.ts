import {
  AdminEnquiry,
  AdminProject,
  AdminService,
  SiteSettings,
  EnquiryStatus,
  ActiveProject,
  ProjectStage,
  PromoCoupon,
  TriggerLog,
  ClientTestimonial,
  AdminInvoice,
} from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { analyticsTracker } from "./analytics";

const ENQUIRIES_KEY = "webnoura_admin_enquiries";
const PROJECTS_KEY = "webnoura_admin_projects";
const SERVICES_KEY = "webnoura_admin_services";
const SETTINGS_KEY = "webnoura_admin_settings";
const AUTH_KEY = "webnoura_karan_admin_session";
const ACTIVE_PROJECTS_KEY = "webnoura_admin_active_projects";
const INVOICES_KEY = "webnoura_admin_invoices";
const COUPONS_KEY = "webnoura_admin_coupons";
const TRIGGERS_KEY = "webnoura_admin_triggers";
const TESTIMONIALS_KEY = "webnoura_admin_testimonials";
const STORE_VERSION_KEY = "webnoura_store_version";
export const CURRENT_STORE_VERSION = "2026_v7_secure_auth";

// Automatically clear any old persistent logins from previous sessions
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("webnoura_admin_authenticated");
  } catch {}
}

export const INITIAL_ENQUIRIES: AdminEnquiry[] = [];

export const INITIAL_PROJECTS: AdminProject[] = [
  {
    id: "proj-01",
    name: "GOLD HEALTH CLUB",
    cat: "Fitness Website",
    url: "gold-gym-demo-website.vercel.app",
    liveUrl: "https://gold-gym-demo-website.vercel.app",
    isLive: true,
    d: "A bold, premium fitness club website featuring gym training zones, commercial biomechanics equipment, membership enquiries, and real local club credentials.",
    img: "/mock-gym.jpg",
    mobileImg: "/mock-gym.jpg",
    featured: true,
    order: 1,
  },
  {
    id: "proj-02",
    name: "MAJHA CAFÉ & RESTAURANT",
    cat: "Restaurant & Café Website",
    url: "cafe-resturant-demo-website.vercel.app",
    liveUrl: "https://cafe-resturant-demo-website.vercel.app",
    isLive: true,
    d: "Cinematic dining photography, specialty coffee & morning bakery menus, chef signature dishes, and table reservation links built to turn casual visitors into guests.",
    img: "/mock-restaurant.jpg",
    mobileImg: "/mock-restaurant.jpg",
    featured: true,
    order: 2,
  },
  {
    id: "proj-03",
    name: "WEBNOURA CREATIVE STUDIO",
    cat: "Portfolio & Agency Website",
    url: "webnoura.com",
    liveUrl: "/#home",
    isLive: true,
    d: "Our official WebNoura design studio website featuring Deep Navy aesthetics, responsive interactive showcases, modern typography, and a conversion-focused client enquiry system.",
    img: "/mock-portfolio.jpg",
    mobileImg: "/mock-portfolio.jpg",
    featured: true,
    order: 3,
  },
  {
    id: "proj-04",
    name: "FABHOTEL PARK VIEW",
    cat: "Business & Hotel Website",
    url: "fab-hotel-demo-website.vercel.app",
    liveUrl: "https://fab-hotel-demo-website.vercel.app",
    isLive: true,
    d: "A refined 3-star hospitality website featuring deluxe room previews, private washroom showcases, verified amenities, direct call booking, and interactive location navigation.",
    img: "/mock-business.jpg",
    mobileImg: "/mock-business.jpg",
    featured: true,
    order: 4,
  },
];

export function formatPriceDisplay(price?: string, fallback = "₹4,999"): string {
  if (!price) return fallback;
  const cleaned = price.trim();
  if (cleaned.startsWith("₹")) return cleaned;
  const num = parseInt(cleaned.replace(/\D/g, ""), 10);
  if (!isNaN(num)) {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return cleaned;
}

export const INITIAL_SERVICES: AdminService[] = [
  {
    id: "srv-01",
    num: "01",
    title: "BUSINESS & HOTEL WEBSITES",
    desc: "Modern, high-converting websites for businesses, hotels, and hospitality brands featuring room showcases, service highlights, direct enquiry options, and location details.",
    href: "https://fab-hotel-demo-website.vercel.app",
    isLive: true,
    startingPrice: "4999",
    originalPrice: "17999",
    badge: "72% OFF",
  },
  {
    id: "srv-02",
    num: "02",
    title: "RESTAURANT & CAFÉ WEBSITES",
    desc: "Elegant restaurant & café websites with menu sections, food photography, location details, and reservation or enquiry links where needed.",
    href: "https://cafe-resturant-demo-website.vercel.app",
    isLive: true,
    startingPrice: "4999",
    originalPrice: "17999",
    badge: "72% OFF",
  },
  {
    id: "srv-03",
    num: "03",
    title: "GYM & FITNESS WEBSITES",
    desc: "Powerful fitness websites featuring gym facilities, training routines, membership enquiries, and high-impact visual design.",
    href: "https://gold-gym-demo-website.vercel.app",
    isLive: true,
    startingPrice: "4999",
    originalPrice: "17999",
    badge: "72% OFF",
  },
  {
    id: "srv-04",
    num: "04",
    title: "PORTFOLIO & LANDING PAGES",
    desc: "Modern personal portfolios, freelancer websites, creative agency showcases, and focused landing pages designed around a clear objective.",
    href: "/#home",
    isLive: true,
    startingPrice: "4999",
    originalPrice: "17999",
    badge: "72% OFF",
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  ownerName: "Karan",
  studioName: "WebNoura",
  tagline: "Creative Websites · Built with Purpose",
  email: "webnourabykaran@gmail.com",
  whatsapp: "+91 94637 37763",
  instagram: "https://www.instagram.com/webnoura.site?xtok=MWNhaTBoZ2NncXJxNA==",
  location: "Punjab, India",
  announcementActive: true,
  announcementText: "🚀 Special Offer: Premium Business Website at ₹4,999 · Limited Slots",
  acceptingClients: true,
  adminUsername: "karan_admin",
  adminPassword: "Karan#WebNoura2026!$",
  adminPin: "2026",
  websiteOnline: true,
  maintenanceMessage: "We are currently upgrading WebNoura with exciting new demo concepts and limited-time offer packages. We will be back online shortly!",
};

export const INITIAL_ACTIVE_PROJECTS: ActiveProject[] = [];

export const INITIAL_INVOICES: AdminInvoice[] = [
  {
    id: "inv-demo-crown",
    invoice_number: "WN-2026-003",
    client_name: "Harpreet Singh (Executive Director)",
    client_business: "Royal Crown Luxury Hotel & Banquet",
    client_email: "royalcrown.amritsar@gmail.com",
    client_phone: "+91 98888 12345",
    client_address: "GT Road, Near Golden Temple Corridor, Amritsar, Punjab - 143001",
    client_gst: "03AABCR1234F1Z9",
    issue_date: "2026-10-23",
    due_date: "2026-10-30",
    items: [
      {
        id: "itm-demo-01",
        description: "Luxury Hotel & Banquet Premium Website (Room Suite Showcase, Table & Event Booking System, Virtual Tour)",
        quantity: 1,
        rate: 7999,
        amount: 7999,
      },
      {
        id: "itm-demo-02",
        description: "High-Speed Cloud Hosting, Global CDN, SSL Setup & Custom Domain Configuration (1 Year)",
        quantity: 1,
        rate: 1499,
        amount: 1499,
      },
      {
        id: "itm-demo-03",
        description: "Google Business Profile, Google Maps Verification & Local SEO Optimization (Amritsar)",
        quantity: 1,
        rate: 1999,
        amount: 1999,
      },
    ],
    subtotal: 11497,
    discount_amount: 1498,
    tax_amount: 1800,
    total_amount: 11799,
    amount_paid: 6000,
    balance_due: 5799,
    payment_status: "partial",
    payment_method: "upi",
    transaction_id: "UPI/629104810283",
    paid_date: "2026-10-23",
    notes: "₹6,000 advance received via PhonePe/UPI. Remaining balance of ₹5,799 payable upon final domain deployment and client review.",
    terms: "1. 1-Year High-Speed Cloud Hosting, Free SSL & 30-Day Post-Launch Technical Support included.\n2. Full source code, CMS login credentials and domain ownership handed over upon balance clearance.",
    created_at: "2026-10-23T10:00:00.000Z",
    updated_at: "2026-10-23T10:00:00.000Z",
  },
  {
    id: "inv-01",
    invoice_number: "WN-2026-001",
    client_name: "Gurpreet Singh",
    client_business: "Majha Café & Restaurant",
    client_email: "majha.cafe@gmail.com",
    client_phone: "+91 98765 43210",
    client_address: "Mall Road, Amritsar, Punjab",
    issue_date: "2026-10-18",
    due_date: "2026-10-25",
    items: [
      {
        id: "itm-01",
        description: "Restaurant & Café Website Development (Digital Food Menu, Reservation Links, Cinematic Dining Showcase)",
        quantity: 1,
        rate: 4999,
        amount: 4999,
      },
      {
        id: "itm-02",
        description: "High-Speed Cloud Hosting Setup, Domain Integration & Free SSL Certificate (1 Year)",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],
    subtotal: 4999,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 4999,
    amount_paid: 2500,
    balance_due: 2499,
    payment_status: "partial",
    payment_method: "upi",
    transaction_id: "UPI/529182049182",
    paid_date: "2026-10-18",
    notes: "50% advance received. Remaining balance of ₹2,499 payable upon final launch on custom domain.",
    terms: "1. 1-year free hosting, support and SSL included. 2. Final domain handover after balance payment.",
    created_at: "2026-10-18T10:00:00.000Z",
    updated_at: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "inv-02",
    invoice_number: "WN-2026-002",
    client_name: "Rajesh Sharma",
    client_business: "Gold Health Club & Gym",
    client_email: "goldgym.pb@gmail.com",
    client_phone: "+91 94172 88391",
    client_address: "Model Town, Jalandhar, Punjab",
    issue_date: "2026-10-15",
    due_date: "2026-10-22",
    items: [
      {
        id: "itm-03",
        description: "Gym & Fitness Club Premium Website (Training Zones, Equipment Showcase, Lead Enquiry Form)",
        quantity: 1,
        rate: 4999,
        amount: 4999,
      },
    ],
    subtotal: 4999,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 4999,
    amount_paid: 4999,
    balance_due: 0,
    payment_status: "paid",
    payment_method: "upi",
    transaction_id: "UPI/839104819201",
    paid_date: "2026-10-15",
    notes: "Full payment received with thanks. Project completed and deployed live on Vercel.",
    terms: "1. 1-year maintenance support included.",
    created_at: "2026-10-15T12:30:00.000Z",
    updated_at: "2026-10-15T12:30:00.000Z",
  },
];

export const INITIAL_COUPONS: PromoCoupon[] = [];

export const INITIAL_TRIGGERS: TriggerLog[] = [];

export const INITIAL_TESTIMONIALS: ClientTestimonial[] = [];

// Event notification helper
const notifyStoreUpdate = (topic: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("webnoura_store_change", { detail: { topic } }));
  }
};

export const adminStore = {
  // --- AUTHENTICATION ---
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(AUTH_KEY) === "true";
  },

  authenticate(username: string, password?: string): boolean {
    const settings = this.getSettings();
    const targetUser = (settings.adminUsername || DEFAULT_SETTINGS.adminUsername).trim();
    const targetPass = (settings.adminPassword || DEFAULT_SETTINGS.adminPassword).trim();

    const userMatch = username.trim().toLowerCase() === targetUser.toLowerCase();
    const passMatch = password ? password.trim() === targetPass : false;

    if (userMatch && passMatch) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_KEY, "true");
        notifyStoreUpdate("auth");
      }
      return true;
    }
    return false;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem("webnoura_admin_authenticated");
      notifyStoreUpdate("auth");
    }
  },

  // --- ENQUIRIES CRM ---
  getEnquiries(): AdminEnquiry[] {
    if (typeof window === "undefined") return INITIAL_ENQUIRIES;
    try {
      const raw = localStorage.getItem(ENQUIRIES_KEY);
      if (!raw) {
        localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(INITIAL_ENQUIRIES));
        return INITIAL_ENQUIRIES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_ENQUIRIES;
    }
  },

  saveEnquiries(list: AdminEnquiry[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(list));
    notifyStoreUpdate("enquiries");
  },

  addEnquiry(item: Omit<AdminEnquiry, "id" | "created_at" | "status">): AdminEnquiry {
    const list = this.getEnquiries();
    const newEntry: AdminEnquiry = {
      ...item,
      id: "enq-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      created_at: new Date().toISOString(),
      status: "new",
      starred: false,
    };
    const updated = [newEntry, ...list];
    this.saveEnquiries(updated);

    // Auto trigger notification log
    this.addTriggerLog({
      event: "enquiry_received",
      channel: "whatsapp",
      recipient_name: "Karan (Admin)",
      recipient_contact: this.getSettings().whatsapp,
      subject_or_preview: `New enquiry received from ${newEntry.name} (${newEntry.business_name || newEntry.website_type}).`,
      status: "delivered",
    });

    // Push enquiry to live cloud database immediately
    try {
      import("./cloudStore").then(({ cloudStore }) => {
        cloudStore.recordGlobalEnquiry(newEntry);
      });
    } catch {
      // Ignore background sync errors
    }

    return newEntry;
  },

  updateEnquiry(id: string, updates: Partial<AdminEnquiry>): AdminEnquiry | null {
    const list = this.getEnquiries();
    const idx = list.findIndex((e) => e.id === id);
    const existing = list[idx];
    if (idx === -1 || !existing) return null;
    const updated: AdminEnquiry = { ...existing, ...updates };
    list[idx] = updated;
    this.saveEnquiries(list);
    return updated;
  },

  updateEnquiryStatus(id: string, status: EnquiryStatus): void {
    this.updateEnquiry(id, { status });
  },

  toggleEnquiryStar(id: string): void {
    const list = this.getEnquiries();
    const item = list.find((e) => e.id === id);
    if (item) {
      item.starred = !item.starred;
      this.saveEnquiries(list);
    }
  },

  toggleStarEnquiry(id: string): void {
    this.toggleEnquiryStar(id);
  },

  deleteEnquiry(id: string): void {
    const list = this.getEnquiries().filter((e) => e.id !== id);
    this.saveEnquiries(list);
  },

  // --- PORTFOLIO WORKS ---
  getProjects(): AdminProject[] {
    if (typeof window === "undefined") return INITIAL_PROJECTS;
    try {
      const raw = localStorage.getItem(PROJECTS_KEY);
      if (!raw) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(list: AdminProject[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    notifyStoreUpdate("projects");
  },

  addProject(project: Omit<AdminProject, "id" | "order">): AdminProject {
    const list = this.getProjects();
    const newEntry: AdminProject = {
      ...project,
      id: "proj-" + Date.now().toString(36),
      order: list.length + 1,
    };
    this.saveProjects([...list, newEntry]);
    return newEntry;
  },

  updateProject(id: string, updates: Partial<AdminProject>): AdminProject | null {
    const list = this.getProjects();
    const idx = list.findIndex((p) => p.id === id);
    const existing = list[idx];
    if (idx === -1 || !existing) return null;
    const updated: AdminProject = { ...existing, ...updates };
    list[idx] = updated;
    this.saveProjects(list);
    return updated;
  },

  deleteProject(id: string): void {
    const list = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(list);
  },

  // --- SERVICES & PRICING PACKAGES ---
  getServices(): AdminService[] {
    if (typeof window === "undefined") return INITIAL_SERVICES;
    try {
      const raw = localStorage.getItem(SERVICES_KEY);
      if (!raw) {
        localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
        return INITIAL_SERVICES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_SERVICES;
    }
  },

  saveServices(list: AdminService[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(SERVICES_KEY, JSON.stringify(list));
    notifyStoreUpdate("services");
  },

  updateService(id: string, updates: Partial<AdminService>): AdminService | null {
    const list = this.getServices();
    const idx = list.findIndex((s) => s.id === id);
    const existing = list[idx];
    if (idx === -1 || !existing) return null;
    const updated: AdminService = { ...existing, ...updates };
    list[idx] = updated;
    this.saveServices(list);
    return updated;
  },

  addService(service: Omit<AdminService, "id">): AdminService {
    const list = this.getServices();
    const newEntry: AdminService = {
      ...service,
      id: "srv-" + Date.now().toString(36),
    };
    this.saveServices([...list, newEntry]);
    return newEntry;
  },

  deleteService(id: string): void {
    const list = this.getServices().filter((s) => s.id !== id);
    this.saveServices(list);
  },

  // --- ACTIVE PROJECTS TRACKER ---
  getActiveProjects(): ActiveProject[] {
    if (typeof window === "undefined") return INITIAL_ACTIVE_PROJECTS;
    try {
      const raw = localStorage.getItem(ACTIVE_PROJECTS_KEY);
      if (!raw) {
        localStorage.setItem(ACTIVE_PROJECTS_KEY, JSON.stringify(INITIAL_ACTIVE_PROJECTS));
        return INITIAL_ACTIVE_PROJECTS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_ACTIVE_PROJECTS;
    }
  },

  saveActiveProjects(list: ActiveProject[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_PROJECTS_KEY, JSON.stringify(list));
    notifyStoreUpdate("active_projects");
  },

  addActiveProject(project: Omit<ActiveProject, "id">): ActiveProject {
    const list = this.getActiveProjects();
    const newEntry: ActiveProject = {
      ...project,
      id: "proj-act-" + Date.now().toString(36),
    };
    this.saveActiveProjects([newEntry, ...list]);

    this.addTriggerLog({
      event: "project_stage_update",
      channel: "whatsapp",
      recipient_name: newEntry.client_name,
      recipient_contact: newEntry.client_phone || newEntry.client_email,
      subject_or_preview: `Project onboarded! Stage: ${newEntry.stage.toUpperCase()} (${newEntry.progress}% completed).`,
      status: "delivered",
    });

    return newEntry;
  },

  updateProjectStage(id: string, stage: ProjectStage, progress?: number): void {
    const list = this.getActiveProjects();
    const idx = list.findIndex((p) => p.id === id);
    const item = list[idx];
    if (idx !== -1 && item) {
      item.stage = stage;
      if (progress !== undefined) {
        item.progress = progress;
      } else {
        const defaultProgress: Record<ProjectStage, number> = {
          requirements: 15,
          design: 35,
          development: 65,
          testing: 85,
          deployed: 100,
        };
        item.progress = defaultProgress[stage] || item.progress;
      }
      this.saveActiveProjects(list);

      this.addTriggerLog({
        event: "project_stage_update",
        channel: "whatsapp",
        recipient_name: item.client_name,
        recipient_contact: item.client_phone || item.client_email,
        subject_or_preview: `Stage Update: Your website moved to ${stage.toUpperCase()} (${item.progress}% progress).`,
        status: "delivered",
      });
    }
  },

  updateActiveProject(id: string, updates: Partial<ActiveProject>): void {
    const list = this.getActiveProjects();
    const idx = list.findIndex((p) => p.id === id);
    const existing = list[idx];
    if (idx !== -1 && existing) {
      list[idx] = { ...existing, ...updates };
      this.saveActiveProjects(list);
    }
  },

  deleteActiveProject(id: string): void {
    const list = this.getActiveProjects().filter((p) => p.id !== id);
    this.saveActiveProjects(list);
  },

  // --- INVOICES & CLIENT BILLING ---
  getInvoices(): AdminInvoice[] {
    if (typeof window === "undefined") return INITIAL_INVOICES;
    try {
      const raw = localStorage.getItem(INVOICES_KEY);
      if (!raw) {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
        return INITIAL_INVOICES;
      }
      const list: AdminInvoice[] = JSON.parse(raw);
      let updated = false;
      for (const demo of INITIAL_INVOICES) {
        if (!list.some((i) => i.invoice_number === demo.invoice_number)) {
          list.unshift(demo);
          updated = true;
        }
      }
      if (updated) {
        localStorage.setItem(INVOICES_KEY, JSON.stringify(list));
      }
      return list;
    } catch {
      return INITIAL_INVOICES;
    }
  },

  saveInvoices(list: AdminInvoice[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(INVOICES_KEY, JSON.stringify(list));
    notifyStoreUpdate("invoices");
  },

  addInvoice(invoice: Omit<AdminInvoice, "id" | "created_at" | "updated_at">): AdminInvoice {
    const list = this.getInvoices();
    const now = new Date().toISOString();
    const newEntry: AdminInvoice = {
      ...invoice,
      id: "inv-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      created_at: now,
      updated_at: now,
    };
    this.saveInvoices([newEntry, ...list]);

    // Push to live cloud database immediately
    try {
      import("./cloudStore").then(({ cloudStore }) => {
        cloudStore.recordGlobalInvoice(newEntry);
      });
    } catch {}

    // Add trigger log
    this.addTriggerLog({
      event: newEntry.payment_status === "paid" ? "payment_received" : "invoice_created",
      channel: "whatsapp",
      recipient_name: newEntry.client_name + (newEntry.client_business ? ` (${newEntry.client_business})` : ""),
      recipient_contact: newEntry.client_phone || newEntry.client_email || "Client",
      subject_or_preview: `Invoice ${newEntry.invoice_number} created for ${newEntry.client_business || newEntry.client_name} (Total: ₹${newEntry.total_amount.toLocaleString("en-IN")}, Paid: ₹${newEntry.amount_paid.toLocaleString("en-IN")}, Balance: ₹${newEntry.balance_due.toLocaleString("en-IN")}).`,
      status: "delivered",
    });

    return newEntry;
  },

  updateInvoice(id: string, updates: Partial<AdminInvoice>): AdminInvoice | null {
    const list = this.getInvoices();
    const idx = list.findIndex((i) => i.id === id);
    const existing = list[idx];
    if (idx === -1 || !existing) return null;
    const updated: AdminInvoice = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.saveInvoices(list);

    // Push updated invoice to cloud
    try {
      import("./cloudStore").then(({ cloudStore }) => {
        cloudStore.recordGlobalInvoice(updated);
      });
    } catch {}

    return updated;
  },

  deleteInvoice(id: string): void {
    const list = this.getInvoices().filter((i) => i.id !== id);
    this.saveInvoices(list);

    // Delete from cloud
    try {
      import("./cloudStore").then(({ cloudStore }) => {
        cloudStore.deleteGlobalInvoice(id);
      });
    } catch {}
  },

  // --- PROMO CODES & DISCOUNTS ---
  getCoupons(): PromoCoupon[] {
    if (typeof window === "undefined") return INITIAL_COUPONS;
    try {
      const raw = localStorage.getItem(COUPONS_KEY);
      if (!raw) {
        localStorage.setItem(COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
        return INITIAL_COUPONS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_COUPONS;
    }
  },

  saveCoupons(list: PromoCoupon[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(COUPONS_KEY, JSON.stringify(list));
    notifyStoreUpdate("coupons");
  },

  addCoupon(coupon: Omit<PromoCoupon, "id" | "used_count">): PromoCoupon {
    const list = this.getCoupons();
    const newEntry: PromoCoupon = {
      ...coupon,
      id: "cpn-" + Date.now().toString(36),
      used_count: 0,
    };
    this.saveCoupons([newEntry, ...list]);
    return newEntry;
  },

  toggleCoupon(id: string, active: boolean): void {
    const list = this.getCoupons();
    const idx = list.findIndex((c) => c.id === id);
    const item = list[idx];
    if (idx !== -1 && item) {
      item.active = active;
      this.saveCoupons(list);
    }
  },

  deleteCoupon(id: string): void {
    const list = this.getCoupons().filter((c) => c.id !== id);
    this.saveCoupons(list);
  },

  validateCoupon(code: string, currentAmount: number): { valid: boolean; discount: number; finalAmount: number; message: string; coupon?: PromoCoupon } {
    const cleanCode = code.trim().toUpperCase();
    const list = this.getCoupons();
    const found = list.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      return { valid: false, discount: 0, finalAmount: currentAmount, message: "Invalid or inactive promo code." };
    }

    if (new Date(found.expiry_date) < new Date()) {
      return { valid: false, discount: 0, finalAmount: currentAmount, message: "This promo code has expired." };
    }

    if (found.used_count >= found.max_uses) {
      return { valid: false, discount: 0, finalAmount: currentAmount, message: "Promo code usage limit reached." };
    }

    if (found.min_order_value && currentAmount < found.min_order_value) {
      return { valid: false, discount: 0, finalAmount: currentAmount, message: `Minimum order value ₹${found.min_order_value} required.` };
    }

    let discount = 0;
    if (found.discount_type === "percentage") {
      discount = Math.round((currentAmount * found.discount_value) / 100);
    } else {
      discount = found.discount_value;
    }

    discount = Math.min(discount, currentAmount);
    const finalAmount = Math.max(0, currentAmount - discount);

    return {
      valid: true,
      discount,
      finalAmount,
      message: `Coupon Applied: ${found.discount_type === "percentage" ? `${found.discount_value}% OFF` : `₹${found.discount_value} OFF`} (You save ₹${discount.toLocaleString("en-IN")})`,
      coupon: found,
    };
  },

  incrementCouponUsage(code: string): void {
    const list = this.getCoupons();
    const idx = list.findIndex((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    const item = list[idx];
    if (idx !== -1 && item) {
      item.used_count += 1;
      this.saveCoupons(list);
    }
  },

  // --- AUTOMATED NOTIFICATIONS & TRIGGERS LOG ---
  getTriggersLog(): TriggerLog[] {
    if (typeof window === "undefined") return INITIAL_TRIGGERS;
    try {
      const raw = localStorage.getItem(TRIGGERS_KEY);
      if (!raw) {
        localStorage.setItem(TRIGGERS_KEY, JSON.stringify(INITIAL_TRIGGERS));
        return INITIAL_TRIGGERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRIGGERS;
    }
  },

  saveTriggersLog(list: TriggerLog[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TRIGGERS_KEY, JSON.stringify(list));
    notifyStoreUpdate("triggers");
  },

  addTriggerLog(item: Omit<TriggerLog, "id" | "timestamp">): TriggerLog {
    const list = this.getTriggersLog();
    const newEntry: TriggerLog = {
      ...item,
      id: "trg-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      timestamp: new Date().toISOString(),
    };
    this.saveTriggersLog([newEntry, ...list].slice(0, 100)); // keep latest 100
    return newEntry;
  },

  clearTriggersLog(): void {
    this.saveTriggersLog([]);
  },

  // --- TESTIMONIALS & REVIEWS MANAGER ---
  getTestimonials(): ClientTestimonial[] {
    if (typeof window === "undefined") return INITIAL_TESTIMONIALS;
    try {
      const raw = localStorage.getItem(TESTIMONIALS_KEY);
      if (!raw) {
        localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
        return INITIAL_TESTIMONIALS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  },

  saveTestimonials(list: ClientTestimonial[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
    notifyStoreUpdate("testimonials");
  },

  addTestimonial(testimonial: Omit<ClientTestimonial, "id">): ClientTestimonial {
    const list = this.getTestimonials();
    const newEntry: ClientTestimonial = {
      ...testimonial,
      id: "tst-" + Date.now().toString(36),
    };
    this.saveTestimonials([newEntry, ...list]);
    return newEntry;
  },

  toggleTestimonialApproval(id: string, is_approved: boolean): void {
    const list = this.getTestimonials();
    const idx = list.findIndex((t) => t.id === id);
    const item = list[idx];
    if (idx !== -1 && item) {
      item.is_approved = is_approved;
      this.saveTestimonials(list);
    }
  },

  deleteTestimonial(id: string): void {
    const list = this.getTestimonials().filter((t) => t.id !== id);
    this.saveTestimonials(list);
  },

  // --- SITE SETTINGS & MAINTENANCE SWITCH ---
  getSettings(): SiteSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.adminUsername || !parsed.adminPassword) {
        parsed.adminUsername = DEFAULT_SETTINGS.adminUsername;
        parsed.adminPassword = DEFAULT_SETTINGS.adminPassword;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      if (!parsed.whatsapp || parsed.whatsapp.includes("98765")) {
        parsed.whatsapp = DEFAULT_SETTINGS.whatsapp;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      if (!parsed.announcementText || parsed.announcementText.includes("Contact Karan now!")) {
        parsed.announcementText = DEFAULT_SETTINGS.announcementText;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      if (!parsed.instagram || parsed.instagram.includes("webnoura.com_")) {
        parsed.instagram = DEFAULT_SETTINGS.instagram;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      notifyStoreUpdate("settings");
    }
    return updated;
  },

  toggleWebsiteOnline(online: boolean): void {
    this.saveSettings({ websiteOnline: online });
  },

  // --- COMPLETE SYSTEM RESTART & RESET ---
  resetAllData(): void {
    if (typeof window === "undefined") return;
    try {
      // Clear deprecated payment & invoice keys
      localStorage.removeItem("webnoura_admin_invoices");
      localStorage.removeItem("webnoura_payment_gateway");
      localStorage.removeItem("webnoura_analytics_data");
      localStorage.removeItem("webnoura_session_logged");

      // Reset all core collections to pristine baseline
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(INITIAL_ENQUIRIES));
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(ACTIVE_PROJECTS_KEY, JSON.stringify(INITIAL_ACTIVE_PROJECTS));
      localStorage.setItem(COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
      localStorage.setItem(TRIGGERS_KEY, JSON.stringify(INITIAL_TRIGGERS));
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
      localStorage.setItem(STORE_VERSION_KEY, CURRENT_STORE_VERSION);

      // Reset analytics to true zero
      analyticsTracker.resetAnalytics();
    } catch (e) {
      console.warn("Storage reset error:", e);
    }
    notifyStoreUpdate("reset");
  },

  async syncFromSupabase(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return 0;

      const current = this.getEnquiries();
      let added = 0;
      data.forEach((row: any) => {
        if (!current.some((c) => c.id === row.id)) {
          current.unshift({
            id: row.id || "enq-" + Date.now().toString(36),
            name: row.name || "Client",
            email: row.email || "",
            phone: row.phone || "",
            business_name: row.business_name || "",
            website_type: row.website_type || "Business website",
            pages: row.pages || "",
            budget: row.budget || "",
            details: row.details || "",
            created_at: row.created_at || new Date().toISOString(),
            status: "new",
            notes: row.notes || "",
            starred: false,
          });
          added++;
        }
      });
      if (added > 0) {
        this.saveEnquiries(current);
      }
      return added;
    } catch {
      return 0;
    }
  },

  /**
   * Syncs real-time data from the live GitHub cloud store (Gist)
   * Captures all visits, clicks, and enquiries submitted across all devices in real-time.
   */
  async syncFromCloud(): Promise<{ enquiriesAdded: number; totalVisits: number }> {
    try {
      const { cloudStore } = await import("./cloudStore");
      const cloud = await cloudStore.fetchCloudData();
      if (!cloud) return { enquiriesAdded: 0, totalVisits: 0 };

      // 1. Sync Enquiries
      let enquiriesAdded = 0;
      if (Array.isArray(cloud.enquiries) && cloud.enquiries.length > 0) {
        const localEnquiries = this.getEnquiries();
        const merged = [...localEnquiries];
        for (const remoteEnq of cloud.enquiries) {
          if (!merged.some((m) => m.id === remoteEnq.id || (m.email === remoteEnq.email && m.created_at === remoteEnq.created_at))) {
            merged.unshift(remoteEnq);
            enquiriesAdded++;
          }
        }
        if (enquiriesAdded > 0 || localEnquiries.length === 0) {
          this.saveEnquiries(merged);
        }
      }

      // 2. Sync Analytics
      if (cloud.analytics && typeof cloud.analytics === "object") {
        analyticsTracker.applyCloudAnalytics(cloud.analytics);
      }

      // 3. Sync Triggers
      if (Array.isArray(cloud.triggers) && cloud.triggers.length > 0) {
        const localTriggers = this.getTriggersLog();
        const mergedTriggers = [...localTriggers];
        for (const trg of cloud.triggers) {
          if (!mergedTriggers.some((m) => m.id === trg.id)) {
            mergedTriggers.unshift(trg);
          }
        }
        this.saveTriggersLog(mergedTriggers.slice(0, 100));
      }

      // 4. Sync Invoices
      if (Array.isArray(cloud.invoices) && cloud.invoices.length > 0) {
        const localInvoices = this.getInvoices();
        const mergedInvoices = [...localInvoices];
        let invoicesAddedOrUpdated = 0;
        for (const remoteInv of cloud.invoices) {
          const existingIdx = mergedInvoices.findIndex((i) => i.id === remoteInv.id || i.invoice_number === remoteInv.invoice_number);
          if (existingIdx === -1) {
            mergedInvoices.unshift(remoteInv);
            invoicesAddedOrUpdated++;
          } else {
            const local = mergedInvoices[existingIdx];
            if (new Date(remoteInv.updated_at) > new Date(local?.updated_at || 0)) {
              mergedInvoices[existingIdx] = remoteInv;
              invoicesAddedOrUpdated++;
            }
          }
        }
        if (invoicesAddedOrUpdated > 0 || localInvoices.length === 0) {
          this.saveInvoices(mergedInvoices);
        }
      }

      notifyStoreUpdate("cloud_sync");
      return {
        enquiriesAdded,
        totalVisits: cloud.analytics?.totalVisits || 0,
      };
    } catch (err) {
      console.warn("Cloud store sync error:", err);
      return { enquiriesAdded: 0, totalVisits: 0 };
    }
  },

  checkAndMigrateStore(): void {
    if (typeof window === "undefined") return;
    try {
      const storedVersion = localStorage.getItem(STORE_VERSION_KEY);
      if (storedVersion !== CURRENT_STORE_VERSION) {
        this.resetAllData();
      } else {
        if (!localStorage.getItem(INVOICES_KEY)) {
          localStorage.setItem(INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
        }
      }
    } catch (err) {
      console.warn("Store migration check error:", err);
    }
  },

  // --- EXPORT TOOLS ---
  exportEnquiriesToCSV(): void {
    const enquiries = this.getEnquiries();
    if (enquiries.length === 0) return;

    const headers = ["ID", "Name", "Email", "Phone", "Business Name", "Website Type", "Pages", "Budget", "Status", "Created At", "Details", "Notes"];
    const rows = enquiries.map((e) => [
      e.id,
      `"${(e.name || "").replace(/"/g, '""')}"`,
      `"${(e.email || "").replace(/"/g, '""')}"`,
      `"${(e.phone || "").replace(/"/g, '""')}"`,
      `"${(e.business_name || "").replace(/"/g, '""')}"`,
      `"${(e.website_type || "").replace(/"/g, '""')}"`,
      `"${(e.pages || "").replace(/"/g, '""')}"`,
      `"${(e.budget || "").replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${e.created_at}"`,
      `"${(e.details || "").replace(/"/g, '""')}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `webnoura_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportFullBackupJSON(): void {
    const data = {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      enquiries: this.getEnquiries(),
      projects: this.getProjects(),
      services: this.getServices(),
      activeProjects: this.getActiveProjects(),
      invoices: this.getInvoices(),
      coupons: this.getCoupons(),
      triggers: this.getTriggersLog(),
      testimonials: this.getTestimonials(),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `webnoura_complete_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  },
};
