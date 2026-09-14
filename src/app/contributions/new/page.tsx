"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Link as LinkIcon,
  Github,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  baseXp: number;
  colorHex: string;
}

export default function NewContribution() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingGh, setFetchingGh] = useState(false);
  const [error, setError] = useState("");
  const [ghSuccess, setGhSuccess] = useState("");

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectEventName, setProjectEventName] = useState("");
  const [evidenceType, setEvidenceType] = useState<"url" | "github" | "file">("github");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setSelectedCategory(data.categories[0]);
        }
      })
      .finally(() => setLoadingCats(false));
  }, []);

  const handleFetchGitHub = async () => {
    if (!evidenceUrl || !evidenceUrl.includes("github.com")) {
      setError("Please enter a valid GitHub Pull Request or Issue URL first.");
      return;
    }
    setFetchingGh(true);
    setError("");
    setGhSuccess("");

    try {
      const res = await fetch("/api/github/pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: evidenceUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.metadata) {
          setTitle(data.metadata.title || title);
          setDescription(data.metadata.description || description);
          setProjectEventName(data.metadata.projectEventName || projectEventName);
          setGhSuccess(`✨ Auto-filled PR metadata from ${data.metadata.projectEventName}!`);
        }
      } else {
        setError("Could not fetch metadata for this URL. You can still fill details manually.");
      }
    } catch {
      setError("Failed to reach GitHub API");
    } finally {
      setFetchingGh(false);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    setError("");
    if (!selectedCategory || !title || !description || !evidenceUrl) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          title,
          description,
          projectEventName,
          evidenceType,
          evidenceUrl,
          isDraft,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit contribution");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Step Indicator Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Submit Contribution Evidence
          </h1>
          <p className="text-xs text-slate-400">
            Submit verified proof of your code, design, event, or mentoring work to earn club XP.
          </p>

          {/* Stepper Wizard Bar */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[
              { num: 1, label: "Category" },
              { num: 2, label: "Evidence" },
              { num: 3, label: "Details" },
              { num: 4, label: "Confirm" },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                      : step > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    step === s.num ? "text-white" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
                {idx < 3 && (
                  <div className="w-8 h-0.5 bg-slate-800 mx-1 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {ghSuccess && (
          <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold">
            {ghSuccess}
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="pro-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Step 1: Select Contribution Category</h2>
                <p className="text-xs text-slate-400">
                  Select the domain that best fits your activity. Point weights are pre-configured by club admins.
                </p>
              </div>

              {loadingCats ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="h-20 pro-card rounded-2xl bg-slate-900/40" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-4 rounded-2xl text-left pro-card flex flex-col justify-between space-y-2 border transition-all ${
                        selectedCategory?.id === cat.id
                          ? "border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.colorHex }}
                      />
                      <div>
                        <div className="text-sm font-bold text-white">{cat.name}</div>
                        <div className="text-[11px] font-mono text-indigo-400 font-bold">
                          +{cat.baseXp} Base XP
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedCategory}
                  onClick={() => setStep(2)}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  NEXT: ADD EVIDENCE <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EVIDENCE & AUTO-FETCH */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Step 2: Verification Proof & Links</h2>
                <p className="text-xs text-slate-400">
                  Provide a direct GitHub PR, Figma design link, or document proof URL.
                </p>
              </div>

              {/* Evidence Type Switcher */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setEvidenceType("github")}
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    evidenceType === "github"
                      ? "border-indigo-500 bg-indigo-950/60 text-white"
                      : "border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Github className="w-4 h-4" /> GitHub PR / Issue
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceType("url")}
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    evidenceType === "url"
                      ? "border-indigo-500 bg-indigo-950/60 text-white"
                      : "border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" /> Figma / Drive / Web
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceType("file")}
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    evidenceType === "file"
                      ? "border-indigo-500 bg-indigo-950/60 text-white"
                      : "border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Upload className="w-4 h-4" /> File Document
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Direct Proof URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder={
                      evidenceType === "github"
                        ? "https://github.com/clubconnect/core/pull/42"
                        : "https://figma.com/file/xyz or https://drive.google.com/..."
                    }
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl pro-input text-xs font-mono text-cyan-300"
                  />
                  {evidenceType === "github" && (
                    <button
                      type="button"
                      disabled={fetchingGh || !evidenceUrl}
                      onClick={handleFetchGitHub}
                      className="pro-btn-secondary px-4 py-2.5 text-xs font-bold shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {fetchingGh ? "Fetching..." : "Auto-Fill"}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!evidenceUrl}
                  onClick={() => setStep(3)}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  NEXT: DETAILS <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Step 3: Activity Details</h2>
                <p className="text-xs text-slate-400">
                  Describe what you built, organized, or designed for the club.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contribution Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implemented OAuth Auth Flow / Organized Hackathon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Associated Project / Repository / Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ClubConnect Core / Fall Hackathon 2026"
                    value={projectEventName}
                    onChange={(e) => setProjectEventName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Detailed Summary *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Outline your specific contribution, PR details, or event impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!title || !description}
                  onClick={() => setStep(4)}
                  className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  REVIEW & PREVIEW <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Step 4: Review & Dispatch</h2>
                <p className="text-xs text-slate-400">
                  Verify your submission before sending to the coordinator review queue.
                </p>
              </div>

              <div className="p-5 rounded-2xl pro-card border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                    style={{
                      backgroundColor:
                        selectedCategory?.colorHex || "#6366F1",
                    }}
                  >
                    {selectedCategory?.name}
                  </span>
                  <span className="text-sm font-bold text-indigo-400 font-mono flex items-center gap-1">
                    <Zap className="w-4 h-4" /> +{selectedCategory?.baseXp} XP Expected
                  </span>
                </div>

                <div>
                  <div className="text-base font-bold text-white">{title}</div>
                  <div className="text-xs text-slate-400">{projectEventName}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {description}
                </p>

                <div className="text-xs text-cyan-400 font-mono truncate">
                  Evidence: {evidenceUrl}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Edit
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(true)}
                    className="pro-btn-secondary px-4 py-2.5 text-xs font-semibold"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(false)}
                    className="pro-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {submitting ? "Dispatching..." : "Dispatch to Queue"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
