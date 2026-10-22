import { useState } from "react";
import {
  Star,
  Plus,
  CheckCircle2,
  Trash2,
  Sparkles,
  MessageSquare,
  Globe,
  Quote,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { ClientTestimonial } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";

interface TestimonialsTabProps {
  testimonials: ClientTestimonial[];
  onRefresh: () => void;
}

export function TestimonialsTab({ testimonials, onRefresh }: TestimonialsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [clientName, setClientName] = useState("");
  const [roleOrBusiness, setRoleOrBusiness] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [source, setSource] = useState<ClientTestimonial["source"]>("google_review");
  const [isApproved, setIsApproved] = useState(true);

  const approvedCount = testimonials.filter((t) => t.is_approved).length;

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !reviewText.trim()) return;

    adminStore.addTestimonial({
      client_name: clientName.trim(),
      role_or_business: roleOrBusiness.trim() || "Business Owner",
      rating: parseInt(rating, 10) || 5,
      review_text: reviewText.trim(),
      source,
      date: new Date().toISOString().slice(0, 10),
      is_approved: isApproved,
    });

    onRefresh();
    setIsModalOpen(false);
    // Reset form
    setClientName("");
    setRoleOrBusiness("");
    setReviewText("");
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-extrabold text-white">
                  Testimonials &amp; Reviews Manager
                </h1>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                  {approvedCount} Live on Homepage
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Manage Google reviews and client feedback. Toggle approval to showcase your best reviews on the website homepage.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/20"
          >
            <Plus className="h-4 w-4" /> Add Client Review
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Total Reviews</span>
          <p className="font-display text-3xl font-extrabold text-white mt-2">{testimonials.length}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Feedback in repository</p>
        </div>

        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Showcased on Home</span>
          <p className="font-display text-3xl font-extrabold text-emerald-400 mt-2">{approvedCount}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Approved for public display</p>
        </div>

        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Studio Rating</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-display text-3xl font-extrabold text-amber-400">5.0</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">100% positive client feedback</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`rounded-3xl border p-6 transition-all shadow-lg flex flex-col justify-between space-y-4 ${
              t.is_approved
                ? "border-[#1E4378] bg-[#0B2D5B]/60"
                : "border-[#1E4378]/40 bg-[#061833]/50 opacity-70"
            }`}
          >
            <div>
              {/* Header with stars & Homepage Toggle */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>

                {/* Homepage Approval Switch */}
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      t.is_approved ? "text-emerald-400" : "text-[#64748B]"
                    }`}
                  >
                    {t.is_approved ? "Home Showcase" : "Hidden"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t.is_approved}
                      onChange={(e) => {
                        adminStore.toggleTestimonialApproval(t.id, e.target.checked);
                        onRefresh();
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-[#061833] border border-[#1E4378] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Review Text */}
              <p className="mt-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed italic">
                "{t.review_text}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-[#1E4378]/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-white">{t.client_name}</h4>
                <p className="text-[11px] text-[#94A3B8] font-medium">{t.role_or_business}</p>
                <span className="font-mono text-[9px] text-[#64748B] uppercase block mt-0.5">
                  {t.source === "google_review" ? "Google Review" : "Client Feedback"}
                </span>
              </div>

              <button
                onClick={() => {
                  if (confirm("Delete this review?")) {
                    adminStore.deleteTestimonial(t.id);
                    onRefresh();
                  }
                }}
                className="text-[#64748B] hover:text-rose-400 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1E4378] bg-[#061833] text-white p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-[#0B2D5B] text-[#94A3B8] hover:text-white flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-extrabold text-white">
                  Add Client Testimonial / Google Review
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Add verified feedback to feature in your studio portfolio &amp; homepage
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurpreet Singh"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Role / Business *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Owner, Royal Palace Hotel"
                    value={roleOrBusiness}
                    onChange={(e) => setRoleOrBusiness(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars (Great)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Feedback Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                  >
                    <option value="google_review">Google Review</option>
                    <option value="whatsapp_feedback">WhatsApp Feedback</option>
                    <option value="direct_client">Direct Client Interview</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Review Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What did the client say about your web design, turnaround time, or communication?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3.5 py-2 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="rounded border-[#1E4378] bg-[#061833] text-emerald-500"
                  />
                  <span>Showcase immediately on the website homepage</span>
                </label>
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
