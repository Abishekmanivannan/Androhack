"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Calendar, MapPin, CheckCircle2, Zap, Clock, Users } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location?: string;
  baseXp: number;
  status: string;
  category?: { name: string; colorHex: string };
  participants: { userId: string; status: string }[];
  _count: { participants: number };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/checkin`, { method: "POST" });
      if (res.ok) {
        fetchEvents();
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" /> Campus Events & Attendance Check-in
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Participate in workshops, hackathons, and leadership summits to earn verified XP
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((e) => {
              const isCheckedIn = e.participants.some((p) => p.status === "attended");

              return (
                <div key={e.id} className="pro-panel p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: e.category?.colorHex || "#F59E0B" }}
                      >
                        {e.category?.name || "Event"}
                      </span>

                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                        <Zap className="w-3.5 h-3.5 fill-current" /> +{e.baseXp} XP
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{e.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{e.description}</p>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>Date: {new Date(e.eventDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>Location: {e.location || "Campus Main"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-4 h-4" /> {e._count.participants} Attendees
                    </span>

                    {isCheckedIn ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Checked In (+{e.baseXp} XP)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(e.id)}
                        className="pro-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Check In & Claim XP
                      </button>
                    )}
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
