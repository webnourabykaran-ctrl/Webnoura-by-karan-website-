import { useState } from "react";
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  Clock,
  Sparkles,
  DollarSign,
  X,
  AlertCircle,
} from "lucide-react";
import { PromoCoupon } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";

interface CouponsTabProps {
  coupons: PromoCoupon[];
  onRefresh: () => void;
}

export function CouponsTab({ coupons, onRefresh }: CouponsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("20");
  const [minOrder, setMinOrder] = useState("3000");
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [maxUses, setMaxUses] = useState("50");
  const [description, setDescription] = useState("");

  const totalUsed = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);
  const activeCount = coupons.filter((c) => c.active).length;

  const handleCopyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    adminStore.addCoupon({
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: parseInt(discountValue, 10) || 20,
      min_order_value: parseInt(minOrder, 10) || 0,
      expiry_date: expiryDate,
      max_uses: parseInt(maxUses, 10) || 50,
      active: true,
      description: description.trim() || `Special ${discountType === "percentage" ? `${discountValue}%` : `₹${discountValue}`} discount coupon`,
    });

    onRefresh();
    setIsModalOpen(false);
    setCode("");
    setDescription("");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Tag className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-extrabold text-white">
                  Promo Codes &amp; Discount Manager
                </h1>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                  {activeCount} Active Coupons
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Create and track festival &amp; occasion coupon codes (e.g. FESTIVE20) applied on website checkout
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/20"
          >
            <Plus className="h-4 w-4" /> Create Promo Code
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Active Coupons</span>
          <p className="font-display text-3xl font-extrabold text-white mt-2">{activeCount}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Ready for client checkout</p>
        </div>

        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Total Redemptions</span>
          <p className="font-display text-3xl font-extrabold text-emerald-400 mt-2">{totalUsed}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Times coupons were applied</p>
        </div>

        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Festival Offers</span>
          <p className="font-display text-xl font-bold text-white mt-2">FESTIVE20 &amp; DIWALI50</p>
          <p className="text-xs text-[#94A3B8] mt-1">Configured for ₹4,999 packages</p>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => {
          const isExpired = new Date(c.expiry_date) < new Date();
          const usagePercent = Math.min(100, Math.round((c.used_count / (c.max_uses || 1)) * 100));

          return (
            <div
              key={c.id}
              className={`rounded-3xl border p-6 transition-all shadow-lg flex flex-col justify-between space-y-4 ${
                c.active && !isExpired
                  ? "border-[#1E4378] bg-[#0B2D5B]/60"
                  : "border-[#1E4378]/40 bg-[#061833]/40 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-white bg-[#061833] border border-[#1E4378] px-3 py-1 rounded-xl">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(c.code)}
                      title="Copy code"
                      className="text-[#93C5FD] hover:text-white p-1"
                    >
                      {copiedCode === c.code ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Active Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={c.active}
                      onChange={(e) => {
                        adminStore.toggleCoupon(c.id, e.target.checked);
                        onRefresh();
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#061833] border border-[#1E4378] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                  </label>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black text-emerald-400">
                    {c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                  </span>
                  {c.min_order_value ? (
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      Min: ₹{c.min_order_value.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-xs text-[#CBD5E1] line-clamp-2">{c.description}</p>
              </div>

              {/* Usage & Expiry Bar */}
              <div className="space-y-2 pt-3 border-t border-[#1E4378]/60 font-mono text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#94A3B8]">
                    Used: {c.used_count} / {c.max_uses}
                  </span>
                  <span className="text-[#93C5FD]">{usagePercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#061833] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#3B82F6]"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Expires: {new Date(c.expiry_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>

                  <button
                    onClick={() => {
                      if (confirm(`Delete coupon ${c.code}?`)) {
                        adminStore.deleteCoupon(c.id);
                        onRefresh();
                      }
                    }}
                    className="text-[#64748B] hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1E4378] bg-[#061833] text-white p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-[#0B2D5B] text-[#94A3B8] hover:text-white flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-extrabold text-white">
                  Create New Promo Code
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Define discount rules for festivals, new launches, or special clients
                </p>
              </div>

              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20 or NEWYEAR30"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3.5 py-2 text-xs font-mono text-white uppercase focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Flat Cash Reduction (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">
                    Value ({discountType === "percentage" ? "%" : "₹"}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Max Uses Allowed</label>
                  <input
                    type="number"
                    required
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali celebration 20% discount on all packages"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#1E4378] bg-[#061833] text-[#94A3B8] px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2 text-xs font-bold shadow-md"
                >
                  Save &amp; Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
