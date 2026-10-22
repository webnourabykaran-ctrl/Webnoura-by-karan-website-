import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { Cta, Wordmark } from "./primitives";
import { cn } from "@/lib/utils";
import { adminStore } from "@/lib/adminStore";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const links = [
  { label: "Home", href: "/#home", num: "01" },
  { label: "Services", href: "/#services", num: "02" },
  { label: "Portfolio", href: "/#portfolio", num: "03" },
  { label: "Process", href: "/#process", num: "04" },
  { label: "About", href: "/#about", num: "05" },
  { label: "Contact", href: "/#contact", num: "06" },
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

  // Lock body scroll and handle Escape key + resize when mobile menu is open
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.replace(/^\/?#/, "");
      // If already on homepage, smoothly scroll to section
      if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        } else if (id === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "/");
        }
      }
    }
  };

  const handleCtaClick = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open_enquiry_modal"));
    }
  };

  const cleanPhone = (settings.whatsapp || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Karan! I visited WebNoura and I am interested in building a website for my business.",
    cleanPhone || DEFAULT_WHATSAPP_NUMBER
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-[#E2E8F0] bg-[#F8F9FA]/95 backdrop-blur-md shadow-sm text-[#0B2D5B]"
            : "border-b border-white/10 bg-[#061833]/60 backdrop-blur-md text-[#F8F9FA]",
        )}
      >
        {/* Dynamic Announcement Banner from Admin Settings */}
        {settings.announcementActive && settings.announcementText && (
          <div className="bg-gradient-to-r from-[#061833] via-[#0B2D5B] to-[#061833] border-b border-[#3B82F6]/30 text-white px-4 py-2 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2.5">
            <span className="flex items-center gap-2 truncate">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[#F8F9FA] truncate">{settings.announcementText}</span>
            </span>
            <a
              href="/#enquiry"
              onClick={(e) => {
                e.preventDefault();
                handleCtaClick();
              }}
              className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-all shadow-md shadow-[#3B82F6]/25 hover:scale-105 ml-1"
            >
              Claim Offer &rarr;
            </a>
          </div>
        )}

        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8" aria-label="Main">
          <a href="/#home" onClick={(e) => handleNavClick(e, "/#home")} aria-label="WebNoura home">
            <Wordmark light={!scrolled} />
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map(({ label, href }) => (
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

          {/* Desktop CTA */}
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

          {/* Mobile 3-Lines (Hamburger) Button */}
          <button
            type="button"
            className={cn(
              "relative z-50 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 lg:hidden cursor-pointer touch-manipulation select-none active:scale-90",
              scrolled
                ? "border-[#CBD5E1] text-[#0B2D5B] bg-white/80 hover:bg-white shadow-sm"
                : "border-white/20 text-[#F8F9FA] bg-white/10 hover:bg-white/20",
            )}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer (Rendered OUTSIDE <header> to avoid backdrop-filter containing block collapsing) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#061833] text-[#F8F9FA] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Top Bar inside Drawer */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
              <a href="/#home" onClick={(e) => handleNavClick(e, "/#home")} aria-label="WebNoura home">
                <Wordmark light={true} />
              </a>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all active:scale-90 hover:bg-white/20 cursor-pointer touch-manipulation"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Special Offer Pill if active */}
            {settings.announcementActive && settings.announcementText && (
              <div className="bg-gradient-to-r from-[#0B2D5B] to-[#0A2548] border-b border-[#3B82F6]/30 px-5 py-2.5 text-xs text-[#93C5FD] flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 truncate text-[11px] font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" />
                  <span className="truncate text-white">{settings.announcementText}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] underline"
                >
                  Claim &rarr;
                </button>
              </div>
            )}

            {/* Scrollable Navigation Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
              <ul className="flex flex-col space-y-1">
                {links.map(({ label, href, num }, i) => (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                  >
                    <a
                      href={href}
                      onClick={(e) => handleNavClick(e, href)}
                      className="group flex items-center justify-between border-b border-white/10 py-3.5 transition-colors hover:text-[#3B82F6] active:bg-white/5 px-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#93C5FD]/60 font-semibold">{num}</span>
                        <span className="font-display text-2xl font-bold tracking-tight text-[#F8F9FA] group-hover:text-[#3B82F6] transition-colors">
                          {label}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#3B82F6]" />
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* Action Buttons & Contact in Mobile Menu */}
              <div className="mt-8 space-y-4 pt-4 border-t border-white/10">
                {/* Main CTA */}
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white py-4 px-6 text-sm font-extrabold tracking-wide shadow-lg shadow-[#3B82F6]/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>LET’S GROW YOUR BRAND</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Quick Chat / Call Row */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] py-3 px-3 text-xs font-bold hover:bg-[#25D366]/25 transition-colors active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone || "919463737763"}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 text-white py-3 px-3 text-xs font-bold hover:bg-white/20 transition-colors active:scale-95"
                  >
                    <Phone className="h-4 w-4 text-[#93C5FD]" />
                    <span>Call Karan</span>
                  </a>
                </div>

                {/* Studio tagline & location */}
                <div className="text-center pt-2">
                  <p className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider">
                    WebNoura by Karan · Punjab, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
