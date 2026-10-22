import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Globe, Smartphone, Check, Sparkles, X } from "lucide-react";
import { AdminProject } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";

interface PortfolioTabProps {
  projects: AdminProject[];
  onRefresh: () => void;
}

export function PortfolioTab({ projects, onRefresh }: PortfolioTabProps) {
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [cat, setCat] = useState("");
  const [url, setUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [d, setD] = useState("");
  const [isLive, setIsLive] = useState(true);

  const handleOpenAdd = () => {
    setName("");
    setCat("Business & Hotel Website");
    setUrl("demo-website.vercel.app");
    setLiveUrl("https://demo-website.vercel.app");
    setD("");
    setIsLive(true);
    setIsAddingNew(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProject(project);
    setName(project.name);
    setCat(project.cat);
    setUrl(project.url);
    setLiveUrl(project.liveUrl);
    setD(project.d);
    setIsLive(project.isLive);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cat) return;

    if (editingProject) {
      adminStore.updateProject(editingProject.id, {
        name,
        cat,
        url,
        liveUrl,
        d,
        isLive,
      });
    } else {
      adminStore.addProject({
        name,
        cat,
        url,
        liveUrl,
        d,
        isLive,
        img: "/mock-business.jpg",
        mobileImg: "/mock-business.jpg",
        featured: true,
      });
    }

    setEditingProject(null);
    setIsAddingNew(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this portfolio project?")) {
      adminStore.deleteProject(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/70 p-6 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="font-display text-xl font-extrabold text-white">Portfolio Showcases</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage the client concepts and live demos highlighted across WebNoura
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/30 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 backdrop-blur-md shadow-xl transition-all hover:border-[#3B82F6]/60"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#3B82F6]">0{idx + 1}</span>
                  {proj.isLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] tracking-wider text-emerald-400 uppercase">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      </span>
                      Live Website Demo
                    </span>
                  ) : (
                    <span className="rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-2.5 py-0.5 font-mono text-[9px] text-[#93C5FD] uppercase">
                      Concept
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    title="Edit project"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E4378] bg-[#061833] text-[#CBD5E1] hover:border-[#3B82F6] hover:text-white transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    title="Delete project"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E4378] bg-[#061833] text-[#64748B] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <h3 className="mt-4 font-display text-xl font-bold text-white group-hover:text-[#93C5FD] transition-colors">
                {proj.name}
              </h3>
              <p className="font-mono text-xs text-[#93C5FD] mt-0.5">{proj.cat}</p>

              {/* Description */}
              <p className="mt-3 text-xs leading-relaxed text-[#CBD5E1] line-clamp-3">
                {proj.d}
              </p>
            </div>

            {/* Bottom info & Live link */}
            <div className="mt-6 pt-4 border-t border-[#1E4378]/70 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[#64748B] truncate max-w-[180px]">
                {proj.url}
              </span>

              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#93C5FD] hover:text-white transition-colors"
                >
                  Visit Demo <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {(isAddingNew || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1E4378] bg-[#0B2D5B] p-6 md:p-8 text-white shadow-2xl">
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingProject(null);
              }}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-xl font-extrabold text-white">
              {editingProject ? "Edit Showcase Project" : "Add New Showcase Project"}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Configure how this project is displayed on WebNoura
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAJHA CAFÉ & RESTAURANT"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                  Industry / Category
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Restaurant & Café Website"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                    Display Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. cafe-demo.vercel.app"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                    Live Destination URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#CBD5E1] block mb-1.5">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe key features, typography, conversion points..."
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#061833] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isLive"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="rounded border-[#1E4378] bg-[#061833] text-[#3B82F6]"
                />
                <label htmlFor="isLive" className="text-xs text-[#CBD5E1] cursor-pointer">
                  Tag as "Live Demo Website" (with pulsing green badge)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#1E4378]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProject(null);
                  }}
                  className="rounded-xl border border-[#1E4378] px-4 py-2 text-xs font-semibold text-[#CBD5E1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3B82F6] px-5 py-2 text-xs font-bold text-white hover:bg-[#2563EB]"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
