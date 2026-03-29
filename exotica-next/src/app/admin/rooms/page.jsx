"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Image as ImageIcon,
  Check,
  X,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  RefreshCw,
  Upload,
  Link as LinkIcon,
  ImageMinus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function normalizeRoom(r) {
  return {
    id: r.id,
    title: r.roomName || r.title,
    type: r.roomType || r.type,
    category: r.category,
    price: Number(r.basePrice || r.price),
    img: r.images?.[0] || r.img || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    status: r.isActive === false ? 'Inactive' : (r.status || 'Available'),
    maxOccupancy: r.maxOccupancy || 2,
    description: r.description || r.desc || '',
    amenities: r.amenities || [],
    isActive: r.isActive !== false,
    _raw: r,
  };
}

export default function RoomsManagement() {
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [localRooms, setLocalRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchRooms = () => {
    setIsLoading(true);
    api.getAdminRooms()
      .then(res => {
        const list = res?.data || res || [];
        setLocalRooms(list.map(normalizeRoom));
      })
      .catch(err => console.error('Failed to fetch rooms:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleToggleStatus = async (id) => {
    const room = localRooms.find(r => r.id === id);
    if (!room) return;
    try {
      await api.updateAdminRoom(id, { isActive: !room.isActive });
      setLocalRooms(prev => prev.map(r =>
        r.id === id ? { ...r, isActive: !r.isActive, status: !r.isActive ? 'Available' : 'Inactive' } : r
      ));
    } catch (err) {
      console.error('Failed to toggle room status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to deactivate this room?")) return;
    try {
      await api.updateAdminRoom(id, { isActive: false });
      setLocalRooms(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete room:', err);
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToCloudinary = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'exotica-hotel/rooms');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.target);
      let imageUrl = formData.get("imageUrl") || editingRoom?.img || '';

      // Upload file if one was picked
      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImageToCloudinary(imageFile);
        setIsUploading(false);
      }

      const roomData = {
        roomNumber: formData.get("roomNumber") || `RM-${Math.floor(Math.random() * 9000) + 1000}`,
        roomName: formData.get("title"),
        category: formData.get("category"),
        basePrice: parseFloat(formData.get("price")),
        roomType: formData.get("roomType") || 'Chill',
        maxOccupancy: parseInt(formData.get("maxOccupancy") || '2'),
        description: formData.get("description") || '',
        isActive: formData.get("status") !== "Inactive",
        images: imageUrl ? [imageUrl] : [],
      };

      if (editingRoom) {
        await api.updateAdminRoom(editingRoom.id, roomData);
        setLocalRooms(prev => prev.map(r => r.id === editingRoom.id ? normalizeRoom({ ...r._raw, ...roomData, id: r.id }) : r));
      } else {
        const created = await api.createAdminRoom(roomData);
        setLocalRooms(prev => [normalizeRoom(created), ...prev]);
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('Failed to save room:', err);
      alert('Failed to save room: ' + err.message);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const filteredRooms = localRooms.filter(r =>
    (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b]">Room Inventory</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            {isLoading ? 'Loading...' : `${filteredRooms.length} rooms in database`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 shadow-sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-xl transition-all", viewMode === "grid" ? "bg-[#1e81b0] text-white shadow-md shadow-[#1e81b0]/20" : "text-gray-400")}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-xl transition-all", viewMode === "list" ? "bg-[#1e81b0] text-white shadow-md shadow-[#1e81b0]/20" : "text-gray-400")}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button onClick={fetchRooms} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 shadow-sm">
            <RefreshCw size={16} />
          </button>
          <Button
            onClick={() => { setEditingRoom(null); setIsModalOpen(true); setImageFile(null); setImagePreview(''); }}
            className="bg-[#1e81b0] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1e81b0]/20 gap-2"
          >
            <Plus size={16} strokeWidth={3} /> Add New Room
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={32} className="animate-spin text-[#1e81b0]" />
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[40px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col group"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={room.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={room.title} />
                    <div className="absolute top-6 left-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border",
                        room.isActive ? "bg-green-50/90 text-green-600 border-green-100" : "bg-red-50/90 text-red-600 border-red-100"
                      )}>
                        {room.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => { setEditingRoom(room); setIsModalOpen(true); }} className="p-3 bg-white text-[#1e81b0] rounded-2xl shadow-xl hover:scale-110 transition-all"><Edit2 size={20} /></button>
                      <button onClick={() => handleDelete(room.id)} className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <div className="p-8 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-[#1e81b0] uppercase tracking-widest">{room.category}</span>
                      <span className="text-sm font-black text-gray-800">₹{room.price}/-</span>
                    </div>
                    <h3 className="font-black text-xl text-gray-800 mb-2">{room.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">{room.type} · {room.maxOccupancy} Guests</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(room.id)}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border",
                            room.isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                          )}
                        >
                          {room.isActive ? <Check size={18} /> : <X size={18} />}
                        </button>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toggle Active</span>
                      </div>
                      <button className="text-gray-300 hover:text-[#1e81b0] transition-colors"><Eye size={20} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Info</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                            <img src={room.img} className="w-full h-full object-cover" alt={room.title} />
                          </div>
                          <div>
                            <span className="font-black text-[#1e293b] text-sm">{room.title}</span>
                            <p className="text-[10px] text-gray-400">{room.maxOccupancy} guests</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-500">{room.category}</td>
                      <td className="px-8 py-6 font-black text-gray-800 text-sm">₹{room.price}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          room.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                          {room.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingRoom(room); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-[#1e81b0] hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(room.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
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
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-black text-[#1e293b]">{editingRoom ? "Edit Room" : "Add New Room"}</h3>
                  <p className="text-xs text-[#1e81b0] font-black uppercase tracking-widest mt-1">Room inventory management</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 transition-all shadow-sm">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input name="roomNumber" label="Room Number" defaultValue={editingRoom?._raw?.roomNumber} placeholder="e.g. 101 or C1" required />
                  <Input name="title" label="Room Name" defaultValue={editingRoom?.title} placeholder="e.g. Garden AC Cottage 07" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input name="category" label="Category" defaultValue={editingRoom?.category} placeholder="e.g. Premium / Luxury" required />

                  {/* Image Upload */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500 font-semibold px-2">Room Image</label>
                    <div className="relative">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative h-[80px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center gap-3 px-4 cursor-pointer hover:border-[#1e81b0] hover:bg-blue-50/30 transition-all overflow-hidden group"
                      >
                        {(imagePreview || editingRoom?.img) ? (
                          <img src={imagePreview || editingRoom?.img} alt="preview" className="h-full w-20 object-cover rounded-lg absolute left-0 top-0" />
                        ) : null}
                        <div className={`${(imagePreview || editingRoom?.img) ? 'ml-24' : ''} flex items-center gap-2 text-gray-400`}>
                          <Upload size={16} />
                          <span className="text-xs font-bold">{imageFile ? imageFile.name : (imagePreview || editingRoom?.img ? 'Change image' : 'Upload image')}</span>
                        </div>
                      </div>
                      {(imagePreview || editingRoom?.img) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview("");
                            // We use a query selector to clear the URL input if it's there
                            const urlInput = document.querySelector('input[name="imageUrl"]');
                            if (urlInput) urlInput.value = "";
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                    <input name="imageUrl" type="url" defaultValue={editingRoom?.img} placeholder="Or paste image URL..." className="mt-1 w-full px-3 py-2 h-9 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e81b0] transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input name="price" label="Price per Night (₹)" defaultValue={editingRoom?.price} type="number" placeholder="4500" required />
                  <Input name="maxOccupancy" label="Max Guests" defaultValue={editingRoom?.maxOccupancy || 2} type="number" placeholder="2" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500 font-semibold px-2">Room Type</label>
                    <select name="roomType" defaultValue={editingRoom?.type || "Chill"} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent transition-colors shadow-sm">
                      <option value="Chill">Chill</option>
                      <option value="Relax">Relax</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500 font-semibold px-2">Status</label>
                    <select name="status" defaultValue={editingRoom?.isActive === false ? "Inactive" : "Available"} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent transition-colors shadow-sm">
                      <option value="Available">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500 font-semibold px-2">Description</label>
                  <textarea name="description" defaultValue={editingRoom?.description} placeholder="Room description..." rows={3} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent transition-colors shadow-sm resize-none" />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="submit" disabled={isSaving || isUploading} className="flex-1 bg-[#1e81b0] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1e81b0]/20 flex items-center justify-center gap-2">
                    {(isSaving || isUploading) ? <Loader2 size={18} className="animate-spin" /> : null}
                    {isUploading ? 'Uploading image...' : editingRoom ? 'Update Room' : 'Save Room'}
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
    </div>
  );
}
