import React from "react";
import { Globe } from "lucide-react";
import { useAdminLanguage } from "@/lib/adminLanguage";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useAdminLanguage();

  return (
    <div
      className="inline-flex items-center rounded-2xl border border-[#1E4378] bg-[#0A2548]/90 p-1 shadow-inner backdrop-blur-sm"
      role="group"
      aria-label="Language Switcher"
    >
      {/* English Toggle */}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        title="Switch to English"
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          language === "en"
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
            : "text-[#94A3B8] hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="text-xs">🇬🇧</span>
        <span>English</span>
      </button>

      {/* Punjabi Toggle */}
      <button
        type="button"
        onClick={() => setLanguage("pa")}
        title="ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲੋ (Switch to Punjabi)"
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          language === "pa"
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
            : "text-[#94A3B8] hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="text-xs">🇮🇳</span>
        <span>ਪੰਜਾਬੀ</span>
      </button>
    </div>
  );
}
