"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Activity,
  Users,
  AlertTriangle,
  Sparkles,
  Trophy,
  BarChart3,
  ChevronLeft,
} from "lucide-react";

export default function ClubHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coordinator/health")
      .then((res) => res.json())
      .then((data) => setHealth(data.health))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-6">
          <div className="h-40 pro-panel rounded-3xl bg-slate-900/40" />
          <div className="h-64 pro-panel rounded-3xl bg-slate-900/40" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/coordinator/queue"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 mb-2 font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Review Queue
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            Club Engagement Health & Strategic Insights
          </h1>
          <p className="text-xs text-slate-400">
            Real-time organizational intelligence, domain contribution deficits, and active retention tracking.
          </p>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="pro-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" /> Active Member Ratio
            </div>
            <div className="text-3xl font-black text-indigo-400 font-mono">
              {health?.activePercentage}%
            </div>
            <p className="text-xs text-slate-400">
              {health?.activeCount} of {health?.totalMembers || 1} members active in last 30 days
            </p>
          </div>

          <div className="pro-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Domain Deficits
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {health?.deficits?.length || 0}
            </div>
            <p className="text-xs text-slate-400">
              Functional categories with 0 contributions logged
            </p>
          </div>

          <div className="pro-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-cyan-400" /> Top Contributor
            </div>
            <div className="text-xl font-extrabold text-cyan-300 truncate">
              {health?.topMembers?.[0]?.name || "Alex Rivera"}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {health?.topMembers?.[0]?.totalXp || 180} XP Total
            </p>
          </div>
        </div>

        {/* AI & Strategic Smart Insights Summary */}
        <div className="pro-panel rounded-3xl p-6 space-y-4 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-slate-900">
          <h2 className="text-base font-bold text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Automated Club Health Diagnostics
          </h2>
          <div className="space-y-2">
            {health?.smartInsights?.map((insight: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Contribution Distribution */}
        <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800">
          <h2 className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Category Breakdown & Volume
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {health?.categoryStats?.map((cat: any) => (
              <div
                key={cat.id}
                className="pro-card p-4 rounded-2xl space-y-2 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.colorHex }}
                  />
                  <span className="text-xs font-bold">{cat.name}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {cat.verifiedCount}
                </div>
                <div className="text-[11px] text-slate-400">Verified Activities</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
