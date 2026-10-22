import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Shield, ArrowRight } from "lucide-react";
import { Cta, Wordmark } from "./primitives";
import { cn } from "@/lib/utils";
import { adminStore } from "@/lib/adminStore";

const links = [
  ["Home", "/#home"],
  ["Services", "/#services"],
  ["Portfolio", "/#portfolio"],
  ["Process", "/#process"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => adminStore.getSettings());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleStoreChange = () => setSettings(adminStore.getSettings());
    window.addEventListener("webnoura_store_change", handleStoreChange);
    return () => window.removeEventListener("webnoura_store_change", handleStoreChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-[#E2E8F0] bg-[#F8F9FA]/95 backdrop-blur-md shadow-sm text-[#0B2D5B]"
          : "border-b border-white/10 bg-[#061833]/60 backdrop-blur-md text-[#F8F9FA]",
      )}
    >
      {/* Dynamic Announcement Banner from Admin Settings */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-[#061833] via-[#0B2D5B] to-[#061833] border-b border-[#3B82F6]/30 text-white px-4 py-2 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2.5">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#F8F9FA]">{settings.announcementText}</span>
          </span>
          <a
            href="/#enquiry"
            className="inline-flex items-center gap-1 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-all shadow-md shadow-[#3B82F6]/25 hover:scale-105 ml-1"
          >
            Claim Offer &rarr;
          </a>
        </div>
      )}

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8" aria-label="Main">
        <a href="/#home" aria-label="WebNoura home"><Wordmark light={!scrolled} /></a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  scrolled
                    ? "text-[#0B2D5B]/75 hover:text-[#3B82F6]"
                    : "text-[#E2E8F0] hover:text-white",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block">
          <Cta
            href="/#enquiry"
            className={cn(
              "min-h-10 px-5 text-xs font-bold transition-all duration-300",
              scrolled
                ? "bg-[#0B2D5B] text-[#F8F9FA] hover:bg-[#113A6E] hover:shadow-md"
                : "border border-[#3B82F6]/60 bg-[#3B82F6]/20 text-[#F8F9FA] hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6]",
            )}
          >
            GROW YOUR BRAND
          </Cta>
        </div>
        <button
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden",
            scrolled ? "border-[#E2E8F0] text-[#0B2D5B]" : "border-white/20 text-[#F8F9FA]",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 bottom-0 bg-[#F8F9FA] text-[#0B2D5B] px-6 pt-8 lg:hidden overflow-y-auto"
          >
            <ul className="flex flex-col gap-2">
              {links.map(([label, href], i) => (
                <motion.li key={href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <a href={href} onClick={() => setOpen(false)} className="block border-b border-[#E2E8F0] py-4 font-display text-3xl font-bold text-[#0B2D5B] hover:text-[#3B82F6]">
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8" onClick={() => setOpen(false)}>
              <Cta href="/#enquiry" className="w-full bg-[#0B2D5B] text-[#F8F9FA] hover:bg-[#113A6E]">GET A WEBSITE</Cta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
