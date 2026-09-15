"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, TrendingUp, Zap, Award, Flame, Filter, Calendar } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  department?: string;
  totalXp: number;
  periodXp?: number;
  currentLevel: string;
  currentPeriodXp?: number;
  priorPeriodXp?: number;
  delta?: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState("alltime"); // weekly, monthly, semester, alltime
  const [category, setCategory] = useState("all");
  const [mode, setMode] = useState("standard"); // standard, most_improved
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category, mode]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?timeframe=${timeframe}&category=${category}&mode=${mode}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" /> Club Leaderboard & Recognition
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official rankings derived 100% from verified contributions and audited XP ledger transactions
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMode("standard")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                mode === "standard" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Standard Leaderboard
            </button>
            <button
              onClick={() => setMode("most_improved")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                mode === "most_improved" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Most Improved (30-Day Velocity)
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        {mode === "standard" && (
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {/* Timeframe selector */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 mr-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Timeframe:
              </span>
              {[
                { id: "weekly", label: "Weekly" },
                { id: "monthly", label: "Monthly" },
                { id: "semester", label: "Semester" },
                { id: "alltime", label: "All-Time" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    timeframe === tf.id
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Category selector */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-indigo-400" /> Category:
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Design">Design</option>
                <option value="Event">Event</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="pro-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading verified leaderboard rankings...</div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">No activity recorded for this timeframe.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Level Standing</th>
                    {mode === "most_improved" ? (
                      <>
                        <th className="py-3.5 px-4 text-right">Prior 30-Day XP</th>
                        <th className="py-3.5 px-4 text-right">Current 30-Day XP</th>
                        <th className="py-3.5 px-4 text-right">30-Day Growth Delta</th>
                      </>
                    ) : (
                      <th className="py-3.5 px-4 text-right">Verified XP</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leaderboard.map((user, idx) => {
                    const rank = idx + 1;
                    const isTop3 = rank <= 3;
                    const rankBg =
                      rank === 1
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : rank === 2
                        ? "bg-slate-400/20 text-slate-300 border border-slate-400/30"
                        : rank === 3
                        ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                        : "text-slate-400";

                    return (
                      <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-4 px-4 text-center font-bold">
                          <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center ${rankBg}`}>
                            {rank}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                user.avatarUrl ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                              }
                              alt={user.name}
                              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{user.name}</div>
                              <div className="text-[11px] text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-300 font-medium">
                          {user.department || "General"}
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                            {user.currentLevel}
                          </span>
                        </td>

                        {mode === "most_improved" ? (
                          <>
                            <td className="py-4 px-4 text-right font-medium text-slate-400">
                              {user.priorPeriodXp || 0} XP
                            </td>
                            <td className="py-4 px-4 text-right font-bold text-white">
                              {user.currentPeriodXp || 0} XP
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span
                                className={`font-extrabold text-sm px-2.5 py-0.5 rounded-full ${
                                  (user.delta || 0) >= 0
                                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                    : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                                }`}
                              >
                                {(user.delta || 0) >= 0 ? `+${user.delta}` : user.delta} XP
                              </span>
                            </td>
                          </>
                        ) : (
                          <td className="py-4 px-4 text-right">
                            <span className="font-extrabold text-base text-indigo-400 flex items-center justify-end gap-1">
                              <Zap className="w-4 h-4 fill-current text-indigo-400" />
                              {user.periodXp !== undefined ? user.periodXp : user.totalXp} XP
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
