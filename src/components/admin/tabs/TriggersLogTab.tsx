import { useState } from "react";
import {
  BellRing,
  MessageCircle,
  Mail,
  Smartphone,
  Globe,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Filter,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { TriggerLog } from "@/types/admin";
import { adminStore } from "@/lib/adminStore";

interface TriggersLogTabProps {
  logs: TriggerLog[];
  onRefresh: () => void;
}

export function TriggersLogTab({ logs, onRefresh }: TriggersLogTabProps) {
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");

  const totalLogs = logs.length;
  const whatsappCount = logs.filter((l) => l.channel === "whatsapp").length;
  const emailCount = logs.filter((l) => l.channel === "email").length;

  const filteredLogs = logs.filter((l) => {
    const matchesChannel = channelFilter === "all" || l.channel === channelFilter;
    const matchesEvent = eventFilter === "all" || l.event === eventFilter;
    return matchesChannel && matchesEvent;
  });

  const handleSendTestNotification = () => {
    adminStore.addTriggerLog({
      event: "custom_alert",
      channel: "whatsapp",
      recipient_name: "Karan (Admin)",
      recipient_contact: adminStore.getSettings().whatsapp,
      subject_or_preview: "Test Alert: WebNoura automated WhatsApp & Email notification system operational.",
      status: "delivered",
    });
    onRefresh();
  };

  const getEventBadge = (event: TriggerLog["event"]) => {
    switch (event) {
      case "client_onboarded":
        return <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">Client Onboarded</span>;
      case "enquiry_received":
        return <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400">Enquiry Received</span>;
      case "project_stage_update":
        return <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-400">Stage Milestone</span>;
      case "coupon_applied":
        return <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400">Coupon Used</span>;
      case "visitor_action":
        return <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400">Visitor Action</span>;
      default:
        return <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300">System Alert</span>;
    }
  };

  const getChannelIcon = (channel: TriggerLog["channel"]) => {
    switch (channel) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-emerald-400" />;
      case "email":
        return <Mail className="h-4 w-4 text-blue-400" />;
      case "sms":
        return <Smartphone className="h-4 w-4 text-amber-400" />;
      case "website":
      default:
        return <Globe className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl border border-[#1E4378] bg-gradient-to-r from-[#0B2D5B] via-[#0A2548] to-[#061833] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <BellRing className="h-6 w-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg md:text-xl font-extrabold text-white">
                  Automated Email &amp; WhatsApp Triggers Log
                </h1>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                  Live Dispatching
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Real-time log of automated notifications dispatched when enquiries are submitted, clients are onboarded, or project stages update
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSendTestNotification}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              <Send className="h-3.5 w-3.5" /> Trigger Test Notification
            </button>

            <button
              onClick={() => {
                if (confirm("Clear all notification logs?")) {
                  adminStore.clearTriggersLog();
                  onRefresh();
                }
              }}
              className="rounded-xl border border-[#1E4378] bg-[#061833] text-[#94A3B8] hover:text-rose-400 px-3 py-2 text-xs font-semibold"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Total Dispatched</span>
          <p className="font-display text-3xl font-extrabold text-white mt-2">{totalLogs}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Automated events recorded</p>
        </div>

        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">WhatsApp Notifications</span>
          <p className="font-display text-3xl font-extrabold text-emerald-400 mt-2">{whatsappCount}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Direct message triggers</p>
        </div>

        <div className="rounded-2xl border border-[#1E4378] bg-[#0B2D5B]/70 p-5 shadow-lg">
          <span className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">Email Notifications</span>
          <p className="font-display text-3xl font-extrabold text-[#93C5FD] mt-2">{emailCount}</p>
          <p className="text-xs text-[#94A3B8] mt-1">Client updates &amp; onboarding guides</p>
        </div>
      </div>

      {/* Log Stream Table */}
      <div className="rounded-3xl border border-[#1E4378] bg-[#0B2D5B]/60 p-6 md:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E4378]">
          <div>
            <h2 className="font-display text-lg font-extrabold text-white">Event Dispatch History</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Chronological record of automated client communication</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-[#1E4378] bg-[#061833] p-1 text-xs">
              {["all", "whatsapp", "email"].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`rounded-lg px-2.5 py-1 font-semibold uppercase text-[11px] font-mono transition-all ${
                    channelFilter === ch ? "bg-[#3B82F6] text-white" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-[#1E4378] bg-[#061833] p-1 text-xs">
              {["all", "client_onboarded", "enquiry_received", "project_stage_update"].map((ev) => (
                <button
                  key={ev}
                  onClick={() => setEventFilter(ev)}
                  className={`rounded-lg px-2.5 py-1 font-semibold text-[11px] font-mono transition-all ${
                    eventFilter === ev ? "bg-[#3B82F6] text-white" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {ev.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="mt-6 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center">
              <BellRing className="mx-auto h-10 w-10 text-[#64748B]" />
              <p className="mt-3 text-sm font-semibold text-[#CBD5E1]">No trigger events logged</p>
              <p className="text-xs text-[#94A3B8] mt-1">Notifications trigger when leads are submitted or project milestones change.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="group rounded-2xl border border-[#1E4378]/80 bg-[#061833]/50 hover:bg-[#061833] p-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B2D5B] border border-[#1E4378]">
                      {getChannelIcon(log.channel)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        {getEventBadge(log.event)}
                        <span className="font-mono text-xs font-bold text-white">
                          To: {log.recipient_name}
                        </span>
                        <span className="font-mono text-[11px] text-[#94A3B8]">
                          ({log.recipient_contact})
                        </span>
                      </div>

                      <p className="text-xs text-[#CBD5E1] mt-1.5 leading-relaxed font-sans">
                        "{log.subject_or_preview}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1E4378]/60">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Delivered
                    </span>

                    <span className="font-mono text-[10px] text-[#64748B]">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
