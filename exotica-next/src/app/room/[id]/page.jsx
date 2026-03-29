"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RoomGallery from "@/components/room/RoomGallery";
import { Wifi, Users, Maximize, Coffee, Wind, ShieldCheck, ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/apiClient";

const typeColors = {
  Chill: { bg: "rgba(224,240,255,0.15)", text: "#7dd3fc", border: "rgba(125,211,252,0.4)" },
  Relax: { bg: "rgba(255,224,240,0.15)", text: "#f9a8d4", border: "rgba(249,168,212,0.4)" },
  Default: { bg: "rgba(232,245,233,0.15)", text: "#86efac", border: "rgba(134,239,172,0.4)" },
};

export default function RoomDetailPage({ params }) {
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getRoom(params.id)
      .then(res => {
        const r = res?.data || res;
        setRoom({
          id: r.id,
          title: r.roomName,
          type: r.roomType || 'Default',
          category: r.category || 'Luxury',
          price: Number(r.basePrice),
          img: r.images?.[0] || 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80',
          desc: r.description,
          images: r.images?.length > 1 ? r.images : [
            r.images?.[0] || 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80',
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80"
          ]
        });
      })
      .catch(err => console.error("Failed to fetch room details:", err))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) return <div className="py-20 text-center">Loading room details...</div>;
  if (!room) return <div className="py-20 text-center">Room not found</div>;

  const typeStyle = typeColors[room.type] || typeColors.Default;

  const galleryImages = room.images;

  const amenities = [
    { icon: <Wifi size={20} />, label: "Free Wi-Fi" },
    { icon: <Users size={20} />, label: "2 Adults" },
    { icon: <Maximize size={20} />, label: "25 m²" },
    { icon: <Wind size={20} />, label: "Air Conditioning" },
    { icon: <Coffee size={20} />, label: "Coffee Maker" },
    { icon: <ShieldCheck size={20} />, label: "Safe Box" },
  ];

  return (
    <main className="bg-[#f8fafc] min-h-screen">

      {/* ── Cinematic Room Hero ── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={room.img}
          alt={room.title}
          fill
          priority
          className="object-cover scale-[1.02]"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

        {/* Back button */}
        <button
          onClick={() => router.push("/room")}
          className="absolute top-24 left-6 md:left-10 z-10 flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all"
        >
          <ArrowLeft size={16} />
          All Rooms
        </button>

        {/* Room title overlay at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 pb-10 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border backdrop-blur-sm"
                style={{ backgroundColor: typeStyle.bg, color: typeStyle.text, borderColor: typeStyle.border }}
              >
                {room.type}
              </span>
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                {room.category}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {room.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Gallery + Description */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <RoomGallery images={galleryImages} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#1e293b] mb-4">About this Room</h2>
              <p className="text-gray-500 leading-relaxed text-base mb-10">
                {room.desc} Experience the epitome of coastal luxury in our {room.title}.
                Thoughtfully designed to provide a serene atmosphere, each room features premium
                linens, artisanal furniture, and large windows that invite the gentle Agonda
                breeze. Whether you&apos;re watching the sunset or listening to the tropical
                chorus at dawn, your stay promises unmatched tranquility.
              </p>

              <h3 className="text-lg font-bold text-[#1e293b] mb-6">Room Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-600 group">
                    <div className="w-11 h-11 flex items-center justify-center bg-[#f0f7ff] rounded-2xl group-hover:bg-[#1e81b0] group-hover:text-white transition-colors duration-300 text-[#1e81b0]">
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1 lg:self-start lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100"
            >
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Starting From</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-[#1e293b]">₹{room.price}</span>
                <span className="text-gray-400 font-medium">/ night</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">4.9 · 48 reviews</span>
              </div>

              {/* Quick info tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["2 Guests", "Free WiFi", "AC", "25 m²"].map((tag) => (
                  <span key={tag} className="text-xs font-semibold text-[#1e81b0] bg-[#e0f0ff] px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/contact?room=${encodeURIComponent(room.title)}&type=book`)}
                  className="w-full bg-[#1e81b0] hover:bg-[#15648a] text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] text-sm"
                >
                  Book Now
                </button>
                <button
                  onClick={() => router.push(`/contact?room=${encodeURIComponent(room.title)}&type=inquire`)}
                  className="w-full bg-white border-2 border-gray-100 hover:border-[#1e81b0] hover:text-[#1e81b0] text-gray-500 py-4 rounded-2xl font-bold transition-all text-sm"
                >
                  Inquire Now
                </button>
              </div>

              <p className="text-xs text-gray-400 italic text-center mt-6">
                &quot;Perfect for a romantic getaway or a peaceful solo retreat.&quot;
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
