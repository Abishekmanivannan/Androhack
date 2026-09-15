"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Briefcase, Users, ExternalLink, Code, Plus, CheckCircle2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  githubUrl?: string;
  requiredSkills: string[];
  members: { role: string; user: { id: string; name: string; avatarUrl?: string } }[];
  _count: { contributions: number; members: number };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-400" /> Club Projects & Team Attribution
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse active technical projects, required skill sets, and member team rosters
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading club projects...</div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No active projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="pro-panel p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p._count.contributions} Verified Contributions
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>

                  {/* Required Skills Tags */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400">Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.requiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-500/30"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team Roster & Actions */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-300">
                        Team ({p._count.members} Members):
                      </span>
                    </div>

                    <div className="flex -space-x-2">
                      {p.members.map((m, idx) => (
                        <img
                          key={idx}
                          src={
                            m.user.avatarUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.name}`
                          }
                          alt={m.user.name}
                          title={`${m.user.name} (${m.role})`}
                          className="w-7 h-7 rounded-full bg-slate-800 border border-slate-900"
                        />
                      ))}
                    </div>
                  </div>

                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full pro-btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Code className="w-3.5 h-3.5" /> View Repository <ExternalLink className="w-3 h-3" />
                    </a>
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
