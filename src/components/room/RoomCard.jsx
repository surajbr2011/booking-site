"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Badge color map
const typeColors = {
  Chill: { bg: "#e0f0ff", text: "#1e81b0" },
  Relax: { bg: "#ffe0f0", text: "#b0407a" },
  Default: { bg: "#e8f5e9", text: "#2e7d32" },
};

export default function RoomCard({ room, idx, viewMode = "grid" }) {
  const router = useRouter();
  const typeStyle = typeColors[room.type] || typeColors.Default;
  const isList = viewMode === "list";

  const handleBook = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex ${isList ? 'flex-row h-48 sm:h-64' : 'flex-col'} group hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => router.push(`/room/${room.id}`)}
    >
      {/* Room Image */}
      <div className={`${isList ? 'w-1/3 sm:w-2/5' : 'w-full'} relative overflow-hidden aspect-video`}>
        <Image
          src={room.img}
          alt={room.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Room Content */}
      <div className={`p-4 sm:p-6 flex flex-col flex-1`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`${isList ? 'text-lg sm:text-xl' : 'text-base'} font-bold text-[#1e293b]`}>{room.title}</h3>
          <span className="text-lg font-semibold text-[#1e81b0]">₹{room.price}/–</span>
        </div>

        {/* Type + Category Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
          >
            {room.type}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {room.category}
          </span>
        </div>

        {isList && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 hidden sm:block">
            {room.desc}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-4 text-xs text-gray-400 font-medium">
            <span>2 Guests</span>
            <span>•</span>
            <span>Free WiFi</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBook(room.id);
            }}
            className="bg-[#1a6e96] hover:bg-[#155d80] text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors whitespace-nowrap"
          >
            View Detail
          </button>
        </div>
      </div>
    </motion.div>
  );
}
