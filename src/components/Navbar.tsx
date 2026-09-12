"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Zap,
  UserCheck,
  Shield,
  PlusCircle,
  LogOut,
  ChevronDown,
  User,
  LayoutDashboard,
  Trophy,
} from "lucide-react";

export default function Navbar() {
  const { user, loading, switchRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleRoleSwitch = async (targetRole: string) => {
    setRoleMenuOpen(false);
    await switchRole(targetRole);
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">
              ClubConnect
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30">
              Enterprise MVP
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {!loading && user ? (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <Link
              href="/contributions/new"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                pathname === "/contributions/new"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Activity
            </Link>
            <Link
              href="/leaderboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                pathname === "/leaderboard"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Leaderboard
            </Link>
            {(user.role === "coordinator" || user.role === "admin") && (
              <Link
                href="/coordinator/queue"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith("/coordinator")
                    ? "bg-amber-600 text-white font-semibold shadow-sm"
                    : "text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Triage Queue
              </Link>
            )}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                  pathname === "/admin"
                    ? "bg-rose-600 text-white font-semibold shadow-sm"
                    : "text-rose-400 hover:bg-rose-950/40"
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
          </nav>
        ) : !loading && !user ? (
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">
              Platform Features
            </Link>
            <Link href="#workflows" className="hover:text-white transition-colors">
              Role Workflows
            </Link>
            <Link href="#verification" className="hover:text-white transition-colors">
              Trust & Verification
            </Link>
            <Link href="#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </nav>
        ) : (
          <div className="h-8 w-48 bg-slate-900/60 rounded-xl animate-pulse" />
        )}

        {/* Right User Actions & Demo Role Switcher */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              {/* Demo Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    user.role === "admin"
                      ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                      : user.role === "coordinator"
                      ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                      : "bg-indigo-950/60 border-indigo-500/40 text-indigo-300"
                  }`}
                  title="Switch Role View for Demo"
                >
                  <span className="capitalize">{user.role} View</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 pro-panel rounded-xl p-1.5 shadow-2xl border border-slate-700 z-50">
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo Role Switcher
                    </div>
                    <button
                      onClick={() => handleRoleSwitch("member")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user.role === "member"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span>Member View</span>
                      <User className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRoleSwitch("coordinator")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user.role === "coordinator"
                          ? "bg-amber-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span>Coordinator View</span>
                      <UserCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRoleSwitch("admin")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user.role === "admin"
                          ? "bg-rose-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span>Admin View</span>
                      <Shield className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Link */}
              <Link
                href={`/portfolio/${encodeURIComponent(user.name)}`}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-slate-800/60 transition-colors border border-slate-800"
              >
                <img
                  src={
                    user.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                  }
                  alt={user.name}
                  className="w-7 h-7 rounded-full border border-indigo-500/40 bg-slate-800"
                />
                <span className="text-xs font-semibold text-white hidden lg:block">
                  {user.name}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : !loading && !user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="pro-btn-secondary px-4 py-2 text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="pro-btn-primary px-4 py-2 text-xs"
              >
                Launch Workspace
              </Link>
            </div>
          ) : (
            <div className="h-8 w-24 bg-slate-900/60 rounded-xl animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
