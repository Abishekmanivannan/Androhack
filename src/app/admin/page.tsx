"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Shield, Sliders, Database, Save } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  baseXp: number;
  colorHex: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  createdAt: string;
  actor?: { name: string };
}

export default function AdminPanel() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editedXp, setEditedXp] = useState<{ [key: string]: number }>({});
  const [toast, setToast] = useState("");

  const loadData = async () => {
    try {
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
        const xpMap: { [key: string]: number } = {};
        data.categories?.forEach((c: CategoryItem) => {
          xpMap[c.id] = c.baseXp;
        });
        setEditedXp(xpMap);
      }

      const logRes = await fetch("/api/admin/logs");
      if (logRes.ok) {
        const lData = await logRes.json();
        setLogs(lData.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveXp = async (categoryId: string) => {
    const newXp = editedXp[categoryId];
    if (!newXp || newXp < 1) return;

    setSavingId(categoryId);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, baseXp: Number(newXp) }),
      });

      if (res.ok) {
        setToast("✅ Category base XP weight updated!");
        setTimeout(() => setToast(""), 3000);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-6">
          <div className="h-64 pro-panel rounded-3xl bg-slate-900/40" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-400" />
            Admin System Control & Audit Logs
          </h1>
          <p className="text-xs text-slate-400">
            Configure category base point weights, manage system rules, and inspect security audit streams.
          </p>
        </div>

        {toast && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {toast}
          </div>
        )}

        {/* Category Point Weights Grid */}
        <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" /> Configure Category Base XP Weights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="pro-card p-4 rounded-2xl space-y-3 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.colorHex }}
                  />
                  <span className="text-sm font-bold text-white">{cat.name}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-mono">
                    Base XP Weight:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editedXp[cat.id] ?? cat.baseXp}
                      onChange={(e) =>
                        setEditedXp({
                          ...editedXp,
                          [cat.id]: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl pro-input text-xs font-mono text-white font-bold"
                    />
                    <button
                      onClick={() => handleSaveXp(cat.id)}
                      disabled={savingId === cat.id}
                      className="pro-btn-primary px-3 py-1.5 text-xs font-bold shrink-0 flex items-center"
                    >
                      {savingId === cat.id ? "Saving..." : <Save className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit & Security Stream */}
        <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" /> Security Audit Stream
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl pro-card flex items-center justify-between gap-4 text-xs border border-slate-800 font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-indigo-300 text-[10px] font-bold border border-slate-800">
                    {log.action}
                  </span>
                  <span className="text-slate-300">{log.actor?.name || "System"}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
