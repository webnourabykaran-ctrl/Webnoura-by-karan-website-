import { useState } from "react";
import { z } from "zod";
import { ArrowUpRight, CheckCircle2, Loader2, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal, SectionLabel } from "./primitives";
import { cn } from "@/lib/utils";
import { adminStore } from "@/lib/adminStore";
import { formRateLimiter, useFormRateLimit } from "@/lib/formRateLimit";
import {
  type EnquiryData,
  buildEnquiryWhatsAppMessage,
  buildWhatsAppUrl,
  saveLastEnquiry,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_GREETING,
} from "@/lib/whatsapp";

export const WEBSITE_TYPES = ["Business & hotel website", "Restaurant website", "Gym website", "Portfolio website", "Landing page", "E-commerce website", "Other"] as const;

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

const field = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-ring";

export function Enquiry() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submittedData, setSubmittedData] = useState<EnquiryData | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const rateLimit = useFormRateLimit(emailInput, phoneInput);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const email = (fd["email"] || "").trim().toLowerCase();

    // Check rate limit before validating
    const lockCheck = formRateLimiter.isLocked(email, phoneInput);
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

    // Save to local admin store immediately
    await adminStore.addEnquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      business_name: parsed.data.business_name,
      website_type: parsed.data.website_type,
      pages: parsed.data.pages ?? null,
      budget: parsed.data.budget ?? null,
      details: parsed.data.details,
      notes: "Website form submission",
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
      // Handled via button on success screen
    }

    setStatus("success");
  }

  const Err = ({ k }: { k: keyof Errors }) => (errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-xs text-destructive">{errors[k]}</p> : null);
  const aria = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <section id="enquiry" className="border-t border-border bg-secondary/40 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <SectionLabel>Partner with WebNoura</SectionLabel>
          <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.6rem)] leading-[0.98] font-extrabold">READY TO ELEVATE YOUR BUSINESS & WIN MORE CLIENTS?</h2>
          <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
            Tell us about your business goals and vision. Let’s collaborate to build a powerful digital foundation that drives real growth for your brand.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          {status === "success" ? (
            <div role="status" className="flex h-full min-h-96 flex-col items-center justify-center rounded-2xl border border-accent/50 bg-card p-8 md:p-10 text-center animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="mt-5 font-display text-2xl font-bold md:text-3xl">THANK YOU, {submittedData?.name?.toUpperCase()}!</p>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your enquiry for <strong>{submittedData?.business_name}</strong> has been received by WebNoura by Karan.
              </p>
              <div className="mt-7 flex flex-col items-center gap-2.5">
                <a
                  href={
                    submittedData
                      ? buildWhatsAppUrl(buildEnquiryWhatsAppMessage(submittedData), DEFAULT_WHATSAPP_NUMBER)
                      : buildWhatsAppUrl(DEFAULT_WHATSAPP_GREETING, DEFAULT_WHATSAPP_NUMBER)
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
                <p className="text-xs text-muted-foreground">
                  Your enquiry details are pre-filled in WhatsApp. Just tap Send!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
              <div>
                <label htmlFor="name" className="label-mono mb-2 block">Name</label>
                <input id="name" name="name" autoComplete="name" placeholder="Enter your full name" className={field} {...aria("name")} />
                <Err k="name" />
              </div>
              <div>
                <label htmlFor="email" className="label-mono mb-2 block">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={field}
                  {...aria("email")}
                />
                <Err k="email" />
              </div>
              <div>
                <label htmlFor="phone" className="label-mono mb-2 block">WhatsApp / Phone <span className="normal-case opacity-60">(optional)</span></label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter phone or WhatsApp number"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="business_name" className="label-mono mb-2 block">Business name</label>
                <input id="business_name" name="business_name" autoComplete="organization" placeholder="Enter your business or brand name" className={field} {...aria("business_name")} />
                <Err k="business_name" />
              </div>
              <div>
                <label htmlFor="website_type" className="label-mono mb-2 block">Type of website</label>
                <select id="website_type" name="website_type" defaultValue="" className={cn(field, "appearance-none")} {...aria("website_type")}>
                  <option value="" disabled>Select…</option>
                  {WEBSITE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <Err k="website_type" />
              </div>
              <div>
                <label htmlFor="pages" className="label-mono mb-2 block">Number of pages <span className="normal-case opacity-60">(optional)</span></label>
                <input id="pages" name="pages" placeholder="Number of pages" className={field} />
              </div>
              <div>
                <label htmlFor="budget" className="label-mono mb-2 block">Budget range <span className="normal-case opacity-60">(optional)</span></label>
                <input id="budget" name="budget" placeholder="Estimated budget" className={field} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="details" className="label-mono mb-2 block">Project details</label>
                <textarea id="details" name="details" rows={5} placeholder="Tell us about your business goals, target audience, or any specific requirements..." className={cn(field, "resize-none")} {...aria("details")} />
                <Err k="details" />
              </div>
              {status === "error" && (
                <p role="alert" className="text-sm text-destructive md:col-span-2">Something went wrong sending your enquiry. Please try again.</p>
              )}

              {/* 1-Hour Rate Limit Timer Banner */}
              {rateLimit.isLocked && (
                <div className="md:col-span-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-center">
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
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Urgent requirement? Reach out directly to WebNoura by Karan on WhatsApp.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || rateLimit.isLocked}
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all hover:glow-accent disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
              >
                {rateLimit.isLocked ? (
                  <>
                    <Clock className="h-4 w-4 text-amber-400" />
                    FORM LOCKED · TRY AGAIN IN {rateLimit.formattedTime}
                  </>
                ) : status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> SENDING…</>
                ) : (
                  <>REQUEST A WEBSITE <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></>
                )}
              </button>
              <p className="mt-1 text-center text-xs text-muted-foreground md:col-span-2">
                By submitting, you agree to our{" "}
                <a href="/terms" className="text-accent underline underline-offset-2 hover:opacity-80">
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-accent underline underline-offset-2 hover:opacity-80">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
