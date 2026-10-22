import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { analyticsTracker } from "@/lib/analytics";
import {
  getLastEnquiry,
  buildEnquiryWhatsAppMessage,
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_GREETING,
} from "@/lib/whatsapp";

interface WhatsAppFloatProps {
  phoneNumber?: string;
  defaultMessage?: string;
  instagramUrl?: string;
}

export function WhatsAppFloat({
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
  defaultMessage = DEFAULT_WHATSAPP_GREETING,
  instagramUrl = "https://www.instagram.com/webnoura.com_?psln=MWNhaTBoZ2NncXJxNA==",
}: WhatsAppFloatProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeMessage, setActiveMessage] = useState(defaultMessage);

  // Pop up the tooltip smoothly after 2.5 seconds to catch eye
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowTooltip(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Sync message with any recently filled enquiry in this session
  useEffect(() => {
    const checkEnquiry = () => {
      const last = getLastEnquiry();
      if (last) {
        setActiveMessage(buildEnquiryWhatsAppMessage(last));
      }
    };
    checkEnquiry();
    window.addEventListener("webnoura_enquiry_submitted", checkEnquiry);
    return () => window.removeEventListener("webnoura_enquiry_submitted", checkEnquiry);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(activeMessage, phoneNumber);

  const handleWhatsAppClick = () => {
    analyticsTracker.trackClick("WhatsApp Floating Button", "contact", whatsappUrl);
  };

  const handleInstagramClick = () => {
    analyticsTracker.trackClick("Instagram Floating Button", "contact", instagramUrl);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-end gap-3 select-none">
      {/* Animated Speech Bubble / Tooltip */}
      <AnimatePresence>
        {showTooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden sm:flex flex-col rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/95 p-3.5 text-white shadow-2xl backdrop-blur-xl max-w-[250px] ring-1 ring-white/10 mb-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDismissed(true);
              }}
              aria-label="Dismiss message"
              className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#061833] border border-[#1E4378] text-[#94A3B8] hover:text-white hover:border-[#3B82F6] transition-colors shadow-md"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="font-mono text-[10px] text-[#93C5FD] uppercase tracking-wider font-semibold">
                Karan · WebNoura
              </p>
            </div>

            <p className="mt-1.5 text-xs font-bold text-white leading-snug">
              Need a website for your business? Connect directly on WhatsApp or Instagram!
            </p>

            <div className="mt-2.5 flex items-center gap-2 border-t border-white/10 pt-2 text-[10px] font-mono text-emerald-300 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-400" /> Fast Response
              </span>
              <span className="text-white/40">·</span>
              <span className="text-[#F472B6]">@webnoura.com_</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons Column (Instagram & WhatsApp) */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Instagram Floating Button */}
        <div className="relative group">
          {/* Tooltip on hover for Instagram */}
          <span className="pointer-events-none absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center whitespace-nowrap rounded-lg border border-[#1E4378] bg-[#061833]/95 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-md transition-all">
            Follow on Instagram
          </span>

          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInstagramClick}
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.15, rotate: -4 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="relative flex h-11 w-11 md:h-13 md:w-13 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xl shadow-[#dc2743]/30 hover:shadow-[#dc2743]/60 transition-shadow duration-300"
            aria-label="Visit WebNoura Instagram Profile"
          >
            {/* Subtle glowing ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#f09433] to-[#bc1888] opacity-40 blur-sm pointer-events-none group-hover:opacity-80 transition-opacity" />

            {/* Official Instagram SVG Icon */}
            <svg
              viewBox="0 0 24 24"
              className="relative h-5 w-5 md:h-6 md:w-6 fill-current drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </motion.a>
        </div>

        {/* WhatsApp Floating Button */}
        <div className="relative group">
          {/* Tooltip on hover for WhatsApp */}
          <span className="pointer-events-none absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center whitespace-nowrap rounded-lg border border-[#1E4378] bg-[#061833]/95 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-md transition-all">
            Chat on WhatsApp
          </span>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/70 transition-shadow duration-300"
            aria-label="Chat with WebNoura by Karan on WhatsApp (+91 94637 37763)"
          >
            {/* Pulsing radar waves */}
            <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
            <span className="absolute -inset-3 rounded-full bg-[#25D366]/20 blur-md pointer-events-none animate-pulse" />

            {/* WhatsApp Official SVG Icon */}
            <svg
              viewBox="0 0 24 24"
              className="relative h-7 w-7 md:h-8 md:w-8 fill-current drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
