import { useState } from "react";
import { Plus, Edit2, Trash2, Layers, ExternalLink, Check, X, Sparkles, Tag } from "lucide-react";
import { AdminService } from "@/types/admin";
import { adminStore, formatPriceDisplay } from "@/lib/adminStore";

interface ServicesTabProps {
  services: AdminService[];
  onRefresh: () => void;
}

export function ServicesTab({ services, onRefresh }: ServicesTabProps) {
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startingPrice, setStartingPrice] = useState("4999");
  const [originalPrice, setOriginalPrice] = useState("17999");
  const [badge, setBadge] = useState("72% OFF");
  const [href, setHref] = useState("");

  const handleOpenAdd = () => {
    setTitle("");
    setDesc("");
    setStartingPrice("4999");
    setOriginalPrice("17999");
    setBadge("72% OFF");
    setHref("https://demo-website.vercel.app");
    setIsAdding(true);
    setEditingService(null);
  };

  const handleOpenEdit = (srv: AdminService) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDesc(srv.desc);
    setStartingPrice(srv.startingPrice || "4999");
    setOriginalPrice(srv.originalPrice || "17999");
    setBadge(srv.badge || "72% OFF");
    setHref(srv.href);
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;

    if (editingService) {
      adminStore.updateService(editingService.id, {
        title,
        desc,
        startingPrice,
        originalPrice,
        badge,
        href,
      });
    } else {
      adminStore.addService({
        num: String(services.length + 1).padStart(2, "0"),
        title,
        desc,
        startingPrice,
        originalPrice,
        badge,
        href,
        isLive: true,
      });
    }

    setEditingService(null);
    setIsAdding(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      adminStore.deleteService(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-extrabold text-white">Services & Pricing Packages</h2>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400 font-bold uppercase">
              Live on Website
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Prices set here update automatically on the website with strikethrough regular price (e.g. ~~₹17,999~~ → ₹4,999)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/30 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add New Package
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((srv, idx) => {
          const formattedOffer = formatPriceDisplay(srv.startingPrice, "₹4,999");
          const formattedOriginal = formatPriceDisplay(srv.originalPrice, "₹17,999");

          return (
            <div
              key={srv.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 backdrop-blur-md shadow-xl transition-all hover:border-[#3B82F6]/60"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#3B82F6]">{srv.num || `0${idx + 1}`}</span>
                    {srv.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 px-2 py-0.5 font-mono text-[9px] text-[#93C5FD] font-bold uppercase">
                        <Tag className="h-2.5 w-2.5 text-[#3B82F6]" /> {srv.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      title="Edit Package & Price"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E4378] bg-[#061833] text-[#CBD5E1] hover:border-[#3B82F6] hover:text-white transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      title="Delete Service"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E4378] bg-[#061833] text-[#64748B] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-white group-hover:text-[#93C5FD] transition-colors">
                  {srv.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#CBD5E1]">
                  {srv.desc}
                </p>
              </div>

              {/* Price Tag with Strikethrough Display */}
              <div className="mt-6 pt-4 border-t border-[#1E4378]/70 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] block">
                    Special Offer Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-base font-extrabold text-emerald-400">
                      {formattedOffer}
                    </span>
                    {formattedOriginal && (
                      <span className="font-mono text-xs text-[#94A3B8] line-through decoration-rose-500/70">
                        {formattedOriginal}
                      </span>
                    )}
                  </div>
                </div>

                {srv.href && (
                  <a
                    href={srv.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#93C5FD] hover:text-white transition-colors"
                  >
                    View Demo <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {(isAdding || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1E4378] bg-[#0B2D5B] p-6 md:p-8 text-white shadow-2xl">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingService(null);
              }}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-xl font-extrabold text-white">
              {editingService ? "Edit Website Package & Pricing" : "Add Website Package"}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Changes update immediately on the public website with strikethrough discount
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RESTAURANT & CAFÉ WEBSITES"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                  Package Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain features, menus, galleries, speed, mobile optimization..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-[#1E4378] bg-[#061833]/60">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1.5">
                    Offer Price (Now) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4999"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full rounded-xl border border-emerald-500/50 bg-[#061833] px-3.5 py-2.5 text-sm font-mono font-bold text-emerald-300 focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="font-mono text-[10px] text-[#94A3B8] mt-1 block">
                    Displays as: {formatPriceDisplay(startingPrice, "₹4,999")}
                  </span>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                    Original Price (Cut/Strikethrough)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 17999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm font-mono text-[#CBD5E1] line-through focus:border-[#3B82F6] focus:outline-none"
                  />
                  <span className="font-mono text-[10px] text-[#94A3B8] mt-1 block">
                    Cut price: {formatPriceDisplay(originalPrice, "₹17,999")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                    Offer Badge / Discount Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 72% OFF or LIMITED OFFER"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                    Live Demo Destination URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#1E4378]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingService(null);
                  }}
                  className="rounded-xl border border-[#1E4378] px-4 py-2 text-xs font-semibold text-[#CBD5E1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] px-6 py-2 text-xs font-bold text-white transition-all shadow-md shadow-[#3B82F6]/30"
                >
                  Save & Update Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
