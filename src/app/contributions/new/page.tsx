"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Link2,
  Briefcase,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  baseXp: number;
  colorHex: string;
}

interface Project {
  id: string;
  name: string;
}

interface EventItem {
  id: string;
  title: string;
}

export default function NewContributionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [eventId, setEventId] = useState("");
  const [projectEventName, setProjectEventName] = useState("");
  const [evidenceType, setEvidenceType] = useState("github");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [catRes, projRes, eventRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/projects"),
        fetch("/api/events"),
      ]);

      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setCategoryId(data.categories[0].id);
        }
      }

      if (projRes.ok) {
        const data = await projRes.json();
        setProjects(data.projects || []);
      }

      if (eventRes.ok) {
        const data = await eventRes.json();
        setEvents(data.events || []);
      }
    } catch {
      // Ignore
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          title,
          description,
          projectId: projectId || undefined,
          eventId: eventId || undefined,
          projectEventName: projectEventName || "General Activity",
          evidenceType,
          evidenceUrl,
          isDraft,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit contribution");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-400" /> 6-Step Contribution Wizard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit code PRs, design assets, event operations, or mentorship for coordinator review
          </p>
        </div>

        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { stepNum: 1, label: "Category" },
            { stepNum: 2, label: "Details" },
            { stepNum: 3, label: "Project/Event" },
            { stepNum: 4, label: "Evidence" },
            { stepNum: 5, label: "Preview & Submit" },
          ].map((s) => (
            <div
              key={s.stepNum}
              onClick={() => s.stepNum < step && setStep(s.stepNum)}
              className={`py-2 rounded-lg border transition-colors cursor-pointer ${
                step === s.stepNum
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                  : step > s.stepNum
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="pro-panel p-6 sm:p-8 space-y-6">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Step 1: Select Contribution Category
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                      categoryId === cat.id
                        ? "bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.colorHex }}
                    />
                    <div className="font-bold text-xs">{cat.name}</div>
                    <div className="text-[11px] text-slate-400">+{cat.baseXp} Base XP</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!categoryId}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Step 2: Title & Detailed Description
              </h2>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Contribution Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implemented Google OAuth Auth Handler"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your work, technical approach, impact, or outcomes..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="pro-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!title.trim() || !description.trim()}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROJECT/EVENT ATTRIBUTION */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Step 3: Project / Event Attribution
              </h2>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Link to Club Project (Optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    const proj = projects.find((p) => p.id === e.target.value);
                    if (proj) setProjectEventName(proj.name);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">None (Independent Activity)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Project or Event Name Label</label>
                <input
                  type="text"
                  value={projectEventName}
                  onChange={(e) => setProjectEventName(e.target.value)}
                  placeholder="e.g. ClubConnect Core App or Fall Hackathon 2026"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="pro-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EVIDENCE */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-400" /> Step 4: Verification Evidence Link
              </h2>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: "github", label: "GitHub PR / Commit" },
                  { type: "figma", label: "Figma Link" },
                  { type: "document", label: "Doc / Report" },
                  { type: "url", label: "Web URL" },
                ].map((ev) => (
                  <button
                    key={ev.type}
                    type="button"
                    onClick={() => setEvidenceType(ev.type)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                      evidenceType === ev.type
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    {ev.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Evidence URL *</label>
                <input
                  type="url"
                  required
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/club/repo/pull/42 or Figma / Drive link"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="pro-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  disabled={!evidenceUrl.trim()}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5"
                >
                  Preview & Submit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & SUBMIT */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Step 5: Review & Submit Contribution
              </h2>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: selectedCategory?.colorHex || "#6366F1" }}
                  >
                    {selectedCategory?.name} (+{selectedCategory?.baseXp} XP Base)
                  </span>
                  <span className="text-xs text-slate-400">{projectEventName || "General Activity"}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-slate-300 whitespace-pre-wrap">{description}</p>

                <div className="text-xs text-indigo-400 font-semibold truncate pt-2 border-t border-slate-800">
                  Evidence ({evidenceType}): {evidenceUrl}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="pro-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Edit Details
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="pro-btn-primary px-8 py-3 text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {loading ? "Submitting..." : "Confirm & Submit to Coordinator Queue"}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
