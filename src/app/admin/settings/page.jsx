"use client";

import { useState } from "react";
import { 
  UserCircle, 
  Settings, 
  Mail, 
  Bell, 
  UserPlus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { initialUsers } from "@/lib/mocks/users";

export default function SettingsPage() {
  const [userList, setUserList] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isToggling, setIsToggling] = useState(null); // 'email' or 'maintenance'
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTogglePreference = (type) => {
    setIsToggling(type);
    setTimeout(() => {
      if (type === 'email') setEmailAlerts(prev => !prev);
      if (type === 'maintenance') setMaintenanceMode(prev => !prev);
      setIsToggling(null);
      showNotification(`Preference updated successfully`);
    }, 800);
  };

  const handleDeleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUserList(prev => prev.filter(u => u.id !== id));
      showNotification("User deleted");
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      status: "Active"
    };

    if (editingUser) {
      setUserList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      showNotification("User updated");
    } else {
      setUserList(prev => [...prev, { ...userData, id: Date.now() }]);
      showNotification("User created");
    }
    
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* User Management Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#1e293b]">User Management</h3>
            <Button 
              onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
              className="bg-[#1e81b0] text-white py-2 px-6 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#1e81b0]/20"
            >
              <UserPlus size={16} /> New User
            </Button>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
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
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800 leading-none mb-1">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{user.role}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        user.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
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
          </div>
        </div>
        {/* Global Settings Sidebar */}
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
                <Input name="name" label="Full Name" defaultValue={editingUser?.name} placeholder="e.g. John Doe" required />
                <Input name="email" label="Email Address" defaultValue={editingUser?.email} type="email" placeholder="john@exotica.com" required />
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500 font-semibold px-2">Role</label>
                  <select name="role" defaultValue={editingUser?.role || "Staff"} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent transition-colors shadow-sm">
                    <option value="Super Admin">Super Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-4">
                  <Button type="submit" className="flex-1 bg-[#1e81b0] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1e81b0]/20">
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

