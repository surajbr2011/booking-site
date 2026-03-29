"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, MessageSquare, CheckCircle2, Loader2, RefreshCw,
  X, ChevronLeft, ChevronRight, Trash2, Edit2, CheckSquare,
  Square, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/apiClient";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminInquiries();
      setEnquiries(res?.data || []);
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
      showToast("Failed to load enquiries", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const filtered = enquiries.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.message?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || e.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  // ── Selection ─────────────────────────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const allSelected = filtered.length > 0 && filtered.every(e => selectedIds.has(e.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(e => e.id)));
  };

  // ── Delete (single) ───────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this enquiry?")) return;
    try {
      await api.deleteAdminInquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      showToast("Enquiry deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete enquiry", "error");
    }
  };

  // ── Bulk delete (selected or all) ─────────────────────────────────────
  const handleBulkDelete = async (deleteAll = false) => {
    const count = deleteAll ? enquiries.length : selectedIds.size;
    if (!confirm(`Permanently delete ${deleteAll ? "ALL" : count} enquiry${count !== 1 ? "ies" : ""}?`)) return;
    try {
      const ids = deleteAll ? [] : [...selectedIds];
      await api.bulkDeleteInquiries(ids);
      await fetchEnquiries();
      showToast(`${count} enquiry${count !== 1 ? "ies" : ""} deleted`);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete enquiries", "error");
    }
  };

  // ── Reply ─────────────────────────────────────────────────────────────
  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setIsSaving(true);
    try {
      await api.updateAdminInquiry(selected.id, { status: "replied", replyMessage: replyText.trim() });
      await fetchEnquiries();
      setSelected(null);
      setReplyText("");
      showToast("Reply sent successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to send reply", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkClosed = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      await api.updateAdminInquiry(selected.id, { status: "closed" });
      await fetchEnquiries();
      setSelected(null);
      showToast("Enquiry marked as closed");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Edit status ───────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editing) return;
    setIsSaving(true);
    try {
      await api.updateAdminInquiry(editing.id, { status: editStatus });
      await fetchEnquiries();
      setEditing(null);
      showToast("Status updated successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const statusColor = (s) => ({
    replied: "bg-green-50 text-green-600 border-green-100",
    new:     "bg-orange-50 text-orange-600 border-orange-100",
    closed:  "bg-gray-100 text-gray-500 border-gray-200",
  }[s] ?? "bg-gray-100 text-gray-500 border-gray-200");

  return (
    <div className="space-y-6">

      {/* ── Top Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input type="text" placeholder="Search name, email or message..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 focus:border-[#1e81b0] text-sm shadow-sm"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            {["All", "New", "Replied", "Closed"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all",
                  statusFilter === s ? "bg-[#1e81b0] text-white shadow-md" : "text-gray-400 hover:text-gray-600")}>
                {s}
              </button>
            ))}
          </div>
          {/* Bulk delete selected */}
          {selectedIds.size > 0 && (
            <button onClick={() => handleBulkDelete(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
              <Trash2 size={14} /> Delete Selected ({selectedIds.size})
            </button>
          )}
          {/* Delete ALL */}
          {enquiries.length > 0 && (
            <button onClick={() => handleBulkDelete(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-500 text-xs font-black rounded-2xl hover:bg-red-50 transition-all">
              <AlertTriangle size={14} /> Delete All
            </button>
          )}
          {/* Refresh */}
          <button onClick={fetchEnquiries}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#1e81b0] transition-all shadow-sm">
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/60">
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-[#1e81b0] transition-colors">
                    {allSelected ? <CheckSquare size={16} className="text-[#1e81b0]" /> : <Square size={16} />}
                  </button>
                </th>
                {["Guest", "Message", "Date", "Status", "Actions"].map((h, i) => (
                  <th key={h} className={cn("px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50", i === 4 && "text-right")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-16"><Loader2 size={28} className="animate-spin text-[#1e81b0] mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-16 text-gray-400 font-bold text-sm">No enquiries found.</td></tr>
              ) : filtered.map(enq => (
                <tr key={enq.id} className={cn("hover:bg-gray-50/40 transition-colors", selectedIds.has(enq.id) && "bg-blue-50/30")}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(enq.id)} className="text-gray-400 hover:text-[#1e81b0] transition-colors">
                      {selectedIds.has(enq.id) ? <CheckSquare size={16} className="text-[#1e81b0]" /> : <Square size={16} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#1e81b0] font-black text-sm">
                        {(enq.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm leading-none mb-0.5">{enq.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{enq.email || enq.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-600 font-medium line-clamp-2">{enq.message}</p>
                    {enq.replyMessage && <p className="text-[10px] text-green-600 font-bold mt-0.5">✓ Replied</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-400 font-bold whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", statusColor(enq.status))}>
                      {enq.status || "new"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelected(enq); setReplyText(enq.replyMessage || ""); }}
                        title="Reply / View" className="p-2 text-gray-400 hover:text-[#1e81b0] hover:bg-blue-50 rounded-xl transition-all">
                        <MessageSquare size={16} />
                      </button>
                      <button onClick={() => { setEditing(enq); setEditStatus(enq.status || "new"); }}
                        title="Edit Status" className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(enq.id)}
                        title="Delete" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold">
            {selectedIds.size > 0 ? `${selectedIds.size} selected · ` : ""}
            Showing {filtered.length} of {enquiries.length} enquiries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronLeft size={15} /></button>
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1e81b0] text-white text-xs font-black">1</span>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>

      {/* ── Reply / View Modal ── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-white rounded-[36px] shadow-2xl overflow-hidden">
              <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-black text-[#1e293b]">Enquiry Details</h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">{selected.name} · {selected.email || selected.phone}</p>
                </div>
                <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center text-gray-400 transition-all shadow-sm">
                  <X size={17} />
                </button>
              </div>
              <div className="p-7 space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Guest Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
                </div>
                {selected.replyMessage && (
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1.5">Previous Reply</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selected.replyMessage}</p>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Send Reply</label>
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4}
                    placeholder="Type your reply..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 focus:border-[#1e81b0] resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleReply} disabled={isSaving || !replyText.trim()}
                    className="flex-1 bg-[#1e81b0] text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#1e81b0]/20">
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                    Send Reply
                  </button>
                  <button onClick={handleMarkClosed} disabled={isSaving}
                    className="flex-1 bg-white border border-gray-200 text-gray-500 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all disabled:opacity-50">
                    Mark Closed
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Status Modal ── */}
      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditing(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-sm bg-white rounded-[36px] shadow-2xl overflow-hidden">
              <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-black text-[#1e293b]">Edit Status</h3>
                <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center text-gray-400 shadow-sm">
                  <X size={17} />
                </button>
              </div>
              <div className="p-7 space-y-5">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs font-black text-gray-400 mb-0.5">From</p>
                  <p className="font-bold text-gray-800 text-sm">{editing.name}</p>
                  <p className="text-xs text-gray-400">{editing.email || editing.phone}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 focus:border-[#1e81b0]">
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveEdit} disabled={isSaving}
                    className="flex-1 bg-[#1e81b0] text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#1e81b0]/20">
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                    Save Changes
                  </button>
                  <button onClick={() => setEditing(null)}
                    className="flex-1 bg-white border border-gray-200 text-gray-500 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl shadow-2xl text-sm font-black flex items-center gap-2",
              toast.type === "error" ? "bg-red-500 text-white" : "bg-[#1e293b] text-white"
            )}>
            {toast.type === "error" ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} className="text-green-400" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
