"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ChevronRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const loginSchema = yup.object({
  email: yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format")
    .required("Email is required"),
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain lowercase")
    .matches(/[A-Z]/, "Must contain uppercase")
    .matches(/[0-9]/, "Must contain number")
    .required("Password is required"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    const { success, error: loginError } = await login(data.email, data.password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError(`Auth Error: ${loginError}`);
      console.error("Login attempt failed:", loginError);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-[#1e81b0] selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1e81b0]/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] relative z-20"
      >
        <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-10 md:p-14 border border-white/10">

          {/* Logo / Header */}
          <div className="text-center mb-12">
            <div className="inline-flex p-5 bg-gradient-to-br from-[#1e81b0] to-blue-600 rounded-3xl shadow-2xl shadow-blue-500/20 mb-8 items-center justify-center">
              <ShieldCheck className="text-white" size={40} strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">System Admin</h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Security Gateway</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-3 mb-4"
                >
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="space-y-2">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Admin Email"
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/40 transition-all text-sm"
                />
                {errors.email && <p className="text-red-500 text-[9px] font-black uppercase px-2">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Security Token"
                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 pr-14 font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/40 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-[#1e81b0] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[9px] font-black uppercase px-2">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e81b0] hover:bg-blue-500 h-14 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 relative group overflow-hidden"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Verify &amp; Enter <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <Link
              href="/admin/forgot-password"
              className="text-gray-600 hover:text-[#1e81b0] text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-[9px] text-gray-700 font-bold uppercase tracking-widest border-t border-white/5 pt-8">
            Access restricted to resort staff only.
          </div>

        </div>
      </motion.div>
    </div>
  );
}
