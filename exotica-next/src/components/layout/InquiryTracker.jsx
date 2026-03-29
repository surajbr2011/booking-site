"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, CheckCircle, X, Search, Loader2, ChevronRight } from "lucide-react";
import { api } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";

export function InquiryTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());

  const loadAndCheck = async () => {
    const stored = JSON.parse(localStorage.getItem('exotica_inquiries') || '[]');
    if (stored.length === 0) {
        setInquiries([]);
        return;
    }

    setIsLoading(true);
    try {
      const res = await api.checkEnquiries(stored);
      setInquiries(res.data || []);
      setLastCheck(Date.now());
    } catch (err) {
      console.error("Failed to sync inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAndCheck();
    }
  }, [isOpen]);

  // Periodic check if open
  useEffect(() => {
    let interval;
    if (isOpen) {
      interval = setInterval(loadAndCheck, 30000); // Check every 30s when open
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Determine if there's any active inquiry
  const hasInquiries = inquiries.length > 0;
  const unreadCount = inquiries.filter(i => i.status === 'replied').length;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1e81b0] p-6 text-white">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-black text-lg">Inquiry Tracker</h3>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Your Message History</p>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
              {isLoading && inquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="animate-spin mb-3" size={32} />
                  <p className="text-sm font-bold">Syncing Status...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-300" size={24} />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">No Active Inquiries</h4>
                  <p className="text-xs text-gray-400 font-medium">Send us a message from the contact page to track it here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id} 
                      className={`p-4 rounded-2xl border transition-all ${inq.status === 'replied' ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/30 border-gray-100'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                          inq.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                          inq.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {inq.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">{inq.message}</p>
                      
                      {inq.replyMessage ? (
                         <div className="mt-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-[11px] font-black text-[#1e81b0] uppercase mb-1 flex items-center gap-1">
                               <CheckCircle size={10} /> Our Response
                            </p>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed italic">&quot;{inq.replyMessage}&quot;</p>
                         </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-2">
                          <Clock size={12} /> Waiting for team response...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
               <button 
                 onClick={() => window.location.href = '/contact'}
                 className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black text-gray-500 hover:text-[#1e81b0] hover:border-[#1e81b0] transition-all group"
                >
                  New Inquiry <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          unreadCount > 0 ? 'bg-blue-600 animate-bounce' : 'bg-[#1e81b0]'
        } text-white relative`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
