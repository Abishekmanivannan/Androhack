"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Briefcase, Calendar, Trophy, FileText, ArrowRight, X } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "member" | "project" | "event" | "page";
  url: string;
  subtext?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery("");
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length > 0) {
      searchItems(query.trim());
    } else {
      // Default quick links
      setResults([
        { id: "p1", title: "Member Dashboard", type: "page", url: "/dashboard", subtext: "Personal XP & Activity Overview" },
        { id: "p2", title: "Global Activity Feed", type: "page", url: "/activity", subtext: "Recognition & Milestone Stream" },
        { id: "p3", title: "Submit Contribution Wizard", type: "page", url: "/contributions/new", subtext: "Submit PR, Event, or Design" },
        { id: "p4", title: "Badges & Challenges", type: "page", url: "/achievements", subtext: "Unlocked badges & active challenges" },
        { id: "p5", title: "Leaderboard & Rankings", type: "page", url: "/leaderboard", subtext: "Multi-period Rankings & Most Improved" },
        { id: "p6", title: "Club Projects Showcase", type: "page", url: "/community/projects", subtext: "View project rosters & skills" },
        { id: "p7", title: "Campus Events & Check-in", type: "page", url: "/community/events", subtext: "Workshops, hackathons & claim XP" },
        { id: "p8", title: "Member Discovery Directory", type: "page", url: "/community/members", subtext: "Search members by skill or dept" },
      ]);
    }
  }, [query]);

  const searchItems = async (q: string) => {
    try {
      const res = await fetch(`/api/members?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        const memberResults: SearchResult[] = (data.members || []).slice(0, 4).map((m: { id: string; name: string; email: string; department?: string; currentLevel: string; totalXp: number }) => ({
          id: `m-${m.id}`,
          title: m.name,
          type: "member",
          url: `/portfolio/${encodeURIComponent(m.email)}`,
          subtext: `${m.department || "Member"} • ${m.currentLevel} (${m.totalXp} XP)`,
        }));

        setResults(memberResults);
      }
    } catch {
      // Ignore
    }
  };

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-[#07090e] bg-[#07090e]/80 backdrop-blur-md z-[100] flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-[#0D121E] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search pages, members, skills, projects (Press Esc to close)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-medium"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No matching search results.</div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r.url)}
                className="w-full p-3 rounded-xl hover:bg-indigo-950/40 border border-transparent hover:border-indigo-500/30 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                    {r.type === "member" ? (
                      <User className="w-4 h-4" />
                    ) : r.type === "project" ? (
                      <Briefcase className="w-4 h-4" />
                    ) : r.type === "event" ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {r.title}
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded bg-slate-800 text-slate-400">
                        {r.type}
                      </span>
                    </div>
                    {r.subtext && <div className="text-[11px] text-slate-400 mt-0.5">{r.subtext}</div>}
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center px-4 font-mono">
          <span>Use ARROWS to navigate, ENTER to select</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
