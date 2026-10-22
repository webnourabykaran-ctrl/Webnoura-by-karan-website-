export type EnquiryStatus =
  | "new"
  | "contacted"
  | "in_discussion"
  | "proposal_sent"
  | "in_progress"
  | "completed"
  | "declined";

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | undefined;
  business_name: string;
  website_type: string;
  pages?: string | null | undefined;
  budget?: string | null | undefined;
  details: string;
  created_at: string;
  status: EnquiryStatus;
  notes?: string | undefined;
  starred?: boolean | undefined;
}

export interface AdminProject {
  id: string;
  name: string;
  cat: string;
  url: string;
  liveUrl: string;
  isLive: boolean;
  d: string;
  img: string;
  mobileImg?: string | undefined;
  featured?: boolean | undefined;
  order: number;
}

export interface AdminService {
  id: string;
  num: string;
  title: string;
  desc: string;
  href: string;
  isLive: boolean;
  startingPrice?: string | undefined;
  originalPrice?: string | undefined;
  badge?: string | undefined;
  iconName?: string | undefined;
}

export interface SiteSettings {
  ownerName: string;
  studioName: string;
  tagline: string;
  email: string;
  whatsapp: string;
  instagram: string;
  location: string;
  announcementActive: boolean;
  announcementText: string;
  acceptingClients: boolean;
  adminUsername: string;
  adminPassword: string;
  adminPin?: string | undefined;
  websiteOnline: boolean;
  maintenanceMessage?: string | undefined;
}

export interface ClickEvent {
  id: string;
  name: string;
  category: "cta" | "demo" | "contact" | "service" | "navigation";
  target?: string | undefined;
  timestamp: string;
  device: "desktop" | "mobile" | "tablet";
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  weeklyVisits?: number;
  monthlyVisits?: number;
  lastVisitDate: string;
  dailyVisits?: Record<string, number>; // date "YYYY-MM-DD" -> count
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  clicks: ClickEvent[];
  clickCounts: Record<string, number>;
}

// --- MODULES FOR PROJECTS, COUPONS, TRIGGERS & REVIEWS ---

export type ProjectStage =
  | "requirements"
  | "design"
  | "development"
  | "testing"
  | "deployed";

export interface ActiveProject {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string | undefined;
  business_name: string;
  project_title: string;
  package_name: string;
  stage: ProjectStage;
  progress: number;
  target_date: string;
  start_date: string;
  live_demo_url?: string | undefined;
  notes?: string | undefined;
  milestones: {
    title: string;
    completed: boolean;
    date?: string | undefined;
  }[];
}

export interface PromoCoupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value?: number;
  expiry_date: string;
  max_uses: number;
  used_count: number;
  active: boolean;
  description: string;
}

export interface TriggerLog {
  id: string;
  event: "enquiry_received" | "client_onboarded" | "project_stage_update" | "coupon_applied" | "custom_alert" | "visitor_action";
  channel: "whatsapp" | "email" | "sms" | "website";
  recipient_name: string;
  recipient_contact: string;
  subject_or_preview: string;
  status: "delivered" | "sent" | "failed" | "queued";
  timestamp: string;
}

export interface ClientTestimonial {
  id: string;
  client_name: string;
  role_or_business: string;
  rating: number;
  review_text: string;
  source: "google_review" | "whatsapp_feedback" | "direct_client";
  date: string;
  is_approved: boolean;
  avatar_url?: string;
}
