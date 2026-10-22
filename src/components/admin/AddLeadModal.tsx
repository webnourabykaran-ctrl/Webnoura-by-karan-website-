import { useState } from "react";
import { X, UserPlus, Sparkles, Building, Mail, Phone, IndianRupee } from "lucide-react";
import { adminStore } from "@/lib/adminStore";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WEBSITE_TYPES = [
  "Business & hotel website",
  "Restaurant website",
  "Gym website",
  "Portfolio website",
  "Landing page",
  "Other",
];

export function AddLeadModal({ isOpen, onClose, onSuccess }: AddLeadModalProps) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteType, setWebsiteType] = useState<string>(WEBSITE_TYPES[0] || "Business & hotel website");
  const [pages, setPages] = useState("4-6 pages");
  const [budget, setBudget] = useState("₹25,000 – ₹40,000");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !businessName || !email) return;

    setLoading(true);
    await adminStore.addEnquiry({
      name,
      business_name: businessName,
      email,
      phone: phone || undefined,
      website_type: websiteType,
      pages: pages || null,
      budget: budget || null,
      details: details || "Offline lead recorded by Karan.",
      notes: notes || "Direct lead / call.",
    });

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#1E4378] bg-[#0B2D5B] p-6 md:p-8 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-white">Record New Client Lead</h2>
            <p className="text-xs text-[#94A3B8]">Add phone, WhatsApp, Instagram or walk-in enquiry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jaspreet Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Grand Haveli"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                WhatsApp / Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                Type of Website
              </label>
              <select
                value={websiteType}
                onChange={(e) => setWebsiteType(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none cursor-pointer"
              >
                {WEBSITE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
                Estimated Budget Range
              </label>
              <input
                type="text"
                placeholder="e.g. ₹30,000 – ₹50,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
              Project Brief / Details
            </label>
            <textarea
              rows={3}
              placeholder="What does the client want? Key requirements, features, reference sites..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1">
              Internal Admin Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Spoke on phone, promised quote by 6 PM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#1E4378]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#1E4378] px-4 py-2 text-xs font-semibold text-[#CBD5E1] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-[#3B82F6]/30 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add to CRM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
