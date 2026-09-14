"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { User, Lock, Eye, EyeOff, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [department, setDepartment] = useState(user?.department || "Computer Science");
  const [portfolioPublic, setPortfolioPublic] = useState(user?.portfolioPublic ?? true);
  const [skills, setSkills] = useState<string[]>(user?.skills || ["TypeScript", "React", "UI Design"]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          skills,
          portfolioPublic,
        }),
      });

      if (res.ok) {
        setSuccess("Profile settings updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
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

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-400" /> Account & Profile Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your public portfolio visibility, department information, and skills profile
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="pro-panel p-6 sm:p-8 space-y-6">
          {/* Department */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Department / Major</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Portfolio Privacy Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {portfolioPublic ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                  Public Portfolio Showcase
                </span>
                <p className="text-[11px] text-slate-400">
                  When enabled, non-members can view your verified contributions at `/portfolio/{user?.email}`.
                </p>
              </div>

              <input
                type="checkbox"
                checked={portfolioPublic}
                onChange={(e) => setPortfolioPublic(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Skills Manager */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">Skills & Tech Stack</label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill (e.g. Next.js, Figma, Python)..."
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="pro-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="pro-btn-primary px-6 py-2.5 text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
