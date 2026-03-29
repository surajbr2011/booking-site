"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  RefreshCw,
  Upload,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CATEGORIES = ["Rooms", "Interior", "Nature", "Beach", "Exterior"];

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const fetchGallery = () => {
    setIsLoading(true);
    // Passing activeCategory to filter by backend if needed, or filter locally
    api.getAdminGallery(activeCategory === "All" ? null : activeCategory)
      .then(res => {
        setImages(res?.data || res || []);
      })
      .catch(err => console.error("Failed to fetch gallery:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, [activeCategory]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'exotica-hotel/gallery');
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
      let imageUrl = formData.get("imageUrl") || editingImage?.imageUrl || '';

      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadToCloudinary(imageFile);
        setIsUploading(false);
      }

      if (!imageUrl) throw new Error("Image is required");

      const imageData = {
        title: formData.get("title"),
        category: formData.get("category"),
        imageUrl,
        displayOrder: parseInt(formData.get("displayOrder") || "0"),
        isActive: true
      };

      if (editingImage) {
        await api.updateAdminGalleryImage(editingImage.id, imageData);
      } else {
        await api.createAdminGalleryImage(imageData);
      }
      
      setIsModalOpen(false);
      setEditingImage(null);
      setImageFile(null);
      setImagePreview("");
      fetchGallery();
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.deleteAdminGalleryImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b]">Gallery Management</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Manage your resort categories & photos
          </p>
        </div>
        <Button
          onClick={() => { setEditingImage(null); setIsModalOpen(true); setImageFile(null); setImagePreview(""); }}
          className="bg-[#1e81b0] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1e81b0]/20 gap-2"
        >
          <Plus size={16} strokeWidth={3} /> Add Photo
        </Button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {["All", ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              activeCategory === cat 
                ? "bg-[#1e81b0] text-white border-[#1e81b0] shadow-md shadow-[#1e81b0]/10" 
                : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={32} className="animate-spin text-[#1e81b0]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 group shadow-sm"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={img.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => { setEditingImage(img); setIsModalOpen(true); setImagePreview(img.imageUrl); }} className="p-2.5 bg-white text-[#1e81b0] rounded-xl hover:scale-110 transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(img.id)} className="p-2.5 bg-white text-red-500 rounded-xl hover:scale-110 transition-all"><Trash2 size={16} /></button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[9px] font-black text-[#1e81b0] uppercase tracking-widest border border-white/50">
                    {img.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-black text-gray-800 line-clamp-1">{img.title || "Untitled Image"}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Order: {img.displayOrder}</p>
              </div>
            </motion.div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
              No images found in this category
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">{editingImage ? "Edit Gallery Photo" : "Add Gallery Photo"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Photo Category</label>
                  <select name="category" defaultValue={editingImage?.category || "Rooms"} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e81b0]/20 transition-all">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                  <Input name="title" placeholder="e.g. Sunset at Agonda" defaultValue={editingImage?.title} required />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Upload Image</label>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="relative h-32 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-all overflow-hidden group"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-300 mb-2 group-hover:text-[#1e81b0]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to upload</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImagePick} />
                  <Input name="imageUrl" placeholder="Or paste image URL..." defaultValue={editingImage?.imageUrl} className="mt-2" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Order</label>
                  <Input name="displayOrder" type="number" placeholder="0" defaultValue={editingImage?.displayOrder || 0} />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSaving || isUploading} className="w-full bg-[#1e81b0] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1e81b0]/20 gap-2">
                    {(isSaving || isUploading) ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isUploading ? "Uploading..." : editingImage ? "Update Photo" : "Add to Gallery"}
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
