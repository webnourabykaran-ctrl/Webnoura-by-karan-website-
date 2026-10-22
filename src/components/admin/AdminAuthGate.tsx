import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck, KeyRound, User, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { adminStore } from "@/lib/adminStore";

interface AdminAuthGateProps {
  onSuccess: () => void;
}

export function AdminAuthGate({ onSuccess }: AdminAuthGateProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      const ok = adminStore.authenticate(username, password);
      if (ok) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 400);
      } else {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#061833] text-[#F8F9FA] px-4 py-12 overflow-hidden selection:bg-[#3B82F6] selection:text-white">
      {/* Dynamic ambient background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#3B82F6]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1E4378]/40 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/80 p-8 md:p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2.5 shadow-xl shadow-[#3B82F6]/30 ring-4 ring-[#3B82F6]/50 transition-transform hover:scale-105">
            <img src="/logo.jpg?v=2" alt="Webnoura by Karan" className="h-full w-full rounded-full object-contain" />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-md">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3 py-1 font-mono text-[11px] tracking-widest text-[#93C5FD] uppercase">
            <KeyRound className="h-3 w-3 text-[#3B82F6]" /> Admin Secure Portal
          </span>

          <h1 className="mt-4 font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Web<span className="text-[#3B82F6]">noura</span> Admin
          </h1>
          <p className="mt-2 text-xs md:text-sm text-[#94A3B8]">
            Master Management Portal · Karan
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {/* Username Field */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-2">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin username"
                className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm font-medium bg-[#061833]/80 text-white placeholder:text-[#64748B] transition-all focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-[#1E4378] focus:border-[#3B82F6] focus:ring-[#3B82F6]/30"
                }`}
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-2">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter master password"
                className={`w-full rounded-xl border pl-10 pr-11 py-3 text-sm font-medium bg-[#061833]/80 text-white placeholder:text-[#64748B] transition-all focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-[#1E4378] focus:border-[#3B82F6] focus:ring-[#3B82F6]/30"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security indicator */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#93C5FD]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" /> Direct Protected Login
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">Karan Master Access</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-3.5 px-4 text-sm transition-all duration-300 shadow-lg shadow-[#3B82F6]/30 hover:shadow-[#3B82F6]/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying Credentials...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> Access Granted
              </span>
            ) : (
              <>
                Unlock Admin Dashboard <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#1E4378]/70 text-center">
          <a
            href="/"
            className="text-xs text-[#94A3B8] hover:text-white transition-colors"
          >
            ← Back to WebNoura Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
