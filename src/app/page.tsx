"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Trophy,
  ChevronDown,
  FileCheck,
  Share2,
  Lock,
} from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative pt-12 lg:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>ClubConnect Platform v1.0.0 • Enterprise Edition</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Make student club contributions{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  verifiable & recognized.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Club members spend hundreds of hours building software, designing assets, and organizing campus events—yet leave with zero verifiable proof. ClubConnect is the single source of truth that turns volunteer output into tamper-proof career credentials.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="pro-btn-primary px-7 py-3.5 text-sm font-bold flex items-center gap-2"
                >
                  Launch Platform Workspace <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/portfolio/Alex%20Rivera"
                  className="pro-btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> View Verified Sample Portfolio
                </Link>
              </div>
            </div>

            {/* Right Emblem & Live Credential Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-md pro-panel rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl relative">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center p-3">
                  <img
                    src="/hero_avatar.png"
                    alt="ClubConnect Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-center space-y-1">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                    Verified Credential Network <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Integrated GitHub, Figma & Institutional Audit Logs
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium uppercase">
                      Status
                    </div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      100% Verifiable
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium uppercase">
                      Audit Level
                    </div>
                    <div className="font-bold text-indigo-400 mt-0.5 font-mono">
                      Tier 5 Standard
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & IMPACT BAR */}
        <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-white font-mono">
                  1,250+
                </div>
                <div className="text-xs font-medium text-slate-400">
                  Verified Contributions Logged
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-indigo-400 font-mono">
                  99.8%
                </div>
                <div className="text-xs font-medium text-slate-400">
                  Triage Review Verification
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                  45+
                </div>
                <div className="text-xs font-medium text-slate-400">
                  Student Club Organizations
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  15,000+
                </div>
                <div className="text-xs font-medium text-slate-400">
                  Club XP Awarded
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PRODUCT MODULES SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Enterprise Platform Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Four core modules engineered to turn decentralized volunteer labor into structured organizational intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Module 1 */}
            <div className="pro-panel p-8 rounded-3xl space-y-4 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">1. Structured Submission Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                4-step submission wizard for Members supporting 8 functional categories (Technical, Design, Event, Mentoring, Marketing, Leadership, Sponsorship, Media). Features automatic GitHub PR metadata auto-filling.
              </p>
              <div className="pt-2 text-xs font-mono text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supports direct GitHub, Figma & Drive evidence URLs
              </div>
            </div>

            {/* Module 2 */}
            <div className="pro-panel p-8 rounded-3xl space-y-4 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">2. Split-Screen Verification Queue</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated triage workspace for Coordinators pairing contributor metadata on the left with embedded live evidence previews on the right. 1-click Approve (+XP), Request Clarification, or Reject.
              </p>
              <div className="pt-2 text-xs font-mono text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Celebratory confetti animation on approval dispatch
              </div>
            </div>

            {/* Module 3 */}
            <div className="pro-panel p-8 rounded-3xl space-y-4 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">3. Gamified Level Tier & Badge Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated 5-tier level progression (Newcomer to Club Leader) with dynamic XP gauges, streak checks, and criteria-based badge unlocks (First Steps, Code Contributor, Century Club).
              </p>
              <div className="pt-2 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-tab leaderboards (Weekly, Semester, Most Improved)
              </div>
            </div>

            {/* Module 4 */}
            <div className="pro-panel p-8 rounded-3xl space-y-4 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">4. Shareable Credential & Portfolio</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unique public URLs at `/portfolio/[username]` featuring verified contribution records, badge showcases, verified skills, and a scannable mobile QR code for instant recruiter verification.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Embedded scannable QR verification widget
              </div>
            </div>
          </div>
        </section>

        {/* ROLE-BASED WORKFLOW MATRIX */}
        <section id="workflows" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Designed for the Whole Club Ecosystem
            </h2>
            <p className="text-sm text-slate-400">
              Tailored workspaces for Members, Coordinators, and System Administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="pro-card p-6 rounded-2xl space-y-4 border border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Member Workspace
              </div>
              <h4 className="text-lg font-bold">Submit & Build Portfolio</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Log code, design, or event proof
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Track review status in real time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Earn XP, levels & achievement badges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Share public portfolio URL & QR code
                </li>
              </ul>
            </div>

            <div className="pro-card p-6 rounded-2xl space-y-4 border border-amber-500/20">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Coordinator Workspace
              </div>
              <h4 className="text-lg font-bold">Review & Monitor Health</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Triage queue with live link previews
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Approve points & dispatch badge checks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Threaded clarification dialogue
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Club Health domain gap diagnostics
                </li>
              </ul>
            </div>

            <div className="pro-card p-6 rounded-2xl space-y-4 border border-rose-500/20">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Admin Control Panel
              </div>
              <h4 className="text-lg font-bold">Configure & Audit</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Adjust category base point weights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Configure badge unlocking criteria
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Manage user roles & access permissions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Inspect security & system audit logs
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* TRUST & VERIFICATION STANDARDS */}
        <section id="verification" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pro-panel p-8 sm:p-12 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Lock className="w-4 h-4" /> Tamper-Proof Trust Architecture
              </div>
              <h3 className="text-2xl font-extrabold">No Self-Reported Inflation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unverified self-reporting inflates ranks and weakens portfolio trust. ClubConnect enforces strict 2-step verification: every point award requires coordinator approval backed by tangible proof artifacts.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="pro-btn-primary px-6 py-3 text-xs font-bold shrink-0"
            >
              Explore Live System
            </Link>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Everything you need to know about the ClubConnect platform.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How does contribution verification work?",
                a: "Members submit activity records along with evidence links (such as GitHub PRs, Figma files, or Drive documents). Coordinators review these in a split-screen queue with embedded live previews before approving XP.",
              },
              {
                q: "How are XP points calculated for different activities?",
                a: "Each activity category (Technical, Design, Event, Mentoring, etc.) has a base XP weight configured by administrators. Coordinators can adjust the suggested XP during triage based on effort.",
              },
              {
                q: "Can employers verify public portfolios without an account?",
                a: "Yes! Public portfolios at /portfolio/[username] are open access and include a scannable mobile QR code for instant verification.",
              },
              {
                q: "How do Coordinators manage domain deficits?",
                a: "The Club Health dashboard analyzes category contribution volume over 30 days and alerts coordinators if specific areas (like Sponsorship or Marketing) have zero logged activity.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="pro-card rounded-2xl border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* COMPREHENSIVE ENTERPRISE FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Zap className="w-5 h-5 text-indigo-500 fill-current" />
                ClubConnect
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Centralized platform designed to make student club member contributions visible, verifiable, measurable, and recognized.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                Workspaces
              </div>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Member Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/contributions/new" className="hover:text-white">
                    Submit Activity
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-white">
                    Leaderboards
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                Governance
              </div>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/coordinator/queue" className="hover:text-white">
                    Review Queue
                  </Link>
                </li>
                <li>
                  <Link href="/coordinator/health" className="hover:text-white">
                    Club Health
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white">
                    Admin Control
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                Portfolios
              </div>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/portfolio/Alex%20Rivera" className="hover:text-white">
                    Sample Credential
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Register Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 ClubConnect Platform • v1.0.0 Hackathon Edition. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-slate-500">Built with Next.js 15, Prisma & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
