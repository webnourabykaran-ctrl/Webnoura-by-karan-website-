import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BrowserFrame, Cta } from "./primitives";
import gym from "@/assets/mock-gym.jpg";
import restaurant from "@/assets/mock-restaurant.jpg";
import portfolio from "@/assets/mock-portfolio.jpg";
import business from "@/assets/mock-business.jpg";
import fabHotel from "@/assets/fab-hotel.png";
import goldGym from "@/assets/gold-gym.png";
import webnoura from "@/assets/webnoura.png";

const line1 = ["WE", "HELP", "YOUR", "BUSINESS"];
const line2 = ["GROW", "STRONGER", "&", "SCALE."];

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const rotY = useTransform(sx, [-0.5, 0.5], [6, -6]);
  const rotX = useTransform(sy, [-0.5, 0.5], [-4, 4]);
  const shiftA = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const shiftB = useTransform(sx, [-0.5, 0.5], [12, -12]);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20 bg-gradient-to-b from-[#061833] via-[#0B2D5B] to-[#0A2548] text-[#F8F9FA]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <div className="bg-spot absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="label-mono mb-6 flex items-center gap-3 !text-[#93C5FD]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B82F6]" />
            Digital Growth & Brand Partner · by Karan
          </motion.p>
          <h1 className="text-[clamp(2.1rem,4.8vw,4.5rem)] leading-[1.02] font-extrabold tracking-tight text-[#F8F9FA]">
            {/* Line 1: White */}
            <span className="block mb-1 sm:mb-2">
              {line1.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pr-[0.24em] align-bottom">
                  <motion.span
                    className="inline-block text-[#F8F9FA]"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.85, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>

            {/* Line 2: Blue Glow */}
            <span className="block text-[#3B82F6]">
              {line2.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pr-[0.24em] align-bottom">
                  <motion.span
                    className="inline-block text-[#3B82F6]"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.85, delay: 0.42 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-[#CBD5E1] md:text-lg"
          >
            We don’t just build websites — we partner with businesses to elevate your brand authority, outshine competitors, and turn everyday visitors into loyal paying customers.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="mt-9 flex flex-wrap gap-3">
            <Cta href="#enquiry" className="bg-[#F8F9FA] text-[#0B2D5B] hover:bg-white hover:shadow-xl hover:shadow-[#3B82F6]/30 font-bold">LET’S GROW YOUR BUSINESS</Cta>
            <Cta href="#portfolio" variant="ghost" className="border-[#3B82F6]/50 text-[#F8F9FA] hover:bg-[#3B82F6]/15 hover:border-[#3B82F6]" icon={<ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />}>
              EXPLORE OUR WORK
            </Cta>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1400 }}
          className="relative mx-auto aspect-[5/4] w-full max-w-[640px]"
          aria-label="Website concept previews"
        >
          <motion.div style={{ x: shiftB }} className="absolute top-0 right-0 w-[62%] opacity-70">
            <div className="animate-float-slow"><BrowserFrame src={webnoura} alt="WebNoura studio website preview" url="webnoura.com" eager /></div>
          </motion.div>
          <motion.div style={{ x: shiftA }} className="absolute top-[6%] left-0 w-[58%] opacity-80">
            <div className="animate-float-slow [animation-delay:-3s]"><BrowserFrame src={fabHotel} alt="FabHotel Park View website preview" url="fab-hotel-demo-website.vercel.app" eager /></div>
          </motion.div>
          <motion.div style={{ x: shiftB }} className="absolute bottom-[4%] left-[2%] w-[60%]">
            <div className="animate-float [animation-delay:-2s]"><BrowserFrame src={restaurant} alt="MAJHA Café & Restaurant website" url="cafe-resturant-demo-website.vercel.app" eager /></div>
          </motion.div>
          <motion.div style={{ x: shiftA }} className="absolute right-[2%] bottom-[16%] z-10 w-[66%]">
            <div className="animate-float"><BrowserFrame src={goldGym} alt="Gold Health Club premium gym website" url="gold-gym-demo-website.vercel.app" eager className="glow-accent" /></div>
          </motion.div>
        </motion.div>
      </div>

      <a href="#intro" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" aria-label="Scroll down">
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-2">
          <span className="animate-scroll-dot h-1.5 w-1 rounded-full bg-[#3B82F6]" />
        </span>
        <span className="label-mono !text-[0.6rem] !text-[#94A3B8]">Scroll</span>
      </a>
    </section>
  );
}

export function Marquee() {
  const items = ["BUSINESS & HOTEL WEBSITES", "RESTAURANT WEBSITES", "GYM WEBSITES", "PORTFOLIO WEBSITES", "LANDING PAGES"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[#1E4378] bg-[#061833] py-5" aria-label={items.join(", ")}>
      <div className="animate-marquee flex w-max gap-10" aria-hidden>
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-lg font-bold tracking-tight whitespace-nowrap text-[#F8F9FA]/90 md:text-xl">
            {t}
            <span className="text-[#3B82F6]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
