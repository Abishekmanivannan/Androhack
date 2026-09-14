"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { BarChart3, AlertCircle, CheckCircle2, Cpu } from "lucide-react";

interface SkillItem {
  skill: string;
  memberCount: number;
  members: string[];
  projectDemandCount: number;
  isGap: boolean;
}

export default function CoordinatorAnalyticsPage() {
  const [matrix, setMatrix] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillMatrix();
  }, []);

  const fetchSkillMatrix = async () => {
    try {
      const res = await fetch("/api/skills/matrix");
      if (res.ok) {
        const data = await res.json();
        setMatrix(data.skillMatrix || []);
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
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-400" /> Club Skill Matrix & Gap Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated skill distribution across members vs active project skill requirements
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Analyzing club skill matrix...</div>
        ) : matrix.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No skill data found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matrix.map((item, idx) => (
              <div key={idx} className="pro-panel p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.skill}</span>
                  {item.isGap ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Skill Gap Warning
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Well Represented
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{item.memberCount} Member(s) Have This Skill</span>
                  <span>Project Demand: {item.projectDemandCount}</span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg">
                  <span className="font-semibold text-slate-300">Proficient Members: </span>
                  {item.members.join(", ") || "None"}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
