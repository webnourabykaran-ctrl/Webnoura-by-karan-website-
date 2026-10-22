import { useState } from "react";
import { 
  Save, 
  KeyRound, 
  ShieldCheck, 
  Check, 
  Download, 
  RotateCcw, 
  RefreshCw, 
  Mail, 
  MessageCircle, 
  Instagram, 
  Bell, 
  User, 
  Database,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Unlock
} from "lucide-react";
import { SiteSettings } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";
import { formRateLimiter, useLockedClients } from "@/lib/formRateLimit";

interface SettingsTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export function SettingsTab({ settings, onRefresh }: SettingsTabProps) {
  // Contact & profile form states
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [studioName, setStudioName] = useState(settings.studioName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [email, setEmail] = useState(settings.email);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [location, setLocation] = useState(settings.location);

  // Website Online / Maintenance Switch
  const [websiteOnline, setWebsiteOnline] = useState(settings.websiteOnline ?? true);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    settings.maintenanceMessage ||
      "We are currently upgrading WebNoura with exciting new demo concepts and limited-time offer packages. We will be back online shortly!"
  );

  // Announcement banner
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);

  // Admin Credentials
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(settings.adminUsername || "karan_admin");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState(false);

  // Status feedback
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // Rate limit spam timer management state
  const lockedClients = useLockedClients();
  const [rateLimitNotice, setRateLimitNotice] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.saveSettings({
      ownerName,
      studioName,
      tagline,
      email,
      whatsapp,
      instagram,
      location,
      announcementActive,
      announcementText,
      websiteOnline,
      maintenanceMessage,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefresh();
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredSuccess(false);

    const activePass = settings.adminPassword || "Karan#WebNoura2026!$";
    if (currentPassword !== activePass) {
      setCredError("Current password is incorrect.");
      return;
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setCredError("Username must be at least 3 characters.");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setCredError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredError("New password and confirmation do not match.");
      return;
    }

    adminStore.saveSettings({
      adminUsername: newUsername.trim(),
      ...(newPassword ? { adminPassword: newPassword.trim() } : {}),
    });

    setCredSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setCredSuccess(false), 3500);
    onRefresh();
  };

  const handleSupabaseSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const added = await adminStore.syncFromSupabase();
      setSyncMessage(added > 0 ? `Synced! Added ${added} new enquiries from Supabase.` : "Synced! All Supabase records are up to date.");
      onRefresh();
    } catch {
      setSyncMessage("Supabase sync completed.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(""), 4000);
    }
  };

  const handleResetData = () => {
    if (confirm("Reset demo data to initial factory defaults? (This will restore default demo leads and projects)")) {
      adminStore.resetAllData();
      onRefresh();
      alert("All data restored to defaults.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Settings Form */}
      <form onSubmit={handleSaveGeneral} className="space-y-8">
        {/* Website On/Off Status & Maintenance Switch */}
        <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] to-[#0A2548] p-6 md:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E4378]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-extrabold text-white">
                  Website Public Status: {websiteOnline ? "ONLINE (LIVE)" : "OFFLINE (MAINTENANCE)"}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                    websiteOnline
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${websiteOnline ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                  {websiteOnline ? "Normal Public Access" : "Maintenance Screen Active"}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Toggle your entire public website ON or OFF instantly. When OFF, visitors see your luxury maintenance page with WhatsApp contact.
              </p>
            </div>

            {/* Big ON/OFF Switch */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-white">
                {websiteOnline ? "Turn Site OFF" : "Turn Site ON"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={websiteOnline}
                  onChange={(e) => setWebsiteOnline(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-[#061833] border border-[#1E4378] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {!websiteOnline && (
            <div className="mt-5 space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-[#93C5FD] block">
                Public Maintenance Notice to Visitors
              </label>
              <textarea
                rows={3}
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Message displayed to visitors while site is offline..."
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] p-3 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Studio Identity Card */}
        <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 md:p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3 pb-5 border-b border-[#1E4378]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Studio Profile & Branding</h2>
              <p className="text-xs text-[#94A3B8]">Your agency details displayed across the website</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                Owner / Founder Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                Studio Brand Name
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                Studio Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Contact Information */}
        <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 md:p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3 pb-5 border-b border-[#1E4378]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Live Client Contact Channels</h2>
              <p className="text-xs text-[#94A3B8]">Connected to the Contact buttons and WhatsApp quick-chat</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#3B82F6]" /> Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp Number (with Country Code)
              </label>
              <input
                type="text"
                placeholder="+91 94637 37763"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5 flex items-center gap-1.5">
                <Instagram className="h-3.5 w-3.5 text-pink-400" /> Instagram Profile URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 md:p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between pb-5 border-b border-[#1E4378]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white">Live Website Announcement Banner</h2>
                <p className="text-xs text-[#94A3B8]">Highlight availability, discount offers, or updates at the top of the site</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="h-4 w-4 rounded border-[#1E4378] bg-[#061833] text-[#3B82F6] focus:ring-0"
              />
              <span className="text-xs font-bold text-white">
                {announcementActive ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <div className="mt-6">
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
              Banner Text
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. 🚀 Currently accepting 2 new client projects for this month!"
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>
        </div>

        {/* Save button bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 font-bold">
              <Check className="h-4 w-4" /> Changes successfully saved!
            </span>
          ) : (
            <span className="text-xs text-[#94A3B8]">Changes apply immediately across the admin system.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/30 hover:-translate-y-0.5"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </form>

      {/* Security & Credentials Card */}
      <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 md:p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3 pb-5 border-b border-[#1E4378]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Admin Security & Credentials</h2>
            <p className="text-xs text-[#94A3B8]">Change the master admin username and password required to enter this control panel</p>
          </div>
        </div>

        <form onSubmit={handleChangeCredentials} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
              Current Master Password *
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              placeholder="e.g. karan_admin"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
              New Password (Leave blank to keep current)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 pr-10 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 rounded-2xl bg-[#061833] border border-[#1E4378] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#93C5FD] font-semibold block">
                Secret Admin Access URL
              </span>
              <p className="font-mono text-sm text-white font-bold mt-0.5">
                /karan-portal
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Public /admin path is disabled and redirects to the home page.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full font-bold shrink-0 self-start sm:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Protected & Hidden
            </span>
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              {credError && <p className="text-xs text-rose-400 font-medium">{credError}</p>}
              {credSuccess && <p className="text-xs text-emerald-400 font-bold">Admin credentials updated successfully!</p>}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E4378] bg-[#061833] hover:border-[#3B82F6] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md hover:bg-[#3B82F6]/10"
            >
              <ShieldCheck className="h-4 w-4 text-[#3B82F6]" /> Update Admin Credentials
            </button>
          </div>
        </form>
      </div>

      {/* Database Tools & Backup Card */}
      <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 md:p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3 pb-5 border-b border-[#1E4378]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Database & Studio Backups</h2>
            <p className="text-xs text-[#94A3B8]">Manage local lead storage, Supabase sync, and data exports</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Supabase Sync */}
          <button
            onClick={handleSupabaseSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl bg-[#061833] border border-[#1E4378] hover:border-[#3B82F6] text-white px-4 py-2.5 text-xs font-bold transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin text-[#3B82F6]" : "text-[#93C5FD]"}`} />
            <span>{syncing ? "Syncing..." : "Sync with Supabase Cloud"}</span>
          </button>

          {/* Download JSON Backup */}
          <button
            onClick={() => adminStore.exportFullBackupJSON()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#061833] border border-[#1E4378] hover:border-[#3B82F6] text-white px-4 py-2.5 text-xs font-bold transition-all"
          >
            <Download className="h-4 w-4 text-[#93C5FD]" />
            <span>Download Full Backup (JSON)</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-4 py-2.5 text-xs font-bold transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restore Factory Demo Data</span>
          </button>

        </div>

        {syncMessage && (
          <p className="mt-3 text-xs font-mono text-emerald-400">{syncMessage}</p>
        )}
      </div>

      {/* Form Spam Protection & Rate Limit Timers Manager */}
      <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 md:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1E4378]">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              lockedClients.length > 0
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            }`}>
              <Clock className={`h-5 w-5 ${lockedClients.length > 0 ? "animate-spin text-amber-400" : "text-emerald-400"}`} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Client Form Cooldown Timers & Spam Protection
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Manage 1-hour anti-spam lockout timers applied to clients who repeatedly submit forms
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold self-start sm:self-auto ${
            lockedClients.length > 0
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
          }`}>
            {lockedClients.length > 0 ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                {lockedClients.length} Client Timer Active
              </>
            ) : (
              <>
                <Check className="h-3 w-3" /> All Forms Unlocked
              </>
            )}
          </span>
        </div>

        {/* Action button bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              formRateLimiter.unlockAll();
              setRateLimitNotice("All client form cooldown timers have been turned off successfully!");
              setTimeout(() => setRateLimitNotice(""), 3500);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
          >
            <Unlock className="h-4 w-4" />
            <span>Turn Off All Client Timers (Unlock Everyone)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              formRateLimiter.testLockClient("demo.client@webnoura.com", "Demo Client (Test)", "+91 94637 37763");
              setRateLimitNotice("Demo client test-locked with a 1-hour timer! You can now test unlocking it.");
              setTimeout(() => setRateLimitNotice(""), 3500);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-4 py-2.5 text-xs font-bold transition-all"
          >
            <Clock className="h-4 w-4" />
            <span>+ Simulate / Test Lock Client</span>
          </button>
        </div>

        {/* Quick manual unlock by email */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!manualEmail.trim()) return;
            formRateLimiter.unlockClient(manualEmail.trim());
            setRateLimitNotice(`Timer turned off for ${manualEmail.trim()}! Form is unlocked.`);
            setManualEmail("");
            setTimeout(() => setRateLimitNotice(""), 3500);
          }}
          className="mt-5 pt-4 border-t border-[#1E4378] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg"
        >
          <input
            type="email"
            value={manualEmail}
            onChange={(e) => setManualEmail(e.target.value)}
            placeholder="Turn off timer for specific email (e.g. client@gmail.com)"
            className="flex-1 rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 text-xs font-bold transition-all shrink-0"
          >
            Turn Off Timer
          </button>
        </form>

        {rateLimitNotice && (
          <p className="mt-3 text-xs font-mono font-bold text-emerald-400">{rateLimitNotice}</p>
        )}

        {/* List of active locked clients */}
        {lockedClients.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#1E4378] space-y-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-300 block">
              Currently Locked Clients & Cooldown Timers:
            </span>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {lockedClients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-2xl border border-amber-500/30 bg-[#061833] p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{client.email}</p>
                    <p className="text-[11px] font-mono text-amber-300 mt-0.5">
                      ⏳ {client.formattedTime} remaining
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      formRateLimiter.unlockClient(client.id);
                      setRateLimitNotice(`Timer turned off for ${client.email}!`);
                      setTimeout(() => setRateLimitNotice(""), 3500);
                    }}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold shrink-0 transition-colors"
                  >
                    Turn Off
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
