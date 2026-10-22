import { useState, useEffect } from "react";
import { z } from "zod";
import { X, ArrowUpRight, CheckCircle2, Loader2, Sparkles, Send, MessageCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminStore } from "@/lib/adminStore";
import { formRateLimiter, useFormRateLimit } from "@/lib/formRateLimit";
import { cn } from "@/lib/utils";
import {
  type EnquiryData,
  buildEnquiryWhatsAppMessage,
  buildWhatsAppUrl,
  saveLastEnquiry,
  DEFAULT_WHATSAPP_NUMBER,
} from "@/lib/whatsapp";

export const WEBSITE_TYPES = [
  "Business & hotel website",
  "Restaurant website",
  "Gym website",
  "Portfolio website",
  "Landing page",
  "E-commerce website",
  "Other",
] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  business_name: z.string().trim().min(1, "Please enter your business name").max(150),
  website_type: z.enum(WEBSITE_TYPES, { errorMap: () => ({ message: "Please choose a website type" }) }),
  pages: z.string().trim().max(50).optional(),
  budget: z.string().trim().max(50).optional(),
  details: z.string().trim().min(10, "Please share a few details (at least 10 characters)").max(2000),
});

type Errors = Partial<Record<keyof z.infer<typeof enquirySchema>, string>>;

const field =
  "w-full rounded-xl border border-[#1E4378] bg-[#061833] px-4 py-3 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]";

export function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submittedData, setSubmittedData] = useState<EnquiryData | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const rateLimit = useFormRateLimit(emailInput, phoneInput);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setStatus("idle");
      setErrors({});
    };

    window.addEventListener("open_enquiry_modal", handleOpen);
    return () => window.removeEventListener("open_enquiry_modal", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [isOpen]);

  if (!isOpen) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const email = (fd["email"] || "").trim().toLowerCase();
    const phone = (fd["phone"] || "").trim();

    // Check rate limit before validating
    const lockCheck = formRateLimiter.isLocked(email, phone);
    if (lockCheck.isLocked) {
      return;
    }

    const parsed = enquirySchema.safeParse({
      ...fd,
      phone: fd["phone"] || undefined,
      pages: fd["pages"] || undefined,
      budget: fd["budget"] || undefined,
    });

    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(errs);
      return;
    }

    setErrors({});
    setStatus("loading");

    const enquiryData: EnquiryData = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      business_name: parsed.data.business_name,
      website_type: parsed.data.website_type,
      pages: parsed.data.pages ?? null,
      budget: parsed.data.budget ?? null,
      details: parsed.data.details,
    };

    setSubmittedData(enquiryData);
    saveLastEnquiry(enquiryData);

    // Save to local admin store
    await adminStore.addEnquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      business_name: parsed.data.business_name,
      website_type: parsed.data.website_type,
      pages: parsed.data.pages ?? null,
      budget: parsed.data.budget ?? null,
      details: parsed.data.details,
      notes: "Website modal enquiry",
    });

    try {
      await supabase.from("enquiries").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        business_name: parsed.data.business_name,
        website_type: parsed.data.website_type,
        pages: parsed.data.pages ?? null,
        budget: parsed.data.budget ?? null,
        details: parsed.data.details,
      });
    } catch (err) {
      console.warn("Supabase insert:", err);
    }

    // Record submission into rate limiter (triggers 1 hour cooldown if repeated 2-3 times)
    formRateLimiter.recordSubmission(parsed.data.email, parsed.data.name, parsed.data.phone);

    // Automatically open WhatsApp with prefilled enquiry details
    const waUrl = buildWhatsAppUrl(buildEnquiryWhatsAppMessage(enquiryData), DEFAULT_WHATSAPP_NUMBER);
    try {
      window.open(waUrl, "_blank");
    } catch {
      // Handled via button on success screen if popup blocked
    }

    setStatus("success");
  }

  const Err = ({ k }: { k: keyof Errors }) =>
    errors[k] ? <p className="mt-1 text-xs text-rose-400">{errors[k]}</p> : null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#1E4378] bg-[#0B2D5B] p-6 md:p-8 text-white shadow-2xl ring-1 ring-white/10"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:border-[#3B82F6] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-display text-2xl md:text-3xl font-extrabold text-white">
              THANK YOU, {submittedData?.name?.toUpperCase()}!
            </h2>
            <p className="mt-3 text-sm text-[#CBD5E1] max-w-md mx-auto leading-relaxed">
              Your website enquiry for <strong>{submittedData?.business_name}</strong> has been received by WebNoura by Karan.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <a
                href={
                  submittedData
                    ? buildWhatsAppUrl(buildEnquiryWhatsAppMessage(submittedData), DEFAULT_WHATSAPP_NUMBER)
                    : buildWhatsAppUrl(buildEnquiryWhatsAppMessage({
                        name: "Client",
                        email: "",
                        business_name: "",
                        website_type: "Business website",
                        details: "",
                      }), DEFAULT_WHATSAPP_NUMBER)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-4 text-sm font-extrabold transition-all shadow-xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 hover:scale-105"
              >
                <span className="absolute -inset-1 rounded-2xl bg-[#25D366]/40 animate-ping pointer-events-none" />
                <MessageCircle className="h-5 w-5" />
                <span>Send Details to WebNoura by Karan on WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="text-xs text-[#94A3B8]">
                Your enquiry details are pre-filled in WhatsApp. Just tap Send!
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-xl border border-[#1E4378] bg-[#061833] px-5 py-2.5 text-xs font-bold text-[#CBD5E1] hover:text-white transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-white p-1 ring-2 ring-[#3B82F6]/50">
                <img src="/logo.jpg?v=2" alt="Webnoura" className="h-full w-full rounded-full object-contain" />
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[#93C5FD] uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#3B82F6]" /> Business Growth & Partnership
                </span>
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-white">
                  GROW YOUR BUSINESS WITH WEBNOURA
                </h2>
              </div>
            </div>

            <p className="mt-3 text-xs md:text-sm text-[#94A3B8] leading-relaxed">
              Tell us about your business and goals. Let’s collaborate to build a powerful, high-converting digital presence that scales your brand.
            </p>

            {/* The Form */}
            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    Your Name *
                  </label>
                  <input name="name" placeholder="Enter your full name" className={field} />
                  <Err k="name" />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className={field}
                  />
                  <Err k="email" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    Business / Brand Name *
                  </label>
                  <input name="business_name" placeholder="Enter your business or brand name" className={field} />
                  <Err k="business_name" />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    WhatsApp / Phone Number <span className="opacity-60 lowercase font-sans">(optional)</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="Enter phone or WhatsApp number"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className={field}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    Type of Website *
                  </label>
                  <select name="website_type" defaultValue={WEBSITE_TYPES[0]} className={cn(field, "cursor-pointer")}>
                    {WEBSITE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#061833] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  <Err k="website_type" />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    Pages <span className="opacity-60 lowercase font-sans">(optional)</span>
                  </label>
                  <input name="pages" placeholder="Number of pages" className={field} />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                    Budget <span className="opacity-60 lowercase font-sans">(optional)</span>
                  </label>
                  <input name="budget" placeholder="Estimated budget" className={field} />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                  Project Details *
                </label>
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Tell us about your business goals, target audience, or any specific requirements..."
                  className={cn(field, "resize-none")}
                />
                <Err k="details" />
              </div>

              {rateLimit.isLocked && (
                <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 p-4 text-amber-200 shadow-xl backdrop-blur-md animate-fade-in text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Submission Paused (Spam Prevention)</span>
                  </div>
                  <p className="text-xs text-amber-200/90 mt-1.5 max-w-md mx-auto">
                    You have submitted multiple enquiries with this information. To maintain quality service, submissions for this account are temporarily paused for 1 hour.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-2 font-mono text-sm md:text-base font-extrabold text-amber-300 shadow-inner">
                    ⏳ Live Timer: {rateLimit.formattedTime}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-2">
                    Urgent requirement? Reach out directly to WebNoura by Karan on WhatsApp.
                  </p>
                </div>
              )}

              {status === "error" && (
                <p className="text-xs text-rose-400">
                  There was an issue submitting your enquiry. Please try again or message us directly on WhatsApp.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || rateLimit.isLocked}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold transition-all shadow-lg",
                  rateLimit.isLocked
                    ? "bg-amber-900/30 border border-amber-500/40 text-amber-300 cursor-not-allowed shadow-none"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[#3B82F6]/30 hover:shadow-[#3B82F6]/50 hover:-translate-y-0.5 disabled:opacity-50"
                )}
              >
                {rateLimit.isLocked ? (
                  <>
                    <Clock className="h-4 w-4 text-amber-400" />
                    FORM LOCKED · TRY AGAIN IN {rateLimit.formattedTime}
                  </>
                ) : status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> SUBMITTING ENQUIRY…
                  </>
                ) : (
                  <>
                    SUBMIT PROJECT ENQUIRY <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
