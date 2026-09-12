"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { getTierFromXp } from "@/lib/gamification";
import {
  Zap,
  PlusCircle,
  Award,
  Trophy,
  ExternalLink,
  Clock,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Share2,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [contributions, setContributions] = useState<any[]>([]);
  const [contribLoading, setContribLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  const loadContributions = async () => {
    try {
      const contribRes = await fetch(
        `/api/contributions?status=${statusFilter}`
      );
      if (contribRes.ok) {
        const cData = await contribRes.json();
        setContributions(cData.contributions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setContribLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadContributions();
    } else {
      setContribLoading(false);
    }
  }, [user, statusFilter]);

  if (authLoading || (user && contribLoading)) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
          <div className="h-36 pro-panel rounded-3xl bg-slate-900/40" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 pro-panel rounded-3xl bg-slate-900/40" />
            <div className="h-48 pro-panel rounded-3xl bg-slate-900/40 col-span-2" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-center p-4">
        <Navbar />
        <div className="text-center space-y-5 max-w-md mx-auto my-auto pro-panel p-8 rounded-3xl border border-slate-800">
          <Zap className="w-12 h-12 text-indigo-400 mx-auto" />
          <h2 className="text-2xl font-bold">Welcome to ClubConnect</h2>
          <p className="text-xs text-slate-400">
            Please sign in to view your contribution dashboard and track your club XP.
          </p>
          <Link
            href="/login"
            className="pro-btn-primary inline-block w-full py-3 text-xs tracking-wider text-center font-bold"
          >
            SIGN IN NOW
          </Link>
        </div>
      </div>
    );
  }

  const tier = getTierFromXp(user.totalXp || 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <Clock className="w-3 h-3 animate-spin" /> PENDING
          </span>
        );
      case "clarification":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
            <HelpCircle className="w-3 h-3" /> ACTION REQUIRED
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 text-slate-400">
            DRAFT
          </span>
        );
    }
  };

  const copyPortfolioUrl = () => {
    const url = `${window.location.origin}/portfolio/${encodeURIComponent(
      user.name
    )}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero Banner & XP Level Progress */}
        <section className="pro-panel rounded-3xl p-6 lg:p-8 relative overflow-hidden border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                }
                alt={user.name}
                className="w-16 h-16 rounded-2xl border border-indigo-500/40 bg-slate-900 shadow-xl"
              />
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-xs text-slate-400">
                  {user.department || "Club Member"} • {user.email}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contributions/new"
                className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> ADD CONTRIBUTION
              </Link>
              <button
                onClick={copyPortfolioUrl}
                className="pro-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                {copied ? "LINK COPIED!" : "SHARE PORTFOLIO"}
              </button>
            </div>
          </div>

          {/* Gamification Level Progress Gauge */}
          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center relative z-10">
            <div className="lg:col-span-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-indigo-400 uppercase tracking-wider">
                    Tier {tier.tierNumber}: {tier.levelName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({user.totalXp} Total XP)
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-300 font-mono">
                  {tier.currentXp} / {tier.maxXp} XP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 shadow-md shadow-indigo-500/30"
                  style={{ width: `${tier.progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
                <span>Tier 1 (Newcomer)</span>
                <span>Tier 3 (Active)</span>
                <span>Tier 5 (Leader)</span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="pro-card p-3 rounded-2xl text-center border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  VERIFIED XP
                </div>
                <div className="text-2xl font-black text-indigo-400 font-mono">
                  {user.totalXp}
                </div>
              </div>
              <div className="pro-card p-3 rounded-2xl text-center border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ENTRIES
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {contributions.length}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section: Contribution Stream + Side Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity / Contribution Stream (2 cols) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Contribution Activity Stream
              </h2>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
                {["all", "pending", "verified", "clarification", "rejected"].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-bold text-[11px] transition-all ${
                        statusFilter === st
                          ? "bg-indigo-600 text-white font-semibold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {st === "clarification" ? "Action" : st}
                    </button>
                  )
                )}
              </div>
            </div>

            {contributions.length === 0 ? (
              <div className="pro-panel rounded-3xl p-12 text-center space-y-4 border border-dashed border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">No contributions found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Claim your first points by submitting verified code, event organization, or design work.
                  </p>
                </div>
                <Link
                  href="/contributions/new"
                  className="pro-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" /> SUBMIT ACTIVITY NOW
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((c) => (
                  <div
                    key={c.id}
                    className="pro-card rounded-2xl p-5 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                            style={{
                              backgroundColor:
                                c.category?.colorHex || "#6366F1",
                            }}
                          >
                            {c.category?.name || "General"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {c.projectEventName}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">
                          {c.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(c.status)}
                        <span className="text-sm font-black text-indigo-400 font-mono">
                          +{c.pointsAwarded} XP
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {c.description}
                    </p>

                    {/* Evidence & Review Notes */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <a
                        href={c.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono font-semibold truncate max-w-md"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{c.evidenceUrl}</span>
                      </a>

                      {c.reviewerNotes && (
                        <div className="text-slate-400 italic text-[11px] bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
                          Reviewer: "{c.reviewerNotes}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Widgets */}
          <aside className="space-y-6">
            {/* Quick Leaderboard Access Widget */}
            <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Leaderboard
                </h3>
                <Link
                  href="/leaderboard"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 font-bold"
                >
                  VIEW ALL <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-400">
                Compete with fellow members in weekly technical and event bounties.
              </p>

              <Link
                href="/leaderboard"
                className="w-full py-2.5 rounded-xl pro-btn-secondary flex items-center justify-center gap-2 text-xs font-bold"
              >
                OPEN RANKINGS
              </Link>
            </div>

            {/* Public Portfolio Widget */}
            <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800 bg-gradient-to-br from-indigo-950/20 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Public Credential</h3>
                  <p className="text-xs text-slate-400">
                    Shareable verified portfolio
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Employers & sponsors can verify your contributions live on your public profile.
              </p>

              <Link
                href={`/portfolio/${encodeURIComponent(user.name)}`}
                className="pro-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                VIEW PUBLIC PROFILE <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
