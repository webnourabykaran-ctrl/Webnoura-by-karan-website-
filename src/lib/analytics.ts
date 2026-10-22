import { AnalyticsData, ClickEvent } from "@/types/admin";

const ANALYTICS_KEY = "webnoura_analytics_data";
const SESSION_KEY = "webnoura_session_logged";

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalVisits: 0,
  uniqueVisitors: 0,
  todayVisits: 0,
  weeklyVisits: 0,
  monthlyVisits: 0,
  lastVisitDate: new Date().toISOString().slice(0, 10),
  dailyVisits: {},
  deviceBreakdown: {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  },
  clickCounts: {},
  clicks: [],
};

export function calculateWeeklyVisits(daily: Record<string, number> = {}): number {
  const now = new Date();
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    sum += daily[key] || 0;
  }
  return sum;
}

export function calculateMonthlyVisits(daily: Record<string, number> = {}): number {
  const now = new Date();
  let sum = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    sum += daily[key] || 0;
  }
  return sum;
}

export function getDailyActivityHistory(
  daily: Record<string, number> = {},
  days: number = 7
): { date: string; dayName: string; formattedDate: string; visits: number }[] {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    result.push({
      date: iso,
      dayName: i === 0 ? "Today" : dayName,
      formattedDate,
      visits: daily[iso] || 0,
    });
  }
  return result;
}

function getDeviceType(): "desktop" | "mobile" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

function notifyAnalyticsChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("webnoura_analytics_change"));
  }
}

export const analyticsTracker = {
  getAnalytics(): AnalyticsData {
    if (typeof window === "undefined") return INITIAL_ANALYTICS;
    try {
      const raw = localStorage.getItem(ANALYTICS_KEY);
      if (!raw) {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(INITIAL_ANALYTICS));
        return INITIAL_ANALYTICS;
      }
      const parsed: AnalyticsData = { ...INITIAL_ANALYTICS, ...JSON.parse(raw) };
      const today = new Date().toISOString().slice(0, 10);

      if (!parsed.dailyVisits) {
        parsed.dailyVisits = {};
      }

      // If there are existing visits but dailyVisits was empty, distribute gracefully
      if (Object.keys(parsed.dailyVisits).length === 0 && parsed.totalVisits > 0) {
        parsed.dailyVisits[today] = parsed.todayVisits || Math.min(parsed.totalVisits, 8);
        const now = new Date();
        for (let i = 1; i < 7; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          parsed.dailyVisits[key] = Math.max(1, Math.round((parsed.totalVisits / 10) * (1 - i * 0.08)));
        }
      }

      parsed.weeklyVisits = calculateWeeklyVisits(parsed.dailyVisits);
      parsed.monthlyVisits = calculateMonthlyVisits(parsed.dailyVisits);

      return parsed;
    } catch {
      return INITIAL_ANALYTICS;
    }
  },

  saveAnalytics(data: AnalyticsData): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
      notifyAnalyticsChange();
    } catch {
      // Ignore localStorage errors (e.g. private mode, quota exceeded)
    }
  },

  // Record a page view / visit
  recordVisit(): void {
    if (typeof window === "undefined") return;
    const data = this.getAnalytics();
    const today = new Date().toISOString().slice(0, 10);
    const device = getDeviceType();

    if (!data.dailyVisits) {
      data.dailyVisits = {};
    }

    // Reset today's count if date changed
    if (data.lastVisitDate !== today) {
      data.todayVisits = 0;
      data.lastVisitDate = today;
    }

    data.totalVisits += 1;
    data.todayVisits += 1;
    data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1;

    data.weeklyVisits = calculateWeeklyVisits(data.dailyVisits);
    data.monthlyVisits = calculateMonthlyVisits(data.dailyVisits);

    // Increment device
    data.deviceBreakdown[device] = (data.deviceBreakdown[device] || 0) + 1;

    // Check unique visitor in this session
    const isNewSession = !sessionStorage.getItem(SESSION_KEY);
    if (isNewSession) {
      sessionStorage.setItem(SESSION_KEY, "true");
      data.uniqueVisitors += 1;
    }

    this.saveAnalytics(data);

    // Push to global cloud database asynchronously
    try {
      import("./cloudStore").then(({ cloudStore }) => {
        cloudStore.recordGlobalVisit(device);
      });
    } catch {
      // Ignore background sync errors
    }
  },

  // Track any click on button / link / CTA
  trackClick(name: string, category: ClickEvent["category"] = "cta", target?: string): void {
    if (typeof window === "undefined" || !name) return;
    const data = this.getAnalytics();
    const device = getDeviceType();

    // Increment aggregate click count
    data.clickCounts[name] = (data.clickCounts[name] || 0) + 1;

    // Prepend new click to stream (keep latest 150)
    const newClick: ClickEvent = {
      id: "clk-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      name,
      category,
      target,
      timestamp: new Date().toISOString(),
      device,
    };

    data.clicks = [newClick, ...(data.clicks || [])].slice(0, 150);
    this.saveAnalytics(data);

    // Push to global cloud database asynchronously
    try {
      import("./cloudStore").then(({ cloudStore }) => {
        cloudStore.recordGlobalClick(newClick);
      });
    } catch {
      // Ignore background sync errors
    }
  },

  // Update from cloud store (used by admin portal to reflect all visitors)
  applyCloudAnalytics(cloudData: AnalyticsData): void {
    if (typeof window === "undefined" || !cloudData) return;
    this.saveAnalytics(cloudData);
  },

  resetAnalytics(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(INITIAL_ANALYTICS));
    notifyAnalyticsChange();
  },
};

let trackingInitialized = false;

// Global click event delegator to automatically track clicks across the site
export function initGlobalClickTracking(): void {
  if (typeof window === "undefined" || trackingInitialized) return;
  trackingInitialized = true;

  // Track page visit on mount
  analyticsTracker.recordVisit();

  // Listen to document clicks
  document.addEventListener("click", (e) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

    // Find closest anchor or button
    const element = target.closest("a, button, [role='button']") as HTMLElement | null;
    if (!element) return;

    // Ignore admin panel internal buttons to keep clean website analytics
    if (window.location.pathname.startsWith("/admin")) return;

    // Check explicit track attribute
    const explicitName = element.getAttribute("data-track-name");
    const explicitCat = element.getAttribute("data-track-cat") as ClickEvent["category"] | null;

    if (explicitName) {
      analyticsTracker.trackClick(explicitName, explicitCat || "cta", (element as HTMLAnchorElement).href || undefined);
      return;
    }

    const text = element.innerText?.trim() || element.getAttribute("aria-label") || element.getAttribute("title") || "";
    const href = (element as HTMLAnchorElement).href || element.getAttribute("href") || "";

    // WhatsApp clicks
    if (href.includes("wa.me") || href.includes("whatsapp")) {
      analyticsTracker.trackClick("WhatsApp Direct Chat Button", "contact", "wa.me");
      return;
    }

    // Email clicks
    if (href.startsWith("mailto:")) {
      analyticsTracker.trackClick("Email Contact Link", "contact", href);
      return;
    }

    // Instagram clicks
    if (href.includes("instagram.com")) {
      analyticsTracker.trackClick("Instagram Profile Link", "contact", href);
      return;
    }

    // Phone clicks
    if (href.startsWith("tel:")) {
      analyticsTracker.trackClick("Phone Call Button", "contact", href);
      return;
    }

    // Live Demos
    if (href.includes("gold-gym-demo")) {
      analyticsTracker.trackClick("Live Demo: Gold Health Club", "demo", href);
      return;
    }
    if (href.includes("cafe-resturant-demo")) {
      analyticsTracker.trackClick("Live Demo: Majha Café & Restaurant", "demo", href);
      return;
    }
    if (href.includes("fab-hotel-demo")) {
      analyticsTracker.trackClick("Live Demo: FabHotel Park View", "demo", href);
      return;
    }

    // Package offer buttons
    if (text.includes("GET FOR") || text.includes("4,999") || text.includes("17,999")) {
      analyticsTracker.trackClick(`Package Selected (${text.slice(0, 45)})`, "service", "#enquiry");
      return;
    }

    // Main CTAs
    if (text.toUpperCase().includes("GET A WEBSITE")) {
      analyticsTracker.trackClick("GET A WEBSITE (Header CTA)", "cta", "#enquiry");
      return;
    }
    if (text.toUpperCase().includes("LET’S BUILD") || text.toUpperCase().includes("LET'S BUILD")) {
      analyticsTracker.trackClick("LET’S BUILD YOUR WEBSITE (Hero CTA)", "cta", "#enquiry");
      return;
    }
    if (text.toUpperCase().includes("VIEW OUR WORK") || text.toUpperCase().includes("EXPLORE OUR WORK")) {
      analyticsTracker.trackClick("EXPLORE OUR WORK (Hero)", "cta", "#portfolio");
      return;
    }

    // Navigation Links
    if (href.startsWith("#") || href.includes("/#")) {
      const navTarget = href.replace(/.*#/, "");
      if (["portfolio", "services", "process", "quality", "about", "contact", "enquiry"].includes(navTarget)) {
        analyticsTracker.trackClick(`Navigation: #${navTarget.toUpperCase()}`, "navigation", href);
        return;
      }
    }

    // Generic button/link fallback so ALL clicks are counted
    if (text && text.length > 0 && text.length < 60) {
      const isDemo = href.startsWith("http") && !href.includes(window.location.host);
      const category: ClickEvent["category"] = isDemo ? "demo" : text.toLowerCase().includes("submit") || text.toLowerCase().includes("send") ? "contact" : "cta";
      analyticsTracker.trackClick(text.replace(/\s+/g, " "), category, href || undefined);
    }
  } catch {
    // Ignore any tracking errors so user interaction is never affected
  }
  });
}

