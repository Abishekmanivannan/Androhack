"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Zap,
  UserCheck,
  Activity,
  FileText,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function CoordinatorQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [customXp, setCustomXp] = useState<number | "">("");
  const [toastMsg, setToastMsg] = useState("");

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/coordinator/queue");
      if (res.ok) {
        const data = await res.json();
        setQueue(data.queue || []);
        if (data.queue?.length > 0 && !selectedId) {
          setSelectedId(data.queue[0].id);
          setCustomXp(data.queue[0].category?.baseXp || 30);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const selectedItem = queue.find((q) => q.id === selectedId) || queue[0];

  useEffect(() => {
    if (selectedItem) {
      setCustomXp(selectedItem.category?.baseXp || 30);
      setNotes("");
    }
  }, [selectedId]);

  const handleTriage = async (action: "approve" | "clarification" | "reject") => {
    if (!selectedItem) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/coordinator/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributionId: selectedItem.id,
          action,
          pointsAwarded: Number(customXp) || selectedItem.category?.baseXp || 30,
          reviewerNotes: notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (action === "approve") {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#6366f1", "#38bdf8", "#34d399", "#f43f5e"],
          });
          setToastMsg(
            `🎉 Approved! +${data.xpAwarded} XP awarded to ${selectedItem.user?.name}!`
          );
        } else if (action === "clarification") {
          setToastMsg("💬 Requested clarification details from contributor");
        } else {
          setToastMsg("❌ Contribution rejected");
        }

        setTimeout(() => setToastMsg(""), 4000);
        await fetchQueue();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-96 pro-panel rounded-3xl bg-slate-900/40" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      {/* Header Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-white">
            <UserCheck className="w-5 h-5 text-amber-400" />
            Coordinator Verification Triage Queue
          </h1>
          <p className="text-xs text-slate-400">
            Split-screen review workspace: metadata on left, embedded live proof viewer on right.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/coordinator/health"
            className="pro-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-cyan-400" /> CLUB HEALTH
          </Link>
          <button
            onClick={fetchQueue}
            className="p-2 rounded-xl pro-card text-slate-400 hover:text-white"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {queue.length === 0 ? (
          <div className="pro-panel rounded-3xl p-16 text-center space-y-3 my-12 border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold">All caught up! 🎉</h2>
            <p className="text-xs text-slate-400">
              There are currently no pending submissions in the review queue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Queue List Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Pending Queue ({queue.length})
              </div>

              {queue.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-4 rounded-2xl pro-card border transition-all ${
                    selectedItem?.id === item.id
                      ? "border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/40"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                      style={{
                        backgroundColor: item.category?.colorHex || "#6366F1",
                      }}
                    >
                      {item.category?.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-indigo-400">
                      +{item.category?.baseXp} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 line-clamp-1">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                    <img
                      src={
                        item.user?.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user?.name}`
                      }
                      alt={item.user?.name}
                      className="w-5 h-5 rounded-full border border-indigo-500/30"
                    />
                    <span className="truncate">{item.user?.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Split-Screen Triage Workspace (8 cols) */}
            {selectedItem && (
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Metadata Panel */}
                  <div className="pro-panel rounded-3xl p-6 space-y-5 border border-slate-800">
                    {/* Contributor Profile Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                      <img
                        src={
                          selectedItem.user?.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedItem.user?.name}`
                        }
                        alt={selectedItem.user?.name}
                        className="w-12 h-12 rounded-2xl border border-indigo-500/40 bg-slate-900"
                      />
                      <div>
                        <div className="text-base font-bold text-white">
                          {selectedItem.user?.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {selectedItem.user?.department || "Member"} • Tier:{" "}
                          <span className="text-indigo-400 font-mono font-bold">
                            {selectedItem.user?.currentLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Category:</span>
                        <span className="font-bold text-indigo-300">
                          {selectedItem.category?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Project:</span>
                        <span className="font-semibold text-white">
                          {selectedItem.projectEventName}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white">
                        {selectedItem.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* XP Award Adjustment */}
                    <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                      <label className="block text-xs font-bold text-indigo-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Points to Award
                      </label>
                      <input
                        type="number"
                        value={customXp}
                        onChange={(e) =>
                          setCustomXp(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full px-3 py-1.5 rounded-xl pro-input text-xs font-mono text-white font-bold"
                      />
                    </div>

                    {/* Coordinator Feedback */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Feedback / Rejection Reason
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Add notes for contributor..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl pro-input text-xs"
                      />
                    </div>

                    {/* Triage Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        disabled={actionLoading}
                        onClick={() => handleTriage("approve")}
                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleTriage("clarification")}
                        className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" /> Clarify
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleTriage("reject")}
                        className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Right Preview Embedded Viewer Panel */}
                  <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800 flex flex-col h-[530px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-400" /> Evidence Viewer
                      </div>
                      <a
                        href={selectedItem.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                      >
                        External Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
                      {selectedItem.evidenceUrl?.startsWith("http") ? (
                        <iframe
                          src={selectedItem.evidenceUrl}
                          className="w-full h-full border-0 rounded-2xl bg-white"
                          title="Evidence Live Preview"
                        />
                      ) : (
                        <div className="p-6 text-center space-y-2">
                          <AlertCircle className="w-8 h-8 text-indigo-400 mx-auto" />
                          <div className="text-xs text-slate-400">
                            External link:
                          </div>
                          <a
                            href={selectedItem.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-cyan-400 underline break-all"
                          >
                            {selectedItem.evidenceUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
