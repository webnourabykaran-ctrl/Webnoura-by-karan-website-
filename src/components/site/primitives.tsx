import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="label-mono flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </p>
  );
}

type CtaProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function Cta({ href, children, variant = "primary", className, icon, onClick }: CtaProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (href === "#enquiry" || href === "/#enquiry") {
      e.preventDefault();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open_enquiry_modal"));
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:glow-accent hover:-translate-y-0.5"
          : "border border-border text-foreground hover:border-foreground/40 hover:bg-secondary",
        className,
      )}
    >
      {children}
      {icon ?? (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      )}
    </a>
  );
}

export function BrowserFrame({
  src,
  alt,
  url,
  className,
  eager,
}: { src: string; alt: string; url: string; className?: string; eager?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-float", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-3 truncate rounded-md bg-background/60 px-3 py-0.5 font-mono text-[10px] text-muted-foreground">{url}</span>
      </div>
      <img
        src={src}
        alt={alt}
        width={1440}
        height={912}
        loading={eager ? "eager" : "lazy"}
        className="block aspect-[1440/912] w-full object-cover object-top"
      />
    </div>
  );
}

export function PhoneFrame({ src, alt, className, position = "left" }: { src: string; alt: string; className?: string; position?: "left" | "center" }) {
  return (
    <div className={cn("overflow-hidden rounded-[1.6rem] border-[5px] border-secondary bg-card shadow-float ring-1 ring-border", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={1440}
        height={912}
        className={cn("block aspect-[9/19] w-full object-cover", position === "left" ? "object-left" : "object-center")}
      />
    </div>
  );
}

export function Wordmark({
  className,
  size = "md",
  showText = true,
  light = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  light?: boolean;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10 md:h-11 md:w-11",
    lg: "h-14 w-14 md:h-16 md:w-16",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-3 group select-none", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-white p-[3px] shadow-lg shadow-[#3B82F6]/25 ring-2 ring-[#3B82F6]/60 transition-all duration-300 group-hover:scale-105 group-hover:ring-[#3B82F6] group-hover:shadow-[#3B82F6]/50",
          sizeClasses,
        )}
      >
        <img
          src="/logo.jpg?v=2"
          alt="Webnoura by Karan Logo"
          className="h-full w-full rounded-full object-contain"
          loading="eager"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <span className={cn("font-display text-lg md:text-xl font-extrabold tracking-tight transition-colors", light ? "text-white" : "text-[#0B2D5B]")}>
            Web<span className="text-[#3B82F6]">noura</span>
          </span>
          <span className={cn("label-mono !text-[0.62rem] -mt-0.5", light ? "!text-[#93C5FD]" : "!text-[#64748B]")}>
            by Karan
          </span>
        </div>
      )}
    </div>
  );
}
