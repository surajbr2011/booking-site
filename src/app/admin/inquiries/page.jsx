"use client";

import { useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Trash2, 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const inquiryData = [
  { id: 1, name: "Anita Desai", email: "anita@example.com", phone: "+91 98765 43210", subject: "Group Booking Inquiry", message: "We are looking for 4 cottages for our wedding anniversary next month.", status: "Pending", date: "2026-03-10" },
  { id: 2, name: "David Wilson", email: "david@example.com", phone: "+1 202 555 0192", subject: "Airport Pickup", message: "Do you provide complimentary airport pickup from Dabolim?", status: "Replied", date: "2026-03-09" },
  { id: 3, name: "Suresh Raina", email: "suresh@example.com", phone: "+91 88776 55443", subject: "Cancellation Policy", message: "If I cancel 48 hours before, how much refund will I get?", status: "Pending", date: "2026-03-08" },
  { id: 4, name: "Elena Gilbert", email: "elena@example.com", phone: "+44 20 7946 0958", subject: "Honeymoon Package", message: "Want to book a romantic setup in our garden cottage.", status: "Importance", date: "2026-03-07" },
];

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState(inquiryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useState(() => {
    if (typeof window !== "undefined") {
      const savedInquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
      setInquiries([...savedInquiries, ...inquiryData]);
    }
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    setSelectedInquiry(null);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      setSelectedInquiry(null);
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="max-w-md relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search inquiries..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 focus:border-[#1e81b0] transition-all font-medium text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inquiry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInquiries.map((inquiry) => (
          <motion.div 
            key={inquiry.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden"
          >
            {/* Status Indicator Bar */}
            <div className={cn(
              "absolute top-0 left-0 bottom-0 w-1.5",
              inquiry.status === "Pending" ? "bg-orange-400" : 
              inquiry.status === "Replied" ? "bg-green-400" : "bg-[#1e81b0]"
            )} />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1e81b0] shadow-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 tracking-tight">{inquiry.subject}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{inquiry.date}</p>
                </div>
              </div>
              <button className="text-gray-300 hover:text-gray-500 transition-colors"><MoreVertical size={18} /></button>
            </div>

            <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
              "{inquiry.message}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e81b0]/10 flex items-center justify-center text-[#1e81b0] font-black text-[10px]">
                  {inquiry.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-800 leading-none">{inquiry.name}</p>
                  <p className="text-[9px] text-gray-400 font-bold">{inquiry.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="p-2.5 bg-[#f4f7f9] text-[#1e81b0] rounded-xl hover:bg-[#1e81b0] hover:text-white transition-all shadow-sm"
                >
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(inquiry.id)}
                  className="p-2.5 bg-[#f4f7f9] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xl font-black text-[#1e293b]">Read Inquiry</h3>
                <button onClick={() => setSelectedInquiry(null)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 transition-all shadow-sm">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="bg-[#f8fafc] p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#1e81b0] shadow-sm border border-gray-50">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm leading-none mb-1">{selectedInquiry.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">PHONE</p>
                    <p className="text-xs font-black text-[#1e81b0]">{selectedInquiry.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-800">{selectedInquiry.subject}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium bg-gray-50 p-6 rounded-3xl italic">
                    "{selectedInquiry.message}"
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedInquiry.id, "Replied")}
                    className="flex-1 bg-[#1e81b0] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1e81b0]/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Mark as Replied
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="w-14 items-center justify-center bg-red-50 text-red-500 rounded-2xl flex hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
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

