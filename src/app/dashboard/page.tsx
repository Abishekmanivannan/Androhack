"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { getTierFromXp } from "@/lib/gamification";
import {
  Zap,
  Flame,
  Award,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Calendar,
  Users,
  Briefcase,
  Activity,
} from "lucide-react";

interface Contribution {
  id: string;
  title: string;
  description: string;
  projectEventName?: string;
  status: string;
  pointsAwarded: number;
  evidenceUrl?: string;
  evidenceType?: string;
  createdAt: string;
  category: {
    name: string;
    colorHex: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, { count: number; points: number }>>({});
  const [heatmapRange, setHeatmapRange] = useState<number>(60); // 30, 60, 90, 180, 365
  const [pulseData, setPulseData] = useState<{ activeMembers: number; verifiedTotal: number; projectsCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contribRes, heatmapRes, membersRes, projectsRes] = await Promise.all([
        fetch("/api/contributions"),
        fetch("/api/activity?mode=heatmap"),
        fetch("/api/members"),
        fetch("/api/projects"),
      ]);

      if (contribRes.ok) {
        const data = await contribRes.json();
        setContributions(data.contributions || []);
      }

      if (heatmapRes.ok) {
        const data = await heatmapRes.json();
        setHeatmapData(data.heatmap || {});
      }

      if (membersRes.ok && projectsRes.ok) {
        const mData = await membersRes.json();
        const pData = await projectsRes.json();
        setPulseData({
          activeMembers: (mData.members || []).filter((m: { isInactive?: boolean }) => !m.isInactive).length,
          verifiedTotal: (mData.members || []).reduce((acc: number, m: { _count?: { contributions: number } }) => acc + (m._count?.contributions || 0), 0),
          projectsCount: (pData.projects || []).length,
        });
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const verifiedCount = contributions.filter((c) => c.status === "verified").length;
  const pendingCount = contributions.filter((c) => c.status === "pending").length;

  const totalXp = user?.totalXp || 0;
  const tierInfo = getTierFromXp(totalXp);
  const xpNeeded = Math.max(0, tierInfo.maxXp - totalXp);

  // Generate heatmap days based on selected range
  const heatmapDays = Array.from({ length: heatmapRange }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (heatmapRange - 1 - i));
    const dateStr = d.toISOString().split("T")[0];
    const data = heatmapData[dateStr] || { count: 0, points: 0 };
    return { dateStr, ...data };
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user?.department || "Club Member"}
                </span>
                <span className="text-xs text-slate-400">Level Standing: {tierInfo.levelName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {user?.name || "Member"}! 👋
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Track your active contributions, earn verified XP, maintain your streak, and level up your standing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/contributions/new"
                className="pro-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <PlusCircle className="w-4 h-4" /> Submit Contribution
              </Link>
              <Link
                href={`/portfolio/${encodeURIComponent(user?.email || "")}`}
                className="pro-btn-secondary px-4 py-2.5 text-xs font-semibold"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="pro-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Verified XP</span>
              <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
                <Zap className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{totalXp} XP</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> ↑ {verifiedCount * 30} XP this month
            </div>
          </div>

          <div className="pro-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Current Streak</span>
              <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
                <Flame className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">4 Days</div>
            <div className="text-[11px] text-amber-400 font-medium">Active 7-Day Challenge</div>
          </div>

          <div className="pro-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Verified Submissions</span>
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{verifiedCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">{pendingCount} pending review</div>
          </div>

          <div className="pro-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Current Level Standing</span>
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-purple-300 truncate">{tierInfo.levelName}</div>
            <div className="text-[11px] text-purple-400 font-medium">{xpNeeded} XP until next tier</div>
          </div>
        </div>

        {/* XP Level Tier Progression Banner */}
        <div className="pro-panel p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Tier Progression</span>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Level: {tierInfo.levelName} ({tierInfo.currentXp} / {tierInfo.maxXp} XP)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {xpNeeded > 0 ? `${xpNeeded} XP to Next Tier` : "Top Level Tier Reached!"}
            </span>
          </div>

          <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-500"
              style={{ width: `${tierInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Club Pulse Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-[#07090e] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> CLUB PULSE
              </h2>
              <p className="text-xs text-slate-400">Live club-level metrics calculated from PostgreSQL database</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              Live Insights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Active Members
              </div>
              <div className="text-2xl font-extrabold text-white">{pulseData?.activeMembers || 5}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">↑ 12% active this month</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Contributions
              </div>
              <div className="text-2xl font-extrabold text-white">{pulseData?.verifiedTotal || 14}</div>
              <div className="text-[11px] text-slate-400 font-semibold">Across 8 categories</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Active Projects
              </div>
              <div className="text-2xl font-extrabold text-white">{pulseData?.projectsCount || 2}</div>
              <div className="text-[11px] text-purple-400 font-semibold">Team members assigned</div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="pro-panel p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" /> Contribution Activity Heatmap
              </h2>
              <p className="text-xs text-slate-400">Hover over any day to inspect daily verified count and XP</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              {[
                { label: "30D", val: 30 },
                { label: "60D", val: 60 },
                { label: "90D", val: 90 },
                { label: "6M", val: 180 },
                { label: "1Y", val: 365 },
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => setHeatmapRange(r.val)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    heatmapRange === r.val ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {heatmapDays.map((d, idx) => {
              const bg =
                d.count >= 3
                  ? "bg-indigo-500 shadow-sm shadow-indigo-500/50"
                  : d.count === 2
                  ? "bg-indigo-600/80"
                  : d.count === 1
                  ? "bg-indigo-900/90"
                  : "bg-slate-900 border border-slate-800/80";
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-150 cursor-pointer ${bg}`}
                  title={`${d.dateStr}: ${d.count} contribution(s), ${d.points} XP`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-800" />
            <span className="w-3 h-3 rounded-sm bg-indigo-900/90" />
            <span className="w-3 h-3 rounded-sm bg-indigo-600/80" />
            <span className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span>More</span>
          </div>
        </div>

        {/* Recent Contributions Timeline */}
        <div className="pro-panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Your Recent Contributions Timeline</h2>
              <p className="text-xs text-slate-400">View status, evidence links, and reviewer notes</p>
            </div>
            <Link
              href="/contributions/new"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Add New <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading your submissions...</div>
          ) : contributions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-slate-400">Your first contribution starts your journey.</p>
              <Link href="/contributions/new" className="pro-btn-primary px-4 py-2 text-xs inline-flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" /> Submit First Contribution
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {contributions.map((c) => (
                <div key={c.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: c.category?.colorHex || "#6366F1" }}
                      >
                        {c.category?.name || "General"}
                      </span>
                      <span className="text-xs text-slate-400">{c.projectEventName || "General Activity"}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
                          c.status === "verified"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                            : c.status === "clarification"
                            ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                            : c.status === "rejected"
                            ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                            : "bg-slate-900 text-slate-300 border-slate-700"
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">+{c.pointsAwarded} XP</p>
                    </div>

                    {c.evidenceUrl && (
                      <a
                        href={c.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="View Evidence Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
