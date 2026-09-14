"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, Sparkles } from "lucide-react";

interface LeaderboardMember {
  id: string;
  name: string;
  avatarUrl?: string;
  department?: string;
  currentLevel?: string;
  periodXp: number;
  velocityDelta?: number;
  verifiedCount: number;
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("all-time");
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-800 text-xs font-semibold">
            <Trophy className="w-4 h-4 text-amber-400" /> Official Club Standings
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contribution Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Recognizing top student contributors across technical execution, design, mentoring, and event management.
          </p>

          {/* Period Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "all-time", label: "ALL-TIME" },
              { id: "weekly", label: "WEEKLY" },
              { id: "monthly", label: "MONTHLY" },
              { id: "semester", label: "SEMESTER" },
              { id: "most-improved", label: "⚡ MOST IMPROVED" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  period === tab.id
                    ? "pro-btn-primary"
                    : "pro-btn-secondary text-slate-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-16 pro-panel rounded-2xl bg-slate-900/40" />
            ))}
          </div>
        ) : (
          <div className="pro-panel rounded-3xl p-4 sm:p-6 space-y-3 border border-slate-800">
            {leaderboard.map((member, index) => {
              const rank = index + 1;
              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-2xl pro-card flex items-center justify-between gap-4 border transition-all ${
                    rank === 1
                      ? "border-amber-500/50 bg-gradient-to-r from-amber-950/20 to-[#0B0F19]"
                      : rank === 2
                      ? "border-slate-700 bg-slate-900/60"
                      : rank === 3
                      ? "border-amber-800/30 bg-slate-900/40"
                      : "border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Medals */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black font-mono ${
                        rank === 1
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40"
                          : rank === 2
                          ? "bg-slate-300 text-slate-950"
                          : rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      #{rank}
                    </div>

                    {/* Member Profile */}
                    <img
                      src={
                        member.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                      }
                      alt={member.name}
                      className="w-10 h-10 rounded-full border border-indigo-500/30 bg-slate-900"
                    />

                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {member.name}
                        {rank === 1 && (
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {member.department} • Tier:{" "}
                        <span className="text-indigo-400 font-mono font-bold">
                          {member.currentLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* XP Scores */}
                  <div className="text-right">
                    <div className="text-base font-extrabold text-indigo-400 font-mono">
                      {period === "most-improved"
                        ? `+${member.velocityDelta} XP Velocity`
                        : `${member.periodXp} XP`}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono font-medium">
                      {member.verifiedCount} Verified Activities
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
