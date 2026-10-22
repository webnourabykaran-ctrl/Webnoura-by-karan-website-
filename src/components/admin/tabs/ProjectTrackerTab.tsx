import { useState } from "react";
import {
  Kanban,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Calendar,
  Layers,
  Trash2,
  CheckSquare,
  Square,
  X,
  Phone,
  Building,
} from "lucide-react";
import { ActiveProject, ProjectStage } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";

interface ProjectTrackerTabProps {
  projects: ActiveProject[];
  onRefresh: () => void;
}

const STAGES: { id: ProjectStage; title: string; subtitle: string; color: string; badge: string }[] = [
  { id: "requirements", title: "Requirements", subtitle: "Assets & Briefing", color: "border-blue-500/40 text-blue-400", badge: "bg-blue-500/10 text-blue-400" },
  { id: "design", title: "UI/UX Design", subtitle: "Wireframes & Mockups", color: "border-purple-500/40 text-purple-400", badge: "bg-purple-500/10 text-purple-400" },
  { id: "development", title: "Development", subtitle: "React & Animations", color: "border-amber-500/40 text-amber-400", badge: "bg-amber-500/10 text-amber-400" },
  { id: "testing", title: "Testing & QA", subtitle: "Cross-device Audit", color: "border-cyan-500/40 text-cyan-300", badge: "bg-cyan-500/10 text-cyan-300" },
  { id: "deployed", title: "Deployed & Live", subtitle: "Launched on Domain", color: "border-emerald-500/40 text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400" },
];

export function ProjectTrackerTab({ projects, onRefresh }: ProjectTrackerTabProps) {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ActiveProject | null>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [packageName, setPackageName] = useState("Business & Hotel Website (₹4,999)");
  const [targetDate, setTargetDate] = useState("");
  const [stage, setStage] = useState<ProjectStage>("requirements");
  const [notes, setNotes] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !businessName.trim()) return;

    adminStore.addActiveProject({
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      client_phone: clientPhone.trim(),
      business_name: businessName.trim(),
      project_title: projectTitle.trim() || `${businessName.trim()} Website`,
      package_name: packageName,
      stage,
      progress: stage === "deployed" ? 100 : stage === "development" ? 65 : 20,
      start_date: new Date().toISOString().slice(0, 10),
      target_date: targetDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
      notes: notes.trim(),
      milestones: [
        { title: "Briefing & Assets Received", completed: true },
        { title: "UI/UX Design Mockup Approved", completed: false },
        { title: "Frontend Development & Interactivity", completed: false },
        { title: "Testing & Responsive Audit", completed: false },
        { title: "Final Launch & Domain Connect", completed: false },
      ],
    });

    onRefresh();
    setIsNewProjectModalOpen(false);
    // Reset form
    setClientName("");
    setBusinessName("");
    setClientEmail("");
    setClientPhone("");
    setProjectTitle("");
    setNotes("");
  };

  const handleAdvanceStage = (project: ActiveProject) => {
    const stageOrder: ProjectStage[] = ["requirements", "design", "development", "testing", "deployed"];
    const currentIndex = stageOrder.indexOf(project.stage);
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      if (nextStage) {
        adminStore.updateProjectStage(project.id, nextStage);
        onRefresh();
      }
    }
  };

  const handleToggleMilestone = (project: ActiveProject, mIdx: number) => {
    const updatedMilestones = [...project.milestones];
    const milestone = updatedMilestones[mIdx];
    if (milestone) {
      milestone.completed = !milestone.completed;
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

      adminStore.updateActiveProject(project.id, {
        milestones: updatedMilestones,
        progress: newProgress,
      });
      onRefresh();
    }
  };

  // Stage counts
  const activeCount = projects.filter((p) => p.stage !== "deployed").length;
  const deployedCount = projects.filter((p) => p.stage === "deployed").length;

  return (
    <div className="space-y-8">
      {/* Banner & Action */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#93C5FD]">
              <Kanban className="h-6 w-6 text-[#3B82F6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-extrabold text-white">
                  Active Projects Tracker
                </h1>
                <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-300">
                  {activeCount} Active Builds
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Track client website progress across 5 stages from Requirement Gathering to Live Deployment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#3B82F6]/20"
            >
              <Plus className="h-4 w-4" /> Onboard Confirmed Client
            </button>
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid gap-4 xl:grid-cols-5">
        {STAGES.map((col, cIdx) => {
          const colProjects = projects.filter((p) => p.stage === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/40 p-4 shadow-lg backdrop-blur-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1E4378]/70">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-white">
                      {cIdx + 1}. {col.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] block">{col.subtitle}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${col.badge}`}>
                  {colProjects.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="mt-4 flex-1 space-y-3.5">
                {colProjects.length === 0 ? (
                  <div className="py-8 text-center text-[11px] font-mono text-[#64748B]">
                    No projects in this stage
                  </div>
                ) : (
                  colProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className="group rounded-2xl border border-[#1E4378] bg-[#061833]/80 hover:bg-[#061833] hover:border-[#3B82F6]/60 p-4 transition-all duration-200 cursor-pointer shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#93C5FD]">
                            {proj.business_name}
                          </span>
                          <h4 className="font-bold text-xs text-white group-hover:text-[#93C5FD] transition-colors line-clamp-1">
                            {proj.client_name}
                          </h4>
                        </div>

                        {proj.stage === "deployed" ? (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-400 p-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStage(proj);
                            }}
                            title="Advance to next stage"
                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3B82F6]/20 hover:bg-[#3B82F6] text-[#93C5FD] hover:text-white transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-[#94A3B8] line-clamp-1">{proj.package_name}</p>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-1">
                          <span className="text-[#94A3B8]">Progress</span>
                          <span className="text-white font-bold">{proj.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#0B2D5B] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-cyan-400 transition-all duration-500"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Target Date & Shortcuts */}
                      <div className="pt-2 border-t border-[#1E4378]/60 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#94A3B8] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(proj.target_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>

                        {proj.client_phone && (
                          <a
                            href={`https://wa.me/${proj.client_phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(
                              proj.client_name
                            )},%20update%20on%20your%20${encodeURIComponent(
                              proj.project_title
                            )}:%20Current%20Stage%20is%20${proj.stage.toUpperCase()}%20(${proj.progress}%20complete).`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" /> Update
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-[#1E4378] bg-[#061833] text-white p-6 sm:p-8 shadow-2xl my-8 space-y-6">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-[#0B2D5B] text-[#94A3B8] hover:text-white flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <span className="font-mono text-xs text-[#93C5FD] uppercase tracking-wider">
                {selectedProject.package_name}
              </span>
              <h2 className="font-display text-2xl font-extrabold text-white mt-1">
                {selectedProject.project_title}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Client: {selectedProject.client_name} ({selectedProject.business_name})
              </p>
            </div>

            {/* Stage Selector */}
            <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/50 p-4 space-y-3">
              <label className="block text-xs font-mono font-bold text-[#93C5FD]">
                Current Production Stage:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      adminStore.updateProjectStage(selectedProject.id, s.id);
                      setSelectedProject({ ...selectedProject, stage: s.id });
                      onRefresh();
                    }}
                    className={`rounded-xl border p-2 text-left text-xs font-semibold transition-all ${
                      selectedProject.stage === s.id
                        ? "border-[#3B82F6] bg-[#3B82F6]/20 text-white"
                        : "border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-[#3B82F6]" /> Project Milestones &amp; Deliverables
              </h3>
              <div className="space-y-2">
                {selectedProject.milestones?.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleMilestone(selectedProject, idx)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-[#1E4378] bg-[#0B2D5B]/30 hover:bg-[#0B2D5B]/60 transition-colors cursor-pointer"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-[#64748B] shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        m.completed ? "line-through text-[#94A3B8]" : "text-white font-medium"
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E4378]">
              <button
                onClick={() => {
                  if (confirm("Delete this active project?")) {
                    adminStore.deleteActiveProject(selectedProject.id);
                    setSelectedProject(null);
                    onRefresh();
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
              >
                <Trash2 className="h-4 w-4" /> Remove Project
              </button>

              {selectedProject.client_phone && (
                <a
                  href={`https://wa.me/${selectedProject.client_phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(
                    selectedProject.client_name
                  )},%20here%20is%20an%20update%20on%20your%20website%20project:%20Stage%20is%20now%20${selectedProject.stage.toUpperCase()}%20(${selectedProject.progress}%%20completed).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition-all shadow-md"
                >
                  <MessageCircle className="h-4 w-4" /> Send WhatsApp Update
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onboard New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1E4378] bg-[#061833] text-white p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsNewProjectModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-[#0B2D5B] text-[#94A3B8] hover:text-white flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-extrabold text-white">
                  Onboard Confirmed Client Project
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Initialize project tracking, milestones, and status alerts for a newly confirmed client
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurpreet Singh"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Palace Hotel"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 94637 37763"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#CBD5E1] mb-1">Target Launch Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Project Package</label>
                <select
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                >
                  <option value="Business & Hotel Website (₹4,999)">Business &amp; Hotel Website (₹4,999)</option>
                  <option value="Restaurant & Café Website (₹4,999)">Restaurant &amp; Café Website (₹4,999)</option>
                  <option value="Gym & Fitness Website (₹4,999)">Gym &amp; Fitness Website (₹4,999)</option>
                  <option value="Portfolio & Landing Page (₹4,999)">Portfolio &amp; Landing Page (₹4,999)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Initial Production Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as ProjectStage)}
                  className="w-full rounded-xl border border-[#1E4378] bg-[#0B2D5B]/40 px-3 py-2 text-xs text-white"
                >
                  <option value="requirements">1. Requirements (Assets &amp; Briefing)</option>
                  <option value="design">2. UI/UX Design (Mockups)</option>
                  <option value="development">3. Development (React Coding)</option>
                  <option value="testing">4. Testing &amp; QA</option>
                  <option value="deployed">5. Deployed &amp; Live</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="rounded-xl border border-[#1E4378] bg-[#061833] text-[#94A3B8] px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2 text-xs font-bold shadow-md"
                >
                  Onboard Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
