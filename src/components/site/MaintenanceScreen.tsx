import { Shield, MessageCircle, Mail, Sparkles, Lock, ArrowRight } from "lucide-react";
import { SiteSettings } from "@/types/admin";

interface MaintenanceScreenProps {
  settings: SiteSettings;
}

export function MaintenanceScreen({ settings }: MaintenanceScreenProps) {
  const whatsappNumber = settings.whatsapp?.replace(/\D/g, "") || "919463737763";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Karan, I am visiting WebNoura. Looking to enquire about a website project while the site is under maintenance."
  )}`;

  return (
    <div className="min-h-screen bg-[#061833] text-[#F8F9FA] flex flex-col justify-between selection:bg-[#3B82F6] selection:text-white px-4 py-8">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between border-b border-[#1E4378]/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white p-1 ring-2 ring-[#3B82F6]/60 shadow-lg">
            <img src="/logo.jpg?v=2" alt="WebNoura" className="h-full w-full rounded-full object-contain" />
          </div>
          <div>
            <span className="font-display text-base font-extrabold tracking-tight text-white">
              Web<span className="text-[#3B82F6]">noura</span>
            </span>
            <span className="block font-mono text-[10px] text-[#93C5FD] uppercase tracking-widest">
              By Karan · Studio
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          Maintenance Mode Active
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-2xl mx-auto w-full text-center my-auto py-12 space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#3B82F6]/20 blur-2xl animate-pulse" />
          <div className="relative h-20 w-20 rounded-3xl bg-[#0B2D5B] border border-[#1E4378] flex items-center justify-center shadow-2xl">
            <Sparkles className="h-10 w-10 text-[#3B82F6] animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#93C5FD]">
            We'll Be Right Back
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Scheduled Maintenance & Upgrades
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            {settings.maintenanceMessage ||
              "We are currently rolling out new demo showcases, updated ₹4,999 pricing packages, and enhanced client portals. Our studio is fully operational."}
          </p>
        </div>

        {/* Contact Karan directly */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" /> Chat with WebNoura by Karan on WhatsApp
          </a>

          {settings.email && (
            <a
              href={`mailto:${settings.email}?subject=Website%20Project%20Enquiry`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 hover:bg-[#0B2D5B] text-[#CBD5E1] hover:text-white font-semibold text-sm px-6 py-3.5 transition-all"
            >
              <Mail className="h-4 w-4 text-[#93C5FD]" /> Email Studio
            </a>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between border-t border-[#1E4378]/60 pt-6 text-xs text-[#64748B] gap-4">
        <p>© 2026 WebNoura by Karan. All rights reserved.</p>
        <p className="font-mono text-[11px] text-[#64748B]">Deep Navy Luxury Architecture</p>
      </footer>
    </div>
  );
}
