"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Users, Search, Zap, ExternalLink, Filter, AlertCircle } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  skills: string[];
  totalXp: number;
  currentLevel: string;
  isInactive: boolean;
  _count: { contributions: number };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [search, showInactiveOnly]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/members?query=${encodeURIComponent(search)}&inactive=${showInactiveOnly}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" /> Member Discovery & Skill Search
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Search club members by skill, department, role, or active status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search skills, names, depts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>

            <button
              onClick={() => setShowInactiveOnly(!showInactiveOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                showInactiveOnly
                  ? "bg-amber-950/80 border-amber-500/40 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Inactive Only
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Searching member directory...</div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No members matching your query.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <div key={m.id} className="pro-panel p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      {m.currentLevel}
                    </span>

                    {m.isInactive ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Inactive 30d+
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400">Active</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={
                        m.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`
                      }
                      alt={m.name}
                      className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{m.name}</h3>
                      <p className="text-xs text-slate-400">{m.department || "General Member"}</p>
                    </div>
                  </div>

                  {/* Skills Tag Cloud */}
                  {m.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {m.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" /> {m.totalXp} XP
                  </span>

                  <Link
                    href={`/portfolio/${encodeURIComponent(m.email)}`}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    Portfolio <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
