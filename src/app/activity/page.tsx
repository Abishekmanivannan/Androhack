"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Activity, Award, CheckCircle2, Trophy, Zap, Shield, Filter } from "lucide-react";

interface FeedItem {
  id: string;
  type: string;
  user: {
    name: string;
    avatarUrl?: string;
    department?: string;
  };
  title: string;
  description: string;
  category: string;
  colorHex: string;
  xpAwarded: number;
  projectName?: string;
  timestamp: string;
}

export default function ActivityPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const data = await res.json();
        setFeed(data.feed || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const filteredFeed = feed.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "contributions") return item.type === "contribution_verified";
    if (filterType === "badges") return item.type === "badge_unlocked";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-400" /> Recognition & Activity Feed
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live stream of verified contributions, unlocked badges, and club milestones
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilterType("contributions")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === "contributions" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Verified PRs
            </button>
            <button
              onClick={() => setFilterType("badges")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === "badges" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Badges
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading live recognition feed...</div>
        ) : filteredFeed.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold">No recent activity matching your filter.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-800/80 ml-4 pl-6 space-y-6">
            {filteredFeed.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline Node */}
                <div
                  className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-[#07090E]"
                  style={{ backgroundColor: item.colorHex || "#6366F1" }}
                >
                  {item.type === "contribution_verified" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Award className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="pro-panel p-5 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          item.user.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.name}`
                        }
                        alt={item.user.name}
                        className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-white">{item.user.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">
                          {item.user.department || "Member"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        +{item.xpAwarded} XP
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>

                  {item.projectName && (
                    <div className="pt-2 text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
                      <span>Project: {item.projectName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
