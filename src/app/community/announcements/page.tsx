"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Pin, Bell, Sparkles } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: { name: string; avatarUrl?: string; role: string };
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" /> Club Announcements & Broadcasts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official announcements, hackathon updates, and coordinator news
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No announcements posted yet.</div>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a.id}
                className={`pro-panel p-6 space-y-3 ${
                  a.isPinned ? "border-indigo-500/40 bg-indigo-950/20 ring-1 ring-indigo-500/20" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {a.isPinned && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" /> Pinned
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      Posted by {a.author.name} ({a.author.role})
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white">{a.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{a.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
