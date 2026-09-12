"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Shield, User, UserCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister
      ? { name, email, password, department, role }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user?.role === "coordinator" || data.user?.role === "admin") {
          router.push("/coordinator/queue");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "password123" }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user?.role === "coordinator" || data.user?.role === "admin") {
          router.push("/coordinator/queue");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (e) {
      setError("Failed to log in as demo account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mx-auto">
          <Zap className="w-7 h-7 text-white fill-current" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">ClubConnect</h1>
        <p className="text-xs text-slate-400">
          Member Contribution & Recognition Platform
        </p>
      </div>

      {/* Main Auth Form Container */}
      <div className="w-full max-w-md pro-panel p-8 rounded-3xl space-y-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold">
            {isRegister ? "Create Account" : "Sign In to Workspace"}
          </h2>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {isRegister ? "Have an account? Sign In" : "Need account? Register"}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department / Major
                </label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl pro-input text-sm bg-slate-900"
                >
                  <option value="member">Member</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="alex@club.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl pro-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pro-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : isRegister ? "Register" : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Logins for Hackathon Testing */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin("alex@club.org")}
              className="p-2.5 rounded-xl pro-card text-center text-xs font-semibold text-slate-300 hover:text-white border border-slate-800"
            >
              <User className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
              Member
            </button>
            <button
              onClick={() => handleQuickLogin("coordinator@club.org")}
              className="p-2.5 rounded-xl pro-card text-center text-xs font-semibold text-slate-300 hover:text-white border border-slate-800"
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              Coordinator
            </button>
            <button
              onClick={() => handleQuickLogin("admin@club.org")}
              className="p-2.5 rounded-xl pro-card text-center text-xs font-semibold text-slate-300 hover:text-white border border-slate-800"
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-rose-400" />
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
