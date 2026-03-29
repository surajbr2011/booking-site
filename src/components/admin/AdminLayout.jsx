"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BedDouble, 
  MessageSquare, 
  LogOut, 
  ChevronLeft,
  Settings,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings" },
  { icon: BedDouble, label: "Rooms", href: "/admin/rooms" },
  { icon: MessageSquare, label: "Inquiries", href: "/admin/inquiries" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminLayout({ children }) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="bg-[#1e293b] text-white flex flex-col fixed h-full z-30 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <span className="font-black text-xl tracking-tighter text-[#1e81b0]">
              EXO<span className="text-white">ADMIN</span>
            </span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className={cn("transition-transform", isCollapsed && "rotate-180")} size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group",
                pathname === item.href 
                  ? "bg-[#1e81b0] text-white shadow-lg shadow-[#1e81b0]/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(pathname === item.href ? "text-white" : "group-hover:text-white")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          {!isCollapsed && (
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e81b0]/20 flex items-center justify-center text-[#1e81b0]">
                <UserCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-black">System Admin</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Administrator</p>
              </div>
            </div>
          )}
          <button 
            onClick={logout}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          isCollapsed ? "pl-20" : "pl-[280px]"
        )}
      >
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-lg font-black text-[#1e293b]">
            {menuItems.find(item => item.href === pathname)?.label || "Admin Portal"}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-800">Welcome, Admin</p>
              <p className="text-[10px] text-[#1e81b0] font-black uppercase tracking-widest">The Exotica Agonda</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
