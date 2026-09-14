"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Activity, Shield, Users, CheckCircle2, TrendingUp, Sparkles, AlertCircle, BarChart3 } from "lucide-react";

interface HealthData {
  healthScore: number;
  totalMembers: number;
  activeMembersCount: number;
  inactiveMembersCount: number;
  activityRate: number;
  totalContributions: number;
  verifiedContributions: number;
  pendingContributions: number;
  rejectedContributions: number;
  totalXp30Days: number;
  insights: string[];
  categoryDistribution: { name: string; colorHex: string; count: number; percentage: number }[];
}

export default function CoordinatorHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const res = await fetch("/api/coordinator/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" /> Real-Time Club Health Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Calculated health metrics derived 100% from PostgreSQL database records & verified member activity
            </p>
          </div>

          <Link href="/coordinator/queue" className="pro-btn-primary px-4 py-2 text-xs font-bold">
            View Triage Queue
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Calculating Club Health metrics...</div>
        ) : !health ? (
          <div className="py-16 text-center text-slate-400">Failed to load health metrics.</div>
        ) : (
          <div className="space-y-8">
            {/* Top Score Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Overall Club Health Index</div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white">{health.healthScore} / 100</div>
                <p className="text-xs text-slate-300 max-w-lg">
                  Health Index combines 30-day member participation ({health.activityRate}%) and verification ratio ({health.verifiedContributions} / {health.totalContributions || 1}).
                </p>
              </div>

              {/* Natural Language Insights Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 max-w-md w-full">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4" /> Calculated Insights
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {health.insights.map((ins, idx) => (
                    <p key={idx} className="leading-relaxed flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{ins}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="pro-card p-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Active Members (30d)</div>
                <div className="text-3xl font-extrabold text-white">{health.activeMembersCount} / {health.totalMembers}</div>
                <div className="text-xs font-semibold text-emerald-400">{health.activityRate}% Participation Rate</div>
              </div>

              <div className="pro-card p-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Inactive Members</div>
                <div className="text-3xl font-extrabold text-amber-400">{health.inactiveMembersCount}</div>
                <div className="text-xs text-slate-400">Needs engagement prompt</div>
              </div>

              <div className="pro-card p-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Verified Contributions</div>
                <div className="text-3xl font-extrabold text-white">{health.verifiedContributions}</div>
                <div className="text-xs text-slate-400">{health.pendingContributions} pending review</div>
              </div>

              <div className="pro-card p-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400">30-Day XP Velocity</div>
                <div className="text-3xl font-extrabold text-indigo-400">+{health.totalXp30Days} XP</div>
                <div className="text-xs text-slate-400">Total club growth</div>
              </div>
            </div>

            {/* Category Distribution Breakdown */}
            <div className="pro-panel p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Category Contribution Breakdown
              </h2>

              <div className="space-y-3">
                {health.categoryDistribution.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.colorHex }} />
                        {cat.name}
                      </span>
                      <span>{cat.count} Contributions ({cat.percentage}%)</span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.colorHex }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
