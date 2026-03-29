"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Loader2, AlertCircle, CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "@/lib/apiClient";

const STEPS = { EMAIL: "email", TOKEN: "token", DONE: "done" };

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "If an account with that email exists, a reset link has been sent.");
      setStep(STEPS.TOKEN);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid or expired token.");
      } else {
        setStep(STEPS.DONE);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1e81b0]/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[460px] relative z-20"
      >
        <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-10 md:p-14 border border-white/10">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-gradient-to-br from-[#1e81b0] to-blue-600 rounded-3xl shadow-2xl shadow-blue-500/20 mb-8 items-center justify-center">
              <KeyRound className="text-white" size={36} strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-1">
              {step === STEPS.DONE ? "Password Reset" : "Forgot Password"}
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.25em] text-[10px]">
              {step === STEPS.EMAIL && "Enter your admin email"}
              {step === STEPS.TOKEN && "Enter the reset token"}
              {step === STEPS.DONE && "You can now log in"}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-3 mb-6">
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1 — Email */}
          {step === STEPS.EMAIL && (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your admin email address"
                required
                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/40 transition-all text-sm"
              />
              <button type="submit" disabled={isLoading}
                className="w-full bg-[#1e81b0] hover:bg-blue-500 h-14 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 disabled:opacity-60">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Send Reset Token <ChevronRight size={16} strokeWidth={3} /></>}
              </button>
            </form>
          )}

          {/* Step 2 — Token + New Password */}
          {step === STEPS.TOKEN && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {message && (
                <p className="text-[#1e81b0] text-xs font-bold text-center bg-blue-500/10 py-3 px-4 rounded-2xl border border-blue-500/20">
                  {message}
                </p>
              )}
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">Reset Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste the token from your email"
                  required
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/40 transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/40 transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/40 transition-all text-sm"
                />
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full bg-[#1e81b0] hover:bg-blue-500 h-14 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 disabled:opacity-60 mt-2">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Reset Password <ChevronRight size={16} strokeWidth={3} /></>}
              </button>
            </form>
          )}

          {/* Step 3 — Done */}
          {step === STEPS.DONE && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-green-400" size={32} />
              </div>
              <p className="text-gray-400 text-sm font-medium">Your password has been updated successfully. You can now log in with your new password.</p>
              <Link href="/admin/login"
                className="inline-flex items-center gap-2 w-full justify-center bg-[#1e81b0] hover:bg-blue-500 h-14 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10">
                <ShieldCheck size={18} /> Go to Login
              </Link>
            </div>
          )}

          {/* Back to Login */}
          {step !== STEPS.DONE && (
            <div className="mt-8 text-center">
              <Link href="/admin/login" className="text-gray-600 hover:text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors">
                <ArrowLeft size={12} /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
