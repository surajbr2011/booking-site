"use client";

import { Hero } from "@/components/layout/Hero";
import { TourSection } from "@/components/layout/TourSection";
import { rooms } from "@/lib/rooms";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { RoomSkeleton } from "@/components/ui/Skeleton";
import RoomCard from "@/components/room/RoomCard";
import { LayoutGrid, List, Filter, X } from "lucide-react";
import { PriceRangeSlider } from "@/components/ui/PriceRangeSlider";

export default function RoomPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [priceLimit, setPriceLimit] = useState(6000);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleBook = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  const filteredRooms = rooms
    .filter(room => filterType === "All" || room.type === filterType)
    .filter(room => room.price <= priceLimit);

  // Badge color map
  const typeColors = {
    Chill: { bg: "#e0f0ff", text: "#1e81b0" },
    Relax: { bg: "#ffe0f0", text: "#b0407a" },
    Default: { bg: "#e8f5e9", text: "#2e7d32" },
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen">
      <Hero 
        title="Rooms" 
        backgroundImage="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80"
      />

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filter (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Room Type</h3>
                  <div className="space-y-2">
                    {["All", "Chill", "Relax"].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === type ? 'bg-[#e0f0ff] text-[#1e81b0]' : 'hover:bg-gray-50 text-gray-600'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <PriceRangeSlider 
                    min={3000} 
                    max={6000} 
                    onChange={(val) => setPriceLimit(val)}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h1 className="text-xl font-bold text-[#1e293b]">
                {filteredRooms.length} Rooms Found
              </h1>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilters(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Filter size={20} />
                </button>
                <div className="h-6 w-[1px] bg-gray-200 mx-2 md:hidden"></div>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? 'bg-[#e0f0ff] text-[#1e81b0]' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? 'bg-[#e0f0ff] text-[#1e81b0]' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Room List grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <RoomSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'} gap-6`}>
                <AnimatePresence mode="popLayout">
                  {filteredRooms.map((room, idx) => (
                    <RoomCard key={room.id} room={room} idx={idx} viewMode={viewMode} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[101] p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Room Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["All", "Chill", "Relax"].map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilterType(type);
                          setShowFilters(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === type ? 'bg-[#e0f0ff] text-[#1e81b0]' : 'bg-gray-50 text-gray-600'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-8 mt-2">
                  <PriceRangeSlider 
                    min={3000} 
                    max={6000} 
                    onChange={(val) => setPriceLimit(val)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <TourSection />
    </main>
  );
}
