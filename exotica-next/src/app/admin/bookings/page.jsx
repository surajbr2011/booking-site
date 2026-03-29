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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/apiClient";

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 20 });

  const fetchBookings = async (page = currentPage) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter !== 'All') params.set('status', statusFilter.toLowerCase());
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      const res = await api.getAdminBookings(params.toString());
      setBookings(res.bookings || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(1); setCurrentPage(1); }, [statusFilter]);
  useEffect(() => { fetchBookings(currentPage); }, [currentPage]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.updateAdminBooking(id, { bookingStatus: newStatus.toLowerCase() });
      await fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchString = searchTerm.toLowerCase();
    const guestMatch = booking.guestName?.toLowerCase().includes(searchString);
    const idMatch = booking.bookingReference?.toLowerCase().includes(searchString);
    
    // Convert status to match UI capitalization mapping
    const bStatus = booking.bookingStatus || 'pending';
    const statusFormatted = bStatus.charAt(0).toUpperCase() + bStatus.slice(1);
    
    const matchesStatus = statusFilter === "All" || statusFormatted === statusFilter;
    return (guestMatch || idMatch) && matchesStatus;
  });

  const handleDownload = () => {
    const headers = ["Booking ID", "Guest", "Email", "Room", "Check-In", "Check-Out", "Status", "Amount"];
    const rows = bookings.map(b => [
      b.bookingReference,
      `"${b.guestName}"`,
      `"${b.guestEmail}"`,
      `"${b.room?.roomName}"`,
      `"${new Date(b.checkInDate).toLocaleDateString()}"`,
      `"${new Date(b.checkOutDate).toLocaleDateString()}"`,
      `"${b.bookingStatus}"`,
      `"${b.totalAmount}"`
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
        
        <div className="flex items-center gap-3">
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
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
              ) : filteredBookings.map((booking) => {
                const statusFormatted = booking.bookingStatus ? booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1) : 'Pending';

                return (
                <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-black text-[#1e81b0] text-sm">{booking.bookingReference}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1e81b0] font-black text-xs">
                        {booking.guestName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm leading-none mb-1">{booking.guestName}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{booking.guestEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" /> {new Date(booking.checkInDate).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">to {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                      statusFormatted === "Confirmed" ? "bg-green-50 text-green-600 border border-green-100" : 
                      statusFormatted === "Pending" ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-red-50 text-red-600 border border-red-100"
                    )}>
                      {statusFormatted === "Confirmed" && <CheckCircle2 size={10} />}
                      {statusFormatted === "Pending" && <Clock size={10} />}
                      {statusFormatted === "Cancelled" && <XCircle size={10} />}
                      {statusFormatted}
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
              )})}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold">
            Showing {bookings.length} of {pagination.total} bookings · Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-40"
            ><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              return (
                <button key={pg} onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                    currentPage === pg ? 'bg-[#1e81b0] text-white shadow-lg shadow-[#1e81b0]/20' : 'text-gray-400 hover:bg-gray-100'
                  }`}>{pg}</button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage >= pagination.totalPages}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-40"
            ><ChevronRight size={16} /></button>
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
                  <p className="text-xs text-[#1e81b0] font-black uppercase tracking-widest mt-1">ID: {selectedBooking.bookingReference}</p>
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
                        <p className="font-black text-gray-800 text-sm">{selectedBooking.guestName}</p>
                        <p className="text-xs text-gray-500 font-medium">{selectedBooking.guestEmail}</p>
                        <p className="text-xs text-gray-500 font-medium">{selectedBooking.guestPhone || 'No Phone'}</p>
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
                        <p className="font-black text-gray-800 text-sm">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 font-medium">to {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-100">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200/50 mb-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Selected Room</span>
                    <span className="text-sm font-black text-[#1e293b]">{selectedBooking.room?.roomName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
                    <span className="text-xl font-black text-[#1e81b0]">₹{selectedBooking.totalAmount}</span>
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

