import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Palette,
  Smartphone,
  ScanSearch,
  MessagesSquare,
  Mail,
  MessageCircle,
  Instagram,
  Tag,
  Sparkles,
  Star,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { BrowserFrame, Cta, PhoneFrame, Reveal, SectionLabel, Wordmark } from "./primitives";
import { cn } from "@/lib/utils";
import { adminStore, formatPriceDisplay } from "@/lib/adminStore";
import gym from "@/assets/mock-gym.jpg";
import restaurant from "@/assets/mock-restaurant.jpg";
import portfolio from "@/assets/mock-portfolio.jpg";
import business from "@/assets/mock-business.jpg";
import majhaCafe from "@/assets/majha-cafe.png";
import majhaMobile from "@/assets/majha-mobile.png";
import fabHotel from "@/assets/fab-hotel.png";
import fabHotelMobile from "@/assets/fab-hotel-mobile.png";
import goldGym from "@/assets/gold-gym.png";
import goldGymMobile from "@/assets/gold-gym-mobile.png";
import webnoura from "@/assets/webnoura.png";
import webnouraMobile from "@/assets/webnoura-mobile.png";

/** Fill these in to activate the contact buttons. Leave null to keep them disabled. */
export const CONTACT: { email: string | null; whatsapp: string | null; instagram: string | null } = {
  email: "webnourabykaran@gmail.com",
  whatsapp: "+91 94637 37763",
  instagram: "https://www.instagram.com/webnoura.com_?psln=MWNhaTBoZ2NncXJxNA==",
};

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-5 md:px-8", className)}>{children}</div>;
}

const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("mt-5 text-[clamp(2rem,5vw,4rem)] leading-[0.98] font-extrabold", className)}>{children}</h2>
);

export function Intro() {
  return (
    <section id="intro" className="py-24 md:py-36">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <SectionLabel>Strategic Business Growth</SectionLabel>
          <H2>NOT JUST A WEBSITE. <span className="text-muted-foreground">A GROWTH ENGINE FOR YOUR BUSINESS.</span></H2>
          <p className="mt-7 max-w-lg leading-relaxed text-muted-foreground">
            Your website is your 24/7 digital storefront. WebNoura builds high-performance digital experiences that elevate your brand reputation, position you as an industry leader, and consistently turn casual visitors into loyal customers.
          </p>
          <div className="mt-9"><Cta href="#process" variant="ghost">HOW WE GROW YOUR BUSINESS</Cta></div>
        </Reveal>
        <Reveal delay={0.15}>
          <DeviceTrio src={majhaCafe} mobileSrc={majhaMobile} alt="MAJHA Café & Restaurant website" />
        </Reveal>
      </Container>
    </section>
  );
}

function DeviceTrio({ src, alt, mobileSrc }: { src: string; alt: string; mobileSrc?: string }) {
  return (
    <div className="relative pb-10 pr-6">
      <BrowserFrame src={src} alt={`${alt} on desktop`} url="cafe-resturant-demo-website.vercel.app" />
      <div className="absolute -bottom-2 right-24 w-[30%] overflow-hidden rounded-2xl border-[5px] border-secondary shadow-float ring-1 ring-border md:right-28">
        <img src={src} alt={`${alt} on tablet`} loading="lazy" width={1440} height={912} className="aspect-[3/4] w-full object-cover object-[30%_50%]" />
      </div>
      <PhoneFrame src={mobileSrc || src} alt={`${alt} on mobile`} className="absolute right-0 -bottom-6 w-[18%]" />
    </div>
  );
}

const defaultServiceImages = [fabHotel, majhaCafe, goldGym, webnoura];

export function Services() {
  const [serviceList, setServiceList] = useState(() => adminStore.getServices());

  useEffect(() => {
    const handleUpdate = () => {
      setServiceList(adminStore.getServices());
    };
    window.addEventListener("webnoura_store_change", handleUpdate);
    return () => window.removeEventListener("webnoura_store_change", handleUpdate);
  }, []);

  return (
    <section id="services" className="border-t border-border py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionLabel>What we build &amp; pricing</SectionLabel>
          <H2>THE RIGHT WEBSITE<br />FOR YOUR BUSINESS.</H2>
          <p className="mt-4 text-sm text-muted-foreground max-w-lg">
            High performance, responsive websites tailored for your specific industry with transparent, limited-time special offer pricing.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {serviceList.map((s, i) => {
            const isExternal = s.href.startsWith("http");
            const isHome = s.href === "/#home" || s.href === "#home";
            const handleScrollToHome = (e: React.MouseEvent) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (window.location.hash !== "#home") {
                  history.pushState(null, "", "/#home");
                }
              }
            };

            const img =
              s.title.toLowerCase().includes("hotel") || s.title.toLowerCase().includes("business")
                ? fabHotel
                : s.title.toLowerCase().includes("restaurant") || s.title.toLowerCase().includes("caf")
                  ? majhaCafe
                  : s.title.toLowerCase().includes("gym") || s.title.toLowerCase().includes("fitness")
                    ? goldGym
                    : s.title.toLowerCase().includes("portfolio") || s.title.toLowerCase().includes("landing")
                      ? webnoura
                      : defaultServiceImages[i % defaultServiceImages.length];

            const offerPrice = formatPriceDisplay(s.startingPrice, "₹4,999");
            const originalPrice = formatPriceDisplay(s.originalPrice, "₹17,999");
            const badge = s.badge || "LIMITED OFFER";

            return (
              <Reveal key={s.id || s.num || i} delay={(i % 2) * 0.1}>
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 transition-all duration-500 hover:border-accent hover:shadow-xl hover:shadow-accent/10">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm text-accent font-bold">{s.num || `0${i + 1}`}</span>
                        {badge && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] tracking-wider text-emerald-400 font-bold uppercase">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            </span>
                            {badge}
                          </span>
                        )}
                      </div>
                      <a
                        href={s.href}
                        onClick={isHome ? handleScrollToHome : undefined}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        aria-label={`Open ${s.title}`}
                      >
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" aria-hidden />
                      </a>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-xl border border-border">
                      <a
                        href={s.href}
                        onClick={isHome ? handleScrollToHome : undefined}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="block overflow-hidden cursor-pointer"
                        title={isHome ? "Back to WebNoura home" : "View live website demo"}
                      >
                        <img
                          src={img}
                          alt={`${s.title.toLowerCase()} example preview`}
                          loading="lazy"
                          width={1440}
                          height={912}
                          className="aspect-[16/9] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </a>
                    </div>

                    <h3 className="mt-7 text-2xl font-bold md:text-3xl text-foreground">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>

                  {/* Pricing Box with Strikethrough & Instant Order Button */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <span className="label-mono !text-[0.62rem] !text-muted-foreground block">
                          SPECIAL LIMITED OFFER
                        </span>
                        <div className="flex items-baseline gap-2.5 mt-1">
                          <span className="font-display text-3xl md:text-4xl font-extrabold text-[#0B2D5B] tracking-tight">
                            {offerPrice}
                          </span>
                          {originalPrice && (
                            <span className="font-mono text-sm text-muted-foreground line-through decoration-rose-500 decoration-2 font-semibold">
                              {originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.dispatchEvent(new CustomEvent("open_enquiry_modal"));
                            }
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2.5 font-mono text-xs font-bold tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 cursor-pointer"
                        >
                          GET FOR {offerPrice} <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>

                        <a
                          href={s.href}
                          onClick={isHome ? handleScrollToHome : undefined}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="label-mono inline-flex items-center gap-1.5 !text-muted-foreground hover:!text-accent text-xs font-semibold ml-1"
                        >
                          {isHome ? "WebNoura" : "Live Demo"} <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function Testimonials() {
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    setReviews(adminStore.getTestimonials().filter((t) => t.is_approved));

    const handleUpdate = () => {
      setReviews(adminStore.getTestimonials().filter((t) => t.is_approved));
    };
    window.addEventListener("webnoura_store_change", handleUpdate);
    return () => window.removeEventListener("webnoura_store_change", handleUpdate);
  }, []);

  if (!mounted || reviews.length === 0) return null;

  return (
    <section id="reviews" className="border-t border-border py-24 md:py-36 bg-card/30">
      <Container>
        <Reveal>
          <SectionLabel>Client feedback &amp; Google reviews</SectionLabel>
          <H2>TRUSTED BY LOCAL BUSINESSES<br />&amp; FOUNDERS.</H2>
          <p className="mt-4 text-sm text-muted-foreground max-w-lg">
            See what hospitality brands, restaurant owners, gym directors, and creative professionals say about working with WebNoura.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/5">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.rating || 5)].map((_, sIdx) => (
                        <Star key={sIdx} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Verified Client
                    </span>
                  </div>

                  <p className="mt-5 text-sm md:text-base leading-relaxed text-foreground/90 font-medium italic">
                    "{r.review_text}"
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{r.client_name}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{r.role_or_business}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {r.source === "google_review" ? "Google Review" : "Client Feedback"}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const projects = [
  {
    id: "project-01",
    name: "GOLD HEALTH CLUB",
    cat: "Fitness Website",
    img: goldGym,
    mobileImg: goldGymMobile,
    url: "gold-gym-demo-website.vercel.app",
    liveUrl: "https://gold-gym-demo-website.vercel.app",
    isLive: true,
    d: "A bold, premium fitness club website featuring gym training zones, commercial biomechanics equipment, membership enquiries, and real local club credentials.",
  },
  {
    id: "project-02",
    name: "MAJHA CAFÉ & RESTAURANT",
    cat: "Restaurant & Café Website",
    img: majhaCafe,
    mobileImg: majhaMobile,
    url: "cafe-resturant-demo-website.vercel.app",
    liveUrl: "https://cafe-resturant-demo-website.vercel.app",
    isLive: true,
    d: "Cinematic dining photography, specialty coffee & morning bakery menus, chef signature dishes, and table reservation links built to turn casual visitors into guests."
  },
  {
    id: "project-03",
    name: "WEBNOURA CREATIVE STUDIO",
    cat: "Portfolio & Agency Website",
    img: webnoura,
    mobileImg: webnouraMobile,
    url: "webnoura.com",
    liveUrl: "/#home",
    isLive: true,
    d: "Our official WebNoura design studio website featuring Deep Navy aesthetics, responsive interactive showcases, modern typography, and a conversion-focused client enquiry system.",
  },
  {
    id: "project-04",
    name: "FABHOTEL PARK VIEW",
    cat: "Business & Hotel Website",
    img: fabHotel,
    mobileImg: fabHotelMobile,
    url: "fab-hotel-demo-website.vercel.app",
    liveUrl: "https://fab-hotel-demo-website.vercel.app",
    isLive: true,
    d: "A refined 3-star hospitality website featuring deluxe room previews, private washroom showcases, verified amenities, direct call booking, and interactive location navigation.",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="border-t border-border bg-secondary/40 py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionLabel>Selected website concepts</SectionLabel>
          <H2>DESIGNED TO LOOK DIFFERENT.<br /><span className="text-accent">BUILT TO WORK BEAUTIFULLY.</span></H2>
        </Reveal>
        <div className="mt-20 space-y-28 md:space-y-40">
          {projects.map((p, i) => {
            const isHome = p.liveUrl === "/#home";
            const handleScrollToHome = (e: React.MouseEvent) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (window.location.hash !== "#home") history.pushState(null, "", "/#home");
              }
            };

            return (
              <article id={p.id} key={p.id} className={cn("grid scroll-mt-28 items-center gap-10 lg:grid-cols-12", i % 2 && "lg:[&>*:first-child]:order-2")}>
                <Reveal className="relative lg:col-span-8">
                  <div className="group relative pr-[14%]">
                    <div className="overflow-hidden rounded-xl">
                      <div className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]">
                        {p.liveUrl ? (
                          <a
                            href={p.liveUrl}
                            onClick={isHome ? handleScrollToHome : undefined}
                            target={p.liveUrl.startsWith("http") ? "_blank" : undefined}
                            rel={p.liveUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block focus:outline-none"
                            title={`Visit ${p.name}`}
                          >
                            <BrowserFrame src={p.img} alt={`${p.name} desktop preview`} url={p.url} />
                          </a>
                        ) : (
                          <BrowserFrame src={p.img} alt={`${p.name} desktop preview`} url={p.url} />
                        )}
                      </div>
                    </div>
                    <PhoneFrame src={p.mobileImg || p.img} alt={`${p.name} mobile preview`} className="absolute right-0 -bottom-10 w-[22%]" />
                  </div>
                </Reveal>
                <Reveal delay={0.15} className="lg:col-span-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-accent">0{i + 1}</span>
                    {p.isLive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-400 uppercase">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </span>
                        {isHome ? "Live Website" : "Live Demo Website"}
                      </span>
                    ) : (
                      <span className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] tracking-widest text-accent uppercase">Concept Project</span>
                    )}
                  </div>
                  <h3 className="mt-5 text-3xl font-extrabold md:text-4xl">{p.name}</h3>
                  <p className="label-mono mt-3">{p.cat}</p>
                  <p className="mt-5 leading-relaxed text-muted-foreground">{p.d}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        onClick={isHome ? handleScrollToHome : undefined}
                        target={p.liveUrl.startsWith("http") ? "_blank" : undefined}
                        rel={p.liveUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-xs font-bold tracking-wider text-black transition-all duration-300 hover:glow-accent hover:-translate-y-0.5"
                      >
                        {isHome ? "Visit WebNoura" : "Visit Live Website"} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ) : null}
                    <a href="#enquiry" className="label-mono inline-flex items-center gap-2 !text-foreground hover:!text-accent">
                      {p.liveUrl ? "Enquire about this" : "Explore project"} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
        <Reveal className="mt-28 flex flex-col items-center gap-4 text-center">
          <p className="label-mono">All projects shown are demo concepts, not client work.</p>
          <Cta href="#enquiry">HAVE A BUSINESS? LET’S BUILD YOUR WEBSITE.</Cta>
        </Reveal>
      </Container>
    </section>
  );
}

const themes = [
  { name: "Bold", font: "font-display", bg: "bg-[#0B2D5B]", fg: "text-[#F8F9FA]" },
  { name: "Clean", font: "font-sans", bg: "bg-[#3B82F6]", fg: "text-white" },
  { name: "Minimal", font: "font-mono", bg: "bg-white", fg: "text-[#0B2D5B]" },
];

export function Quality() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [theme, setTheme] = useState(0);
  const [step, setStep] = useState(0);
  const widths = { desktop: "100%", tablet: "58%", mobile: "30%" };
  const t = themes[theme] ?? themes[0]!;
  const journey = ["Clear navigation", "Service information", "Contact button"];

  return (
    <section className="border-t border-border py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionLabel>Website quality</SectionLabel>
          <H2>EVERY DETAIL<br />HAS A PURPOSE.</H2>
        </Reveal>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <Smartphone className="h-6 w-6 text-accent" aria-hidden />
              <h3 className="mt-5 text-xl font-bold">RESPONSIVE BY DESIGN</h3>
              <p className="mt-2 text-sm text-muted-foreground">One website, adapted to every screen.</p>
              <div className="mt-6 flex h-48 items-center justify-center rounded-xl bg-background p-4">
                <motion.div layout animate={{ width: widths[device] }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="overflow-hidden rounded-md border border-border">
                  <img src={fabHotel} alt="Business and hotel website shown at different screen sizes" loading="lazy" className={cn("h-36 w-full object-cover", device === "desktop" ? "object-top" : "object-left-top")} />
                </motion.div>
              </div>
              <div className="mt-4 flex gap-2" role="group" aria-label="Choose device">
                {(["desktop", "tablet", "mobile"] as const).map((d) => (
                  <button key={d} onClick={() => setDevice(d)} aria-pressed={device === d} className={cn("flex-1 rounded-full border py-2 font-mono text-[11px] uppercase tracking-wider transition-colors", device === d ? "border-accent text-accent" : "border-border text-muted-foreground hover:text-foreground")}>{d}</button>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <Palette className="h-6 w-6 text-accent" aria-hidden />
              <h3 className="mt-5 text-xl font-bold">DESIGNED AROUND YOUR BRAND</h3>
              <p className="mt-2 text-sm text-muted-foreground">Typography, colour and layout made to feel like you.</p>
              <motion.div key={theme} initial={{ opacity: 0.4, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className={cn("mt-6 flex h-48 flex-col justify-between rounded-xl p-5", t.bg, t.fg)}>
                <span className={cn("text-xs opacity-70", t.font)}>YOUR BRAND</span>
                <span className={cn("text-3xl leading-none font-bold", t.font)}>Good food,<br />made slowly.</span>
                <span className={cn("self-start rounded-full border border-current px-3 py-1 text-[11px]", t.font)}>Book a table</span>
              </motion.div>
              <div className="mt-4 flex gap-2" role="group" aria-label="Choose style">
                {themes.map((th, i) => (
                  <button key={th.name} onClick={() => setTheme(i)} aria-pressed={theme === i} className={cn("flex-1 rounded-full border py-2 font-mono text-[11px] uppercase tracking-wider transition-colors", theme === i ? "border-accent text-accent" : "border-border text-muted-foreground hover:text-foreground")}>{th.name}</button>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <ScanSearch className="h-6 w-6 text-accent" aria-hidden />
              <h3 className="mt-5 text-xl font-bold">BUILT FOR A CLEAR USER JOURNEY</h3>
              <p className="mt-2 text-sm text-muted-foreground">Visitors find what they need, then reach you.</p>
              <div className="mt-6 flex h-48 flex-col gap-3 rounded-xl bg-background p-4">
                <div className={cn("flex h-7 items-center justify-between rounded-md border px-3 transition-colors", step === 0 ? "border-accent" : "border-border")}>
                  <span className="h-1.5 w-10 rounded bg-muted-foreground/40" />
                  <span className="flex gap-1.5">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-6 rounded bg-muted-foreground/30" />)}</span>
                </div>
                <div className={cn("grid flex-1 grid-cols-3 gap-2 rounded-md border p-2 transition-colors", step === 1 ? "border-accent" : "border-border")}>
                  {[0, 1, 2].map((k) => <span key={k} className="rounded bg-muted" />)}
                </div>
                <div className={cn("mx-auto h-8 w-32 rounded-full transition-colors", step === 2 ? "bg-primary" : "bg-muted")} />
              </div>
              <div className="mt-4 flex gap-2" role="group" aria-label="Journey step">
                {journey.map((j, i) => (
                  <button key={j} onClick={() => setStep(i)} aria-pressed={step === i} className={cn("flex-1 rounded-full border py-2 font-mono text-[10px] uppercase tracking-wider transition-colors", step === i ? "border-accent text-accent" : "border-border text-muted-foreground hover:text-foreground")}>{j.split(" ")[0]}</button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

const steps = [
  ["DISCOVER", "We learn about your business, services, audience, and website goals."],
  ["PLAN", "We organize the content, page structure, visual direction, and key actions."],
  ["DESIGN & BUILD", "We create your website with responsive layouts, polished visuals, and appropriate interactions."],
  ["REVIEW & LAUNCH", "We review the website with you, make agreed changes, and prepare it for launch according to the project scope."],
];

export function Process() {
  return (
    <section id="process" className="border-t border-border py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionLabel>Simple process. Clear communication.</SectionLabel>
          <H2>FROM YOUR IDEA TO<br />YOUR LIVE WEBSITE.</H2>
        </Reveal>
        <ol className="relative mt-20 grid gap-12 md:grid-cols-4 md:gap-6">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[7px] left-0 hidden h-px w-full origin-left bg-accent/60 md:block"
          />
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6 }}
            className="absolute top-0 left-[7px] h-full w-px origin-top bg-accent/60 md:hidden"
          />
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={0.2 + i * 0.15}>
              <li className="relative pl-10 md:pl-0">
                <span className="absolute top-0 left-0 h-[15px] w-[15px] rounded-full border-2 border-accent bg-background md:relative md:block" />
                <p className="font-mono text-sm text-accent md:mt-8">0{i + 1}</p>
                <h3 className="mt-3 text-2xl font-bold">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

const features = [
  [Palette, "CUSTOM VISUAL DIRECTION", "A design that fits your business rather than a generic one-size-fits-all layout."],
  [Smartphone, "MOBILE-FRIENDLY DESIGN", "A clear, usable experience across phones, tablets, and desktops."],
  [ScanSearch, "DETAIL-FOCUSED EXECUTION", "Careful attention to typography, spacing, images, navigation, and interactions."],
  [MessagesSquare, "CLEAR COMMUNICATION", "A straightforward process that keeps the project focused on your goals."],
] as const;

export function Why() {
  return (
    <section className="border-t border-border bg-secondary/40 py-24 md:py-36">
      <Container>
        <Reveal>
          <SectionLabel>Why choose WebNoura</SectionLabel>
          <H2>YOUR BUSINESS IS UNIQUE.<br /><span className="text-muted-foreground">YOUR WEBSITE SHOULD BE TOO.</span></H2>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="h-full">
              <div className="group h-full bg-background p-7 transition-colors hover:bg-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:rotate-12 group-hover:border-accent">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                </span>
                <h3 className="mt-8 text-lg font-bold">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="border-t border-border py-24 md:py-36">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8">
            <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="bg-spot absolute inset-0" aria-hidden />
            
            {/* Ambient decorative glowing rings */}
            <div className="absolute h-72 w-72 rounded-full bg-accent/15 blur-2xl" aria-hidden />
            <div className="absolute h-64 w-64 rounded-full border border-accent/25 animate-spin [animation-duration:25s]" aria-hidden />
            <div className="absolute h-72 w-72 rounded-full border border-dashed border-border" aria-hidden />

            <div className="animate-float-slow relative flex flex-col items-center text-center">
              <div className="relative flex h-44 w-44 md:h-52 md:w-52 items-center justify-center rounded-full bg-white p-3 shadow-2xl shadow-accent/25 ring-4 ring-accent/40 transition-transform duration-500 hover:scale-105">
                <img
                  src="/logo.jpg?v=2"
                  alt="Webnoura by Karan"
                  className="h-full w-full rounded-full object-contain p-2"
                />
              </div>
              <div className="mt-5">
                <span className="font-display text-2xl font-extrabold tracking-tight">
                  Web<span className="text-accent">noura</span>
                </span>
                <span className="label-mono mt-1 block !text-[0.68rem] text-muted-foreground">Studio · by Karan</span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <SectionLabel>The person behind WebNoura</SectionLabel>
          <H2>CREATIVE WEBSITES.<br />BUILT WITH PURPOSE.</H2>
          <p className="mt-7 max-w-lg leading-relaxed text-muted-foreground">
            I’m Karan, the person behind WebNoura. I focus on creating modern websites that combine thoughtful design, smooth interactions, and a professional user experience. My goal is to help businesses present their services clearly and build a stronger presence online.
          </p>
          <div className="mt-9"><Cta href="#enquiry">LET’S WORK TOGETHER</Cta></div>
        </Reveal>
      </Container>
    </section>
  );
}

export function Contact() {
  const items = [
    { label: "EMAIL ME", value: CONTACT.email, href: CONTACT.email ? `mailto:${CONTACT.email}` : null, Icon: Mail, placeholder: "[YOUR EMAIL]" },
    {
      label: "CHAT ON WHATSAPP",
      value: CONTACT.whatsapp,
      href: CONTACT.whatsapp
        ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
            "Hello! I visited your website and I'm interested in getting a custom website built. Please share the details and pricing."
          )}`
        : null,
      Icon: MessageCircle,
      placeholder: "[YOUR WHATSAPP NUMBER]",
    },
    { label: "VIEW INSTAGRAM", value: CONTACT.instagram ? "@webnoura.com_" : null, href: CONTACT.instagram, Icon: Instagram, placeholder: "[YOUR INSTAGRAM URL]" },
  ];
  return (
    <section id="contact" className="border-t border-border py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionLabel>Contact</SectionLabel>
          <H2>LET’S TALK ABOUT<br />YOUR WEBSITE.</H2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map(({ label, value, href, Icon, placeholder }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              {href ? (
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent">
                  <span><Icon className="h-5 w-5 text-accent" aria-hidden /><span className="mt-4 block font-bold">{label}</span><span className="mt-1 block text-sm text-muted-foreground">{value}</span></span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
              ) : (
                <div aria-disabled className="flex items-center justify-between rounded-2xl border border-dashed border-border p-6 opacity-60">
                  <span><Icon className="h-5 w-5 text-muted-foreground" aria-hidden /><span className="mt-4 block font-bold">{label}</span><span className="mt-1 block font-mono text-xs text-muted-foreground">{placeholder}</span></span>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-[#1E4378] bg-gradient-to-br from-[#061833] via-[#0B2D5B] to-[#0A2548] text-[#F8F9FA] py-28 md:py-40">
      <div className="bg-spot absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-1/2 hidden w-[520px] -translate-y-1/2 lg:block" aria-hidden style={{ perspective: 1200 }}>
        <div className="animate-float-slow" style={{ transform: "rotateY(-22deg) rotateX(8deg)" }}>
          <BrowserFrame src={gym} alt="" url="your-next-website.com" className="opacity-40" />
        </div>
      </div>
      <Container className="relative">
        <Reveal className="max-w-4xl">
          <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[0.95] font-extrabold text-[#F8F9FA]">
            YOUR NEXT WEBSITE STARTS WITH <span className="text-[#3B82F6]">ONE CONVERSATION.</span>
          </h2>
          <p className="mt-7 max-w-xl text-[#CBD5E1] md:text-lg">
            Have an idea, a business, or a website that needs a fresh start? Let’s build something that represents your brand properly.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Cta href="#enquiry" className="bg-[#F8F9FA] text-[#0B2D5B] hover:bg-white font-bold hover:shadow-xl hover:shadow-[#3B82F6]/25">LET’S BUILD YOUR WEBSITE</Cta>
            <Cta href="#portfolio" variant="ghost" className="border-[#3B82F6]/50 text-[#F8F9FA] hover:bg-[#3B82F6]/15 hover:border-[#3B82F6]">VIEW OUR WORK</Cta>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function Footer() {
  const nav = [["Home", "/#home"], ["Services", "/#services"], ["Portfolio", "/#portfolio"], ["About", "/#about"], ["Contact", "/#contact"]];
  return (
    <footer className="border-t border-[#1E4378] bg-[#061833] text-[#F8F9FA] py-14">
      <Container>
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Wordmark size="lg" light={true} />
            <p className="mt-3 text-sm text-[#94A3B8]">Website design &amp; development by Karan.</p>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {nav.map(([l, h]) => <li key={h}><a href={h} className="text-[#CBD5E1] transition-colors hover:text-[#3B82F6]">{l}</a></li>)}
            {CONTACT.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CBD5E1] transition-colors hover:text-[#25D366] flex items-center gap-1.5"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-[#25D366]" />
                  WhatsApp
                </a>
              </li>
            )}
            {CONTACT.instagram && <li><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-[#CBD5E1] transition-colors hover:text-[#3B82F6]">Instagram</a></li>}
            {CONTACT.email && <li><a href={`mailto:${CONTACT.email}`} className="text-[#CBD5E1] transition-colors hover:text-[#3B82F6]">Email</a></li>}
          </ul>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="label-mono !text-[0.65rem] !text-[#94A3B8]">© 2026 WEBNOURA BY KARAN. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap gap-6 text-xs text-[#94A3B8]">
            <a href="/terms" className="transition-colors hover:text-[#3B82F6]">Terms &amp; Conditions</a>
            <a href="/privacy" className="transition-colors hover:text-[#3B82F6]">Privacy Policy</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
