"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal, 
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarRange
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAllBookings, updateBookingStatus } from "@/lib/bookings";
import { isWithinInterval, startOfDay, endOfDay, parse } from "date-fns";

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    setBookings(getAllBookings());
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
    
    let matchesDate = true;
    if (startDate || endDate) {
      // Assuming booking.checkIn is in format like "2026-03-24" or similar
      const checkInDate = new Date(booking.checkIn);
      const start = startDate ? startOfDay(new Date(startDate)) : null;
      const end = endDate ? endOfDay(new Date(endDate)) : null;
      
      if (start && end) {
        matchesDate = isWithinInterval(checkInDate, { start, end });
      } else if (start) {
        matchesDate = checkInDate >= start;
      } else if (end) {
        matchesDate = checkInDate <= end;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDownload = () => {
    const headers = ["Booking ID", "Guest", "Email", "Room", "Check-In", "Check-Out", "Status", "Amount"];
    const rows = bookings.map(b => [
      b.id,
      `"${b.guest}"`,
      `"${b.email}"`,
      `"${b.room}"`,
      `"${b.checkIn}"`,
      `"${b.checkOut}"`,
      `"${b.status}"`,
      `"${b.amount}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `exotica_bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by guest name or ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 focus:border-[#1e81b0] transition-all font-medium text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm items-center gap-2">
            <div className="flex items-center gap-2 px-3 border-r border-gray-100">
              <CalendarRange size={14} className="text-gray-400" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[11px] font-bold text-gray-600 bg-transparent focus:outline-none"
              />
              <span className="text-gray-300">to</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[11px] font-bold text-gray-600 bg-transparent focus:outline-none"
              />
              {(startDate || endDate) && (
                <button 
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="p-1 hover:bg-gray-100 rounded-md text-gray-400"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all",
                  statusFilter === status 
                    ? "bg-[#1e81b0] text-white shadow-md shadow-[#1e81b0]/20" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <button 
            onClick={handleDownload}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#1e81b0] transition-all shadow-sm"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Booking ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Guest</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Dates</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-black text-[#1e81b0] text-sm">{booking.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1e81b0] font-black text-xs">
                        {booking.guest.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm leading-none mb-1">{booking.guest}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{booking.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" /> {booking.checkIn}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">to {booking.checkOut}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                      booking.status === "Confirmed" ? "bg-green-50 text-green-600 border border-green-100" : 
                      booking.status === "Pending" ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-red-50 text-red-600 border border-red-100"
                    )}>
                      {booking.status === "Confirmed" && <CheckCircle2 size={10} />}
                      {booking.status === "Pending" && <Clock size={10} />}
                      {booking.status === "Cancelled" && <XCircle size={10} />}
                      {booking.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-400 hover:text-[#1e81b0] hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold">Showing {filteredBookings.length} of {bookings.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronLeft size={16} /></button>
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e81b0] text-white text-xs font-black shadow-lg shadow-[#1e81b0]/20">1</span>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-black text-[#1e293b]">Booking Details</h3>
                  <p className="text-xs text-[#1e81b0] font-black uppercase tracking-widest mt-1">ID: {selectedBooking.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 transition-all shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1e81b0]/10 flex items-center justify-center text-[#1e81b0]">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Guest Info</p>
                        <p className="font-black text-gray-800 text-sm">{selectedBooking.guest}</p>
                        <p className="text-xs text-gray-500 font-medium">{selectedBooking.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stay Duration</p>
                        <p className="font-black text-gray-800 text-sm">{selectedBooking.checkIn}</p>
                        <p className="text-xs text-gray-500 font-medium">to {selectedBooking.checkOut}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-100">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200/50 mb-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Selected Room</span>
                    <span className="text-sm font-black text-[#1e293b]">{selectedBooking.room}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
                    <span className="text-xl font-black text-[#1e81b0]">₹{selectedBooking.amount}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedBooking.id, "Confirmed")}
                    className="flex-1 bg-[#1e81b0] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1e81b0]/20 hover:shadow-xl transition-all"
                  >
                    Confirm Booking
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedBooking.id, "Cancelled")}
                    className="flex-1 bg-white border border-gray-200 text-red-500 py-4 rounded-2xl font-black text-sm hover:bg-red-50 transition-all"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

