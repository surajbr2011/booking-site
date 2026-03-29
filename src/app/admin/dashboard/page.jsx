"use client";

import { StatCard } from "@/components/admin/StatCard";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { 
  Users, 
  CalendarDays, 
  IndianRupee, 
  Bed, 
  ArrowUpRight, 
  Clock, 
  MapPin,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllBookings } from "@/lib/bookings";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getAllBookings().slice(0, 5));
  }, []);

  const handleExport = () => {
    // Convert data to CSV format
    const headers = ["ID", "Guest", "Room", "Date", "Status", "Amount"];
    const rows = bookings.map(b => [
      b.id, 
      `"${b.guest}"`, 
      `"${b.room}"`, 
      `"${b.date}"`, 
      `"${b.status}"`, 
      `"${b.amount}"`
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `exotica_resort_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${bookings.reduce((sum, b) => sum + (Number(String(b.amount).replace(/[^0-9.-]+/g,"")) || 0), 0).toLocaleString()}`} 
          icon={IndianRupee} 
          trend="up" 
          trendValue="12.5" 
          color="blue"
        />
        <StatCard 
          title="Total Bookings" 
          value={bookings.length.toString()} 
          icon={CalendarDays} 
          trend="up" 
          trendValue="8.2" 
          color="green"
        />
        <StatCard 
          title="Active Guests" 
          value="18" 
          icon={Users} 
          trend="down" 
          trendValue="2.4" 
          color="orange"
        />
        <StatCard 
          title="Room Occupancy" 
          value="85%" 
          icon={Bed} 
          trend="up" 
          trendValue="5.1" 
          color="purple"
        />
      </div>

      <AdminCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[#1e293b]">Recent Bookings</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Latest guest reservations</p>
            </div>
            <Link href="/admin/bookings" className="text-[#1e81b0] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Guest</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Room</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800 text-sm">{booking.guest}</p>
                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Clock size={10} /> {booking.date || '-'}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-gray-600">{booking.room}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-[#1e293b]">₹{booking.amount?.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        booking.status === "Confirmed" ? "bg-green-50 text-green-600" : 
                        booking.status === "Pending" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-[#1e293b]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e81b0]/20 rounded-bl-full pointer-events-none" />
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/bookings" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                <span className="text-sm font-bold">New Booking</span>
                <ArrowUpRight size={18} className="text-[#1e81b0] group-hover:translate-x-1 group-hover:translate-y-[-1px] transition-transform" />
              </Link>
              <button 
                onClick={handleExport}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group"
              >
                <span className="text-sm font-bold">Export Report</span>
                <ArrowUpRight size={18} className="text-[#1e81b0] group-hover:translate-x-1 group-hover:translate-y-[-1px] transition-transform" />
              </button>
              <Link href="/admin/rooms" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                <span className="text-sm font-bold">Manage Rooms</span>
                <ArrowUpRight size={18} className="text-[#1e81b0] group-hover:translate-x-1 group-hover:translate-y-[-1px] transition-transform" />
              </Link>
            </div>
          </div>



          <div className="bg-[#f59e0b] rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-[#f59e0b]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full pointer-events-none" />
            <h3 className="text-xl font-black mb-2 italic">Exotica Tip</h3>
            <p className="text-sm font-medium text-white/80 leading-relaxed">
              Booking occupancy is 15% higher this weekend! Consider running a special dinner menu for guests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
