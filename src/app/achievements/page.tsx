"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Award, Flame, Zap, ShieldCheck, Code, Calendar, Users, Trophy, CheckCircle2, Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  criteriaType: string;
  criteriaThreshold: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  bonusXp: number;
  participants: { currentCount: number; status: string }[];
}

export default function AchievementsPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([
    { id: "b1", name: "First Steps", description: "Submitted and verified your first contribution!", iconKey: "award", criteriaType: "xp_threshold", criteriaThreshold: 10 },
    { id: "b2", name: "Code Contributor", description: "Pushed verified technical code or PR to the club repository.", iconKey: "code", criteriaType: "count_category", criteriaThreshold: 1 },
    { id: "b3", name: "Event Architect", description: "Successfully lead or organized a campus event.", iconKey: "calendar", criteriaType: "count_category", criteriaThreshold: 1 },
    { id: "b4", name: "Century Club", description: "Crossed the 100 Total XP contribution milestone.", iconKey: "zap", criteriaType: "xp_threshold", criteriaThreshold: 100 },
    { id: "b5", name: "Core Member", description: "Achieved Tier 4 Core Member standing in the club.", iconKey: "shield-check", criteriaType: "xp_threshold", criteriaThreshold: 300 },
    { id: "b6", name: "Master Mentor", description: "Mentored 3 or more junior club members.", iconKey: "users", criteriaType: "count_category", criteriaThreshold: 3 },
  ]);

  const [unlockedNames, setUnlockedNames] = useState<string[]>(["First Steps", "Code Contributor", "Century Club"]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const res = await fetch("/api/challenges");
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (key: string) => {
    if (key === "code") return <Code className="w-5 h-5" />;
    if (key === "calendar") return <Calendar className="w-5 h-5" />;
    if (key === "users") return <Users className="w-5 h-5" />;
    if (key === "zap") return <Zap className="w-5 h-5" />;
    if (key === "shield-check") return <ShieldCheck className="w-5 h-5" />;
    return <Award className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" /> Recognition Showcase, Badges & Challenges
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Unlock official verified badges, complete monthly challenges, and track progress toward locked milestones.
            </p>
          </div>

          <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-white">4-Day Streak</div>
              <div className="text-[11px] text-amber-400 font-semibold">Active Milestone</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Official Club Badges Showcase
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge) => {
              const isUnlocked = unlockedNames.includes(badge.name);

              return (
                <div
                  key={badge.id}
                  className={`pro-panel p-5 space-y-3 relative overflow-hidden transition-all ${
                    isUnlocked
                      ? "border-indigo-500/40 bg-indigo-950/20 ring-1 ring-indigo-500/20"
                      : "border-slate-800 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                          : "bg-slate-900 text-slate-500 border border-slate-800"
                      }`}
                    >
                      {getIcon(badge.iconKey)}
                    </div>

                    {isUnlocked ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{badge.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                  </div>

                  {!isUnlocked && (
                    <div className="pt-2 text-[11px] text-amber-400 font-semibold border-t border-slate-800/80">
                      Requirement: Need {badge.criteriaThreshold} verified contribution(s) / XP
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Challenges Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" /> Active Club Challenges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((c) => {
              const part = c.participants[0];
              const progress = part ? Math.min(100, Math.round((part.currentCount / c.targetCount) * 100)) : 0;
              const isDone = part?.status === "completed";

              return (
                <div key={c.id} className="pro-panel p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                      +{c.bonusXp} Bonus XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{c.description}</p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                      <span>Progress: {part?.currentCount || 0} / {c.targetCount} Verified Actions</span>
                      <span>{progress}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {isDone ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Challenge Completed!
                      </span>
                    ) : (
                      <button
                        onClick={async () => {
                          await fetch(`/api/challenges/${c.id}/join`, { method: "POST" });
                          fetchGamificationData();
                        }}
                        className="pro-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
                      >
                        {part ? "Continue Challenge" : "Join Challenge"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
