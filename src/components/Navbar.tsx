"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CommandPalette from "@/components/CommandPalette";
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
  Bell,
  Activity,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export default function Navbar() {
  const { user, loading, switchRole, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Ignore
    }
  };

  const markNotificationsRead = async () => {
    setNotifMenuOpen(!notifMenuOpen);
    if (!notifMenuOpen && unreadCount > 0) {
      try {
        await fetch("/api/notifications/read", { method: "POST" });
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch {
        // Ignore
      }
    }
  };

  const handleRoleSwitch = async (targetRole: string) => {
    setProfileMenuOpen(false);
    await switchRole(targetRole);
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/activity", label: "Activity", icon: Activity },
    { href: "/contributions/new", label: "Submit", icon: PlusCircle, highlight: true },
    { href: "/achievements", label: "Badges", icon: Award },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/community/projects", label: "Projects", icon: Briefcase },
    { href: "/community/events", label: "Events", icon: Calendar },
  ];

  const isCoordinator = user?.role === "coordinator" || user?.role === "admin";

  return (
    <>
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      <header className="sticky top-0 z-50 px-4 sm:px-6 py-2.5 bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                ClubConnect
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 hidden xl:inline-block">
                V2 Enterprise
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          {!loading && user && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-xs font-medium">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href.startsWith("/community/") && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                      isActive
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                        : link.highlight
                        ? "text-indigo-300 hover:text-white hover:bg-indigo-950/40"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${link.highlight && !isActive ? "text-indigo-400" : ""}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {isCoordinator && (
                <Link
                  href="/coordinator/queue"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                    pathname.startsWith("/coordinator")
                      ? "bg-amber-600 text-white font-semibold shadow-md shadow-amber-600/30"
                      : "text-amber-400 hover:bg-amber-950/40"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Review</span>
                </Link>
              )}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <>
                {/* Search Button (Ctrl+K) */}
                <button
                  onClick={() => setCmdOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  title="Search (Ctrl+K)"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline text-[11px]">Search...</span>
                  <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 rounded font-mono text-slate-400 border border-slate-700">
                    ⌘K
                  </kbd>
                </button>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={markNotificationsRead}
                    className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors border border-transparent hover:border-slate-800"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#07090e] animate-pulse" />
                    )}
                  </button>

                  {notifMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto pro-panel rounded-2xl p-3 shadow-2xl border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-indigo-400" /> Notifications
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Recent Updates</span>
                      </div>

                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No new notifications.</p>
                      ) : (
                        <div className="space-y-2">
                          {notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              className={`p-2.5 rounded-xl text-xs border transition-colors ${
                                n.isRead ? "bg-slate-900/40 border-slate-800/60" : "bg-indigo-950/30 border-indigo-500/30"
                              }`}
                            >
                              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                                {n.type === "contribution_approved" ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                )}
                                <span>{n.title}</span>
                              </div>
                              <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile & User Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-800/70 transition-all border border-slate-800/80 bg-slate-900/40 group"
                  >
                    <img
                      src={
                        user.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                      }
                      alt={user.name}
                      className="w-7 h-7 rounded-lg border border-indigo-500/40 bg-slate-800 object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate hidden sm:inline-block">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase hidden md:inline-block ${
                        user.role === "admin"
                          ? "bg-rose-950 text-rose-400 border border-rose-800/40"
                          : user.role === "coordinator"
                          ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                          : "bg-indigo-950 text-indigo-400 border border-indigo-800/40"
                      }`}
                    >
                      {user.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-150" />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 pro-panel rounded-2xl p-2 shadow-2xl border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                      <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate font-mono">{user.email}</p>
                      </div>

                      <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Quick Links
                      </div>

                      <Link
                        href={`/portfolio/${encodeURIComponent(user.email)}`}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>My Public Portfolio</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Account Settings</span>
                      </Link>

                      <div className="border-t border-slate-800/80 my-1 pt-1">
                        <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Demo Role Switcher
                        </div>
                        <button
                          onClick={() => handleRoleSwitch("member")}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                            user.role === "member"
                              ? "bg-indigo-600 text-white font-semibold"
                              : "text-slate-300 hover:bg-slate-800/60"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Member View
                          </span>
                          {user.role === "member" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch("coordinator")}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                            user.role === "coordinator"
                              ? "bg-amber-600 text-white font-semibold"
                              : "text-slate-300 hover:bg-slate-800/60"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Coordinator View
                          </span>
                          {user.role === "coordinator" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch("admin")}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                            user.role === "admin"
                              ? "bg-rose-600 text-white font-semibold"
                              : "text-slate-300 hover:bg-slate-800/60"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-rose-400" /> Admin View
                          </span>
                          {user.role === "admin" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="border-t border-slate-800/80 pt-1">
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : !loading && !user ? (
              <div className="flex items-center gap-2">
                <Link href="/login" className="pro-btn-secondary px-3.5 py-1.5 text-xs">
                  Sign In
                </Link>
                <Link href="/dashboard" className="pro-btn-primary px-3.5 py-1.5 text-xs">
                  Launch Workspace
                </Link>
              </div>
            ) : (
              <div className="h-8 w-24 bg-slate-900/60 rounded-xl animate-pulse" />
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {!loading && user && mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/80 mt-3 pt-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href.startsWith("/community/") && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isCoordinator && (
              <Link
                href="/coordinator/queue"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  pathname.startsWith("/coordinator")
                    ? "bg-amber-600 text-white font-semibold"
                    : "text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Coordinator Workspace</span>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
