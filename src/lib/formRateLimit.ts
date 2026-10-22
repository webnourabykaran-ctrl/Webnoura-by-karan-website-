// Rate limiting module for website enquiry forms
// Prevents spam submissions by locking user for 1 hour after 2-3 repeated submissions

import { useState, useEffect } from "react";

const STORAGE_KEY = "webnoura_enquiry_ratelimit";
const COOLDOWN_DURATION_MS = 60 * 60 * 1000; // 1 hour in milliseconds
export const MAX_SUBMISSIONS_ALLOWED = 3; // 2-3 submissions allowed before 1-hour lockout

interface SubmissionEntry {
  email: string;
  phone?: string | undefined;
  name?: string | undefined;
  timestamp: number;
}

interface RateLimitStore {
  submissions: SubmissionEntry[];
  lockedEmails: Record<string, number>; // email -> lockUntil timestamp
  globalLockedUntil: number; // Device level lock
  lastLockedEmail?: string | undefined;
}

function getStore(): RateLimitStore {
  if (typeof window === "undefined") {
    return { submissions: [], lockedEmails: {}, globalLockedUntil: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { submissions: [], lockedEmails: {}, globalLockedUntil: 0 };
    const parsed = JSON.parse(raw);
    return {
      submissions: parsed.submissions || [],
      lockedEmails: parsed.lockedEmails || {},
      globalLockedUntil: parsed.globalLockedUntil || 0,
      lastLockedEmail: parsed.lastLockedEmail,
    };
  } catch {
    return { submissions: [], lockedEmails: {}, globalLockedUntil: 0 };
  }
}

function saveStore(store: RateLimitStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("webnoura_ratelimit_change"));
  } catch (e) {
    console.warn("Could not save rate limit store:", e);
  }
}

export interface LockedClientRecord {
  id: string;
  email: string;
  name?: string | undefined;
  phone?: string | undefined;
  lockUntil: number;
  remainingSeconds: number;
  formattedTime: string;
  attemptsCount: number;
  lockedAt?: number | undefined;
  isDeviceLock?: boolean | undefined;
}

export const formRateLimiter = {
  // Check if current user / email is currently locked
  isLocked(email?: string, phone?: string): { isLocked: boolean; remainingSeconds: number; formattedTime: string; attemptCount: number } {
    if (typeof window === "undefined") {
      return { isLocked: false, remainingSeconds: 0, formattedTime: "00:00", attemptCount: 0 };
    }

    const store = getStore();
    const now = Date.now();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");

    // 1. Check specific email lock
    if (cleanEmail && store.lockedEmails[cleanEmail] && store.lockedEmails[cleanEmail] > now) {
      const remainingSeconds = Math.max(0, Math.ceil((store.lockedEmails[cleanEmail] - now) / 1000));
      return {
        isLocked: true,
        remainingSeconds,
        formattedTime: this.formatTime(remainingSeconds),
        attemptCount: MAX_SUBMISSIONS_ALLOWED,
      };
    }

    // 2. Check global browser lock (if user just got locked)
    if (store.globalLockedUntil > now) {
      // If no email entered, or email matches the locked email
      if (!cleanEmail || store.lastLockedEmail === cleanEmail) {
        const remainingSeconds = Math.max(0, Math.ceil((store.globalLockedUntil - now) / 1000));
        return {
          isLocked: true,
          remainingSeconds,
          formattedTime: this.formatTime(remainingSeconds),
          attemptCount: MAX_SUBMISSIONS_ALLOWED,
        };
      }
    }

    // 3. Count recent submissions within the 1-hour window
    const activeSubmissions = store.submissions.filter((s) => now - s.timestamp < COOLDOWN_DURATION_MS);
    
    let attemptCount = 0;
    if (cleanEmail) {
      attemptCount = activeSubmissions.filter(
        (s) => s.email === cleanEmail || (cleanPhone && s.phone && s.phone === cleanPhone)
      ).length;

      // If already at or above max attempts, trigger lock
      if (attemptCount >= MAX_SUBMISSIONS_ALLOWED) {
        const lockUntil = now + COOLDOWN_DURATION_MS;
        const updatedLockedEmails = { ...store.lockedEmails, [cleanEmail]: lockUntil };
        saveStore({
          ...store,
          lockedEmails: updatedLockedEmails,
          globalLockedUntil: lockUntil,
          lastLockedEmail: cleanEmail,
        });

        const remainingSeconds = Math.ceil(COOLDOWN_DURATION_MS / 1000);
        return {
          isLocked: true,
          remainingSeconds,
          formattedTime: this.formatTime(remainingSeconds),
          attemptCount,
        };
      }
    } else {
      // Device recent submissions count
      attemptCount = activeSubmissions.length;
    }

    return { isLocked: false, remainingSeconds: 0, formattedTime: "00:00", attemptCount };
  },

  // Record a new form submission and check if it reaches the limit
  recordSubmission(
    email: string,
    name?: string,
    phone?: string
  ): { isLocked: boolean; remainingSeconds: number; formattedTime: string; attemptCount: number } {
    if (typeof window === "undefined") {
      return { isLocked: false, remainingSeconds: 0, formattedTime: "00:00", attemptCount: 1 };
    }

    const store = getStore();
    const now = Date.now();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");

    // Clean up submissions older than 1 hour
    const activeSubmissions = store.submissions.filter((s) => now - s.timestamp < COOLDOWN_DURATION_MS);

    // Count matching submissions with the same email or phone
    const sameInfoMatches = activeSubmissions.filter(
      (s) => s.email === cleanEmail || (cleanPhone && s.phone && s.phone === cleanPhone)
    ).length;

    const newAttemptCount = sameInfoMatches + 1;

    // Add this new submission
    activeSubmissions.push({
      email: cleanEmail,
      phone: cleanPhone || undefined,
      name: name?.trim(),
      timestamp: now,
    });

    // Check if user hit the limit (e.g. 3rd submission)
    if (newAttemptCount >= MAX_SUBMISSIONS_ALLOWED) {
      const lockUntil = now + COOLDOWN_DURATION_MS;
      const updatedLockedEmails = { ...store.lockedEmails, [cleanEmail]: lockUntil };

      saveStore({
        submissions: activeSubmissions,
        lockedEmails: updatedLockedEmails,
        globalLockedUntil: lockUntil,
        lastLockedEmail: cleanEmail,
      });

      const remainingSeconds = Math.ceil(COOLDOWN_DURATION_MS / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        formattedTime: this.formatTime(remainingSeconds),
        attemptCount: newAttemptCount,
      };
    }

    // Submission recorded under limit
    saveStore({
      ...store,
      submissions: activeSubmissions,
    });

    return { isLocked: false, remainingSeconds: 0, formattedTime: "00:00", attemptCount: newAttemptCount };
  },

  // Format seconds into MM:SS or Xh Ym
  formatTime(totalSeconds: number): string {
    if (totalSeconds <= 0) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remMin = minutes % 60;
      return `${hours}h ${pad(remMin)}m ${pad(seconds)}s`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  },

  // Get list of all currently locked clients with remaining countdowns
  getLockedClients(): LockedClientRecord[] {
    if (typeof window === "undefined") return [];
    const store = getStore();
    const now = Date.now();
    const lockedList: LockedClientRecord[] = [];
    const handledEmails = new Set<string>();

    // 1. Process specifically locked emails
    for (const [rawEmail, lockUntil] of Object.entries(store.lockedEmails)) {
      if (lockUntil > now) {
        const cleanEmail = rawEmail.trim().toLowerCase();
        handledEmails.add(cleanEmail);
        const remainingSeconds = Math.max(0, Math.ceil((lockUntil - now) / 1000));
        
        // Find latest submission info for name and phone
        const relatedSubmissions = store.submissions.filter((s) => s.email.toLowerCase() === cleanEmail);
        const latestSub = relatedSubmissions[relatedSubmissions.length - 1];

        lockedList.push({
          id: cleanEmail,
          email: cleanEmail,
          name: latestSub?.name || undefined,
          phone: latestSub?.phone || undefined,
          lockUntil,
          remainingSeconds,
          formattedTime: this.formatTime(remainingSeconds),
          attemptsCount: Math.max(relatedSubmissions.length, MAX_SUBMISSIONS_ALLOWED),
          lockedAt: lockUntil - COOLDOWN_DURATION_MS,
        });
      }
    }

    // 2. Check if browser device lock is active
    if (store.globalLockedUntil > now) {
      const lastEmail = (store.lastLockedEmail || "").trim().toLowerCase();
      if (!lastEmail || !handledEmails.has(lastEmail)) {
        const remainingSeconds = Math.max(0, Math.ceil((store.globalLockedUntil - now) / 1000));
        lockedList.push({
          id: "browser_device",
          email: lastEmail || "Current Browser / Device Session",
          lockUntil: store.globalLockedUntil,
          remainingSeconds,
          formattedTime: this.formatTime(remainingSeconds),
          attemptsCount: MAX_SUBMISSIONS_ALLOWED,
          isDeviceLock: true,
        });
      }
    }

    return lockedList;
  },

  // Check if a specific client's email or phone is currently locked
  isClientLocked(email?: string, phone?: string): { isLocked: boolean; remainingSeconds: number; formattedTime: string } {
    const result = this.isLocked(email, phone);
    return {
      isLocked: result.isLocked,
      remainingSeconds: result.remainingSeconds,
      formattedTime: result.formattedTime,
    };
  },

  // Turn off timer / unlock a specific client
  unlockClient(identifier: string): boolean {
    if (typeof window === "undefined") return false;
    const store = getStore();
    const cleanId = (identifier || "").trim().toLowerCase();
    if (!cleanId) return false;

    let changed = false;

    // Handle device lock removal
    if (cleanId === "browser_device" || cleanId === "device") {
      store.globalLockedUntil = 0;
      delete store.lastLockedEmail;
      changed = true;
    }

    // Remove from locked emails
    if (store.lockedEmails[cleanId]) {
      delete store.lockedEmails[cleanId];
      changed = true;
    }

    // Check last locked email
    if (store.lastLockedEmail && store.lastLockedEmail.toLowerCase() === cleanId) {
      store.globalLockedUntil = 0;
      delete store.lastLockedEmail;
      changed = true;
    }

    // Clear submissions for that email / phone so count is reset to 0
    const prevSubmissionsCount = store.submissions.length;
    store.submissions = store.submissions.filter(
      (s) => s.email.toLowerCase() !== cleanId && (!s.phone || s.phone !== cleanId)
    );
    if (store.submissions.length !== prevSubmissionsCount) {
      changed = true;
    }

    // If no remaining active email locks, clear global lockout
    const now = Date.now();
    const hasActiveLocks = Object.values(store.lockedEmails).some((t) => t > now);
    if (!hasActiveLocks) {
      store.globalLockedUntil = 0;
      delete store.lastLockedEmail;
    }

    saveStore(store);
    return changed;
  },

  // Turn off timers for all clients (reset all form locks)
  unlockAll(): void {
    if (typeof window === "undefined") return;
    saveStore({
      submissions: [],
      lockedEmails: {},
      globalLockedUntil: 0,
    });
  },

  // Clear rate limits (alias for unlockAll)
  clearLimits(): void {
    this.unlockAll();
  },

  // Simulate / test lock a client (useful for admin testing)
  testLockClient(
    email = "demo.client@webnoura.com",
    name = "Demo Client",
    phone = "+91 94637 37763"
  ): void {
    if (typeof window === "undefined") return;
    const store = getStore();
    const cleanEmail = email.trim().toLowerCase();
    const now = Date.now();
    const lockUntil = now + COOLDOWN_DURATION_MS;

    const activeSubmissions = store.submissions.filter((s) => now - s.timestamp < COOLDOWN_DURATION_MS);
    for (let i = 0; i < MAX_SUBMISSIONS_ALLOWED; i++) {
      activeSubmissions.push({
        email: cleanEmail,
        name,
        phone,
        timestamp: now - i * 1000,
      });
    }

    saveStore({
      submissions: activeSubmissions,
      lockedEmails: {
        ...store.lockedEmails,
        [cleanEmail]: lockUntil,
      },
      globalLockedUntil: lockUntil,
      lastLockedEmail: cleanEmail,
    });
  },
};

// React hook that provides live ticking remaining time
export function useFormRateLimit(currentEmail?: string, currentPhone?: string) {
  const [lockInfo, setLockInfo] = useState(() => formRateLimiter.isLocked(currentEmail, currentPhone));

  useEffect(() => {
    // Initial sync
    setLockInfo(formRateLimiter.isLocked(currentEmail, currentPhone));

    const handleRateLimitChange = () => {
      setLockInfo(formRateLimiter.isLocked(currentEmail, currentPhone));
    };

    window.addEventListener("webnoura_ratelimit_change", handleRateLimitChange);

    // Ticking countdown interval (updates every 1000ms)
    const interval = setInterval(() => {
      setLockInfo((prev) => {
        if (!prev.isLocked) {
          const fresh = formRateLimiter.isLocked(currentEmail, currentPhone);
          return fresh;
        }
        if (prev.remainingSeconds <= 1) {
          return { isLocked: false, remainingSeconds: 0, formattedTime: "00:00", attemptCount: 0 };
        }
        const nextSecs = prev.remainingSeconds - 1;
        return {
          isLocked: true,
          remainingSeconds: nextSecs,
          formattedTime: formRateLimiter.formatTime(nextSecs),
          attemptCount: prev.attemptCount,
        };
      });
    }, 1000);

    return () => {
      window.removeEventListener("webnoura_ratelimit_change", handleRateLimitChange);
      clearInterval(interval);
    };
  }, [currentEmail, currentPhone]);

  return lockInfo;
}

// React hook that provides live ticking list of locked clients
export function useLockedClients(): LockedClientRecord[] {
  const [lockedClients, setLockedClients] = useState<LockedClientRecord[]>(() => formRateLimiter.getLockedClients());

  useEffect(() => {
    const update = () => {
      setLockedClients(formRateLimiter.getLockedClients());
    };

    update();
    window.addEventListener("webnoura_ratelimit_change", update);

    const interval = setInterval(() => {
      setLockedClients(formRateLimiter.getLockedClients());
    }, 1000);

    return () => {
      window.removeEventListener("webnoura_ratelimit_change", update);
      clearInterval(interval);
    };
  }, []);

  return lockedClients;
}
