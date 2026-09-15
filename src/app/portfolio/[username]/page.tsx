"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { QRCodeSVG } from "qrcode.react";
import {
  Award,
  ExternalLink,
  Share2,
  ShieldCheck,
  Briefcase,
  QrCode,
} from "lucide-react";

interface UserBadgeItem {
  id: string;
  badge?: { name: string; description: string };
}

interface ContributionItem {
  id: string;
  title: string;
  description: string;
  projectEventName?: string;
  evidenceUrl: string;
  pointsAwarded: number;
  verifiedAt?: string;
  createdAt: string;
  category?: { name: string; colorHex: string };
}

interface PortfolioData {
  id: string;
  name: string;
  email: string;
  department?: string;
  avatarUrl?: string;
  skills?: string[];
  totalXp: number;
  currentLevel: string;
  userBadges?: UserBadgeItem[];
  contributions?: ContributionItem[];
}

export default function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
    fetch(`/api/portfolio/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Portfolio not found");
        return res.json();
      })
      .then((data) => setPortfolio(data.portfolio))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
          <div className="h-48 pro-panel rounded-3xl bg-slate-900/40" />
          <div className="h-64 pro-panel rounded-3xl bg-slate-900/40" />
        </main>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto text-center p-8 pro-panel rounded-3xl space-y-4 border border-slate-800">
          <ShieldCheck className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold">Portfolio Not Found</h2>
          <p className="text-xs text-slate-400">
            The profile you requested does not exist or has been set to private.
          </p>
          <Link
            href="/dashboard"
            className="pro-btn-primary inline-block px-6 py-2.5 text-xs font-bold"
          >
            RETURN TO DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header Profile Hero Card */}
        <div className="pro-panel rounded-3xl p-8 relative overflow-hidden border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <img
                src={
                  portfolio.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.name}`
                }
                alt={portfolio.name}
                className="w-20 h-20 rounded-2xl border border-indigo-500/40 bg-slate-900 shadow-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold">{portfolio.name}</h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED CREDENTIAL
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {portfolio.department || "Club Member"} • {portfolio.email}
                </p>
                <div className="text-xs text-indigo-400 font-mono font-bold pt-1">
                  Tier: {portfolio.currentLevel} • {portfolio.totalXp} Total XP
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={copyUrl}
                className="pro-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                {copied ? "LINK COPIED!" : "SHARE PROFILE"}
              </button>
            </div>
          </div>

          {/* Skill Badges */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                Verified Skills:
              </span>
              {portfolio.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-indigo-300 text-xs font-mono font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* QR Code Verification & Earned Badges Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QR Code Card (1 col) */}
          <div className="pro-panel rounded-3xl p-6 space-y-4 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <QrCode className="w-4 h-4 text-indigo-400" /> Mobile Verification
            </div>
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <QRCodeSVG
                value={currentUrl || `https://clubconnect.org/portfolio/${portfolio.name}`}
                size={120}
                bgColor="#FFFFFF"
                fgColor="#0B0F19"
                level="L"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Scan with camera to instantly verify live credentials on mobile
            </p>
          </div>

          {/* Unlocked Badges Showcase (2 cols) */}
          <div className="md:col-span-2 pro-panel rounded-3xl p-6 space-y-4 border border-slate-800">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Earned Club Badges
            </h2>
            {(portfolio.userBadges?.length ?? 0) > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {portfolio.userBadges?.map((ub: UserBadgeItem) => (
                  <div
                    key={ub.id}
                    className="pro-card p-3.5 rounded-2xl space-y-1.5 border border-slate-800 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {ub.badge?.name}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {ub.badge?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No badges unlocked yet.</p>
            )}
          </div>
        </div>

        {/* Verified Contribution Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" /> Verified Work Record
          </h2>

          <div className="space-y-4">
            {portfolio.contributions?.map((c: ContributionItem) => (
              <div
                key={c.id}
                className="pro-card p-5 rounded-2xl space-y-3 border border-slate-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                      style={{
                        backgroundColor: c.category?.colorHex || "#6366F1",
                      }}
                    >
                      {c.category?.name}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {c.title}
                    </h3>
                    <div className="text-xs text-slate-400">
                      {c.projectEventName}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    +{c.pointsAwarded} XP
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <a
                    href={c.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono font-semibold truncate max-w-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verify Proof Artifact
                  </a>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Verified {new Date(c.verifiedAt || c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
