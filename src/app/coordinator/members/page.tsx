"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Users, AlertCircle, Shield, CheckCircle2, Search } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  totalXp: number;
  currentLevel: string;
  isInactive: boolean;
  _count: { contributions: number };
}

export default function CoordinatorMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
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
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> Member Roster & Inactive Detection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor member contribution engagement, level standing, and inactive member alerts
          </p>
        </div>

        <div className="pro-panel overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading member directory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Current Level</th>
                    <th className="py-3.5 px-4 text-center">Verified Submissions</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              m.avatarUrl ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`
                            }
                            alt={m.name}
                            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{m.name}</div>
                            <div className="text-[11px] text-slate-400">{m.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold capitalize text-indigo-400">
                        {m.role}
                      </td>

                      <td className="py-4 px-4 text-slate-300">
                        {m.department || "General"}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                          {m.currentLevel}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-white">
                        {m._count.contributions}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {m.isInactive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Inactive 30d+
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400">Active</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right font-extrabold text-sm text-indigo-400">
                        {m.totalXp} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
