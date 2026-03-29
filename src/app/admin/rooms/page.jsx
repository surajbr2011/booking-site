"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Check,
  X,
  ToggleLeft as Toggle,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { rooms } from "@/lib/rooms";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RoomsManagement() {
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [localRooms, setLocalRooms] = useState(rooms);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleStatus = (id) => {
    setLocalRooms(prev => prev.map(room => 
      room.id === id ? { ...room, status: room.status === "Available" ? "Occupied" : "Available" } : room
    ));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this room?")) {
      setLocalRooms(prev => prev.filter(room => room.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = {
      title: formData.get("title"),
      category: formData.get("category"),
      price: formData.get("price"),
      status: formData.get("status"),
      img: selectedImage || editingRoom?.img || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    };

    if (editingRoom) {
      setLocalRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...roomData } : r));
    } else {
      setLocalRooms(prev => [...prev, { ...roomData, id: Date.now() }]);
    }
    
    setIsModalOpen(false);
    setEditingRoom(null);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b]">Room Inventory</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your cottage availability and pricing</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button 
            onClick={() => { setEditingRoom(null); setSelectedImage(null); setIsModalOpen(true); }}
            className="bg-[#1e81b0] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1e81b0]/20 gap-2"
          >
            <Plus size={16} strokeWidth={3} /> Add New Room
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {localRooms.map((room) => (
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
                    room.status === "Occupied" ? "bg-red-50/90 text-red-600 border-red-100" : "bg-green-50/90 text-green-600 border-green-100"
                  )}>
                    {room.status || "Available"}
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
                <h3 className="font-black text-xl text-gray-800 mb-4">{room.title}</h3>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleStatus(room.id)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border",
                        room.status === "Occupied" ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                      )}
                    >
                      {room.status === "Occupied" ? <X size={18} /> : <Check size={18} />}
                    </button>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Toggle</span>
                  </div>
                  <button className="text-gray-300 hover:text-[#1e81b0] transition-colors"><Eye size={20} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View Placeholder */}
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
               {localRooms.map((room) => (
                 <tr key={room.id} className="hover:bg-gray-50/30 transition-all group">
                   <td className="px-8 py-6">
                     <div className="flex items-center gap-4">
                       <div className="w-16 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                         <img src={room.img} className="w-full h-full object-cover" />
                       </div>
                       <span className="font-black text-[#1e293b] text-sm">{room.title}</span>
                     </div>
                   </td>
                   <td className="px-8 py-6 text-sm font-bold text-gray-500">{room.category}</td>
                   <td className="px-8 py-6 font-black text-gray-800 text-sm">₹{room.price}</td>
                   <td className="px-8 py-6">
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                       room.status === "Occupied" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                     )}>
                       {room.status || "Available"}
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
                <button 
                   type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 transition-all shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input name="title" label="Room Title" defaultValue={editingRoom?.title} placeholder="e.g. Garden AC Cottage 07" required />
                  <Input name="category" label="Category" defaultValue={editingRoom?.category} placeholder="e.g. Premium / Luxury" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input name="price" label="Price per Night (₹)" defaultValue={editingRoom?.price} type="number" placeholder="4500" required />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500 font-semibold px-2">Initial Status</label>
                    <select name="status" defaultValue={editingRoom?.status || "Available"} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent transition-colors shadow-sm">
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-sm text-gray-500 font-semibold px-2">Room Image</label>
                   <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      id="room-image-upload" 
                      onChange={handleImageChange}
                   />
                   <label 
                      htmlFor="room-image-upload" 
                      className="h-32 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-[#1e81b0] hover:bg-blue-50/50 transition-all cursor-pointer group"
                   >
                      {selectedImage || editingRoom?.img ? (
                        <div className="flex items-center gap-4 p-4 w-full h-full">
                           <div className="w-24 h-full rounded-2xl overflow-hidden shadow-sm">
                              <img src={selectedImage || editingRoom.img} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-[#1e81b0] uppercase tracking-widest">Image Loaded</span>
                              <span className="text-[10px] text-gray-400 font-bold">Click to replace</span>
                           </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon size={32} className="mb-2 group-hover:text-[#1e81b0] transition-colors" />
                          <span className="text-xs font-bold">Click to upload room photo</span>
                        </>
                      )}
                   </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="submit" className="flex-1 bg-[#1e81b0] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-[#1e81b0]/20">
                    {editingRoom ? "Update Room" : "Save Room"}
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

