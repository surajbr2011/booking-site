"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Settings,
  Lock,
  Bell,
  UserPlus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Preferences State (UI-only toggles — can be wired to backend later)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isHealthRefreshing, setIsHealthRefreshing] = useState(false);
  const [isToggling, setIsToggling] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = () => {
    setIsLoading(true);
    api.getAdminUsers()
      .then(res => {
        const list = res?.data || res || [];
        setUserList(list);
      })
      .catch(err => console.error('Failed to fetch users:', err))
      .finally(() => setIsLoading(false));
  };

  // Load maintenance state from API on mount
  useEffect(() => {
    fetch('/api/admin/maintenance')
      .then(res => res.json())
      .then(data => setMaintenanceMode(data.maintenanceMode || false))
      .catch(() => {});
  }, []);

  const handleTogglePreference = async (type) => {
    setIsToggling(type);
    try {
      if (type === 'email') {
        setEmailAlerts(prev => !prev);
        showNotification('Email alerts preference updated');
      }
      if (type === 'maintenance') {
        const res = await fetch('/api/admin/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maintenanceMode: !maintenanceMode }),
        });
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
        showNotification(data.maintenanceMode ? '🔒 Maintenance mode is ON — site shows maintenance page to guests' : '✅ Maintenance mode is OFF — site is live');
      }
    } catch (err) {
      showNotification('Failed to update preference');
    } finally {
      setIsToggling(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await api.deleteAdminUser(id);
      setUserList(prev => prev.filter(u => u.id !== id));
      showNotification("User deactivated");
    } catch (err) {
      console.error('Failed to delete user:', err);
      showNotification("Failed to delete user");
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target);
    const password = formData.get("password");
    
    // Pattern: 8+ chars, 1 uppercase, 1 lowercase, 1 number
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if ((!editingUser || changePassword) && password && !passwordPattern.test(password)) {
      showNotification("❌ Password must be 8+ characters with uppercase, lowercase, and numeric characters.");
      setIsSaving(false);
      return;
    }

    const userData = {
      fullName: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: (editingUser ? (changePassword ? password : undefined) : password),
    };

    try {
      if (editingUser) {
        const updated = await api.updateAdminUser(editingUser.id, userData);
        setUserList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
        showNotification("User updated");
      } else {
        const created = await api.createAdminUser(userData);
        setUserList(prev => [...prev, created]);
        showNotification("User created");
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to save user:', err);
      showNotification(err.message || "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* User Management Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[#1e293b]">User Management</h3>
              <p className="text-xs text-gray-400 mt-1">
                {isLoading ? 'Loading...' : `${userList.length} admin users`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchUsers} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 shadow-sm">
                <RefreshCw size={14} />
              </button>
              <Button
                onClick={() => { setEditingUser(null); setIsModalOpen(true); setShowPassword(false); setChangePassword(false); }}
                className="bg-[#1e81b0] text-white py-2 px-6 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#1e81b0]/20"
              >
                <UserPlus size={16} /> New User
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 size={28} className="animate-spin text-[#1e81b0]" />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {userList.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/20 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1e81b0] font-black text-xs">
                            {(user.fullName || user.name || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800 leading-none mb-1">{user.fullName || user.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{user.role}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          user.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditingUser(user); setIsModalOpen(true); setShowPassword(false); setChangePassword(false); }}
                            className="p-2 text-gray-300 hover:text-[#1e81b0] transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Settings Sidebar — Preferences */}
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <h3 className="text-lg font-black text-[#1e293b] mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="text-gray-400" size={18} />
                  <span className="text-sm font-medium text-gray-700">Email Alerts</span>
                </div>
                <button
                  onClick={() => handleTogglePreference('email')}
                  disabled={isToggling === 'email'}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    emailAlerts ? "bg-[#1e81b0]" : "bg-gray-200",
                    isToggling === 'email' && "opacity-50"
                  )}
                >
                  {isToggling === 'email' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={12} className="text-white animate-spin" />
                    </div>
                  ) : (
                    <motion.div
                      animate={{ x: emailAlerts ? 28 : 4 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="text-gray-400" size={18} />
                  <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                </div>
                <button
                  onClick={() => handleTogglePreference('maintenance')}
                  disabled={isToggling === 'maintenance'}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors",
                    maintenanceMode ? "bg-orange-500" : "bg-gray-200",
                    isToggling === 'maintenance' && "opacity-50"
                  )}
                >
                  {isToggling === 'maintenance' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={12} className="text-white animate-spin" />
                    </div>
                  ) : (
                    <motion.div
                      animate={{ x: maintenanceMode ? 28 : 4 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xl font-black text-[#1e293b]">{editingUser ? "Edit User" : "Add New User"}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 transition-all shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-8 space-y-6">
                <div>
                  <label className="text-sm text-gray-500 font-semibold px-2 mb-2 block">Full Name</label>
                  <Input name="name" defaultValue={editingUser?.fullName || editingUser?.name} placeholder="e.g. John Doe" required />
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 font-semibold px-2 mb-2 block">Email Address</label>
                  <Input name="email" defaultValue={editingUser?.email} type="email" placeholder="john@exotica.com" required />
                </div>

                {editingUser && (
                  <div className="flex items-center gap-3 px-2 py-2 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <input 
                      type="checkbox" 
                      id="changePwd" 
                      className="w-4 h-4 text-[#1e81b0] rounded border-gray-300 focus:ring-[#1e81b0]"
                      checked={changePassword}
                      onChange={(e) => setChangePassword(e.target.checked)}
                    />
                    <label htmlFor="changePwd" className="text-xs font-black text-[#1e81b0] uppercase tracking-widest cursor-pointer select-none">
                      Change Password
                    </label>
                  </div>
                )}

                {(!editingUser || changePassword) && (
                  <div>
                    <label className="text-sm text-gray-500 font-semibold px-2 mb-2 block">
                      {editingUser ? "New Password" : "Password"}
                    </label>
                    <div className="relative group">
                      <Input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder={editingUser ? "Enter new password" : "Initial password"} 
                        required 
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#1e81b0] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 px-2 font-medium">
                      Min 8 chars, including uppercase, lowercase, and numbers.
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500 font-semibold px-2">Role</label>
                  <select name="role" defaultValue={editingUser?.role || "staff"} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent transition-colors shadow-sm">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-4">
                  <Button type="submit" disabled={isSaving} className="flex-1 bg-[#1e81b0] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1e81b0]/20 flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                    {editingUser ? "Update User" : "Create User"}
                  </Button>
                  <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl font-black text-sm">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-[#1e293b] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 size={14} />
            </div>
            <span className="text-xs font-black">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
