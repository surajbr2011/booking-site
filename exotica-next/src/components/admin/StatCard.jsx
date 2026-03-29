"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, icon: Icon, trend, trendValue, color }) {
  const isPositive = trend === "up";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-4 rounded-2xl", color ? `bg-${color}-50 text-${color}-600` : "bg-[#1e81b0]/10 text-[#1e81b0]")}>
          <Icon size={24} />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trendValue}%
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-[#1e293b]">{value}</h3>
      </div>
    </motion.div>
  );
}
