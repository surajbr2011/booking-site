import { useFormContext } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";
import { rooms } from "@/lib/rooms";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepSelection({ selectedRoomId }) {
  const { register, setValue, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DatePicker label="Check In" {...register("checkIn")} error={errors.checkIn?.message} />
        <DatePicker label="Check Out" {...register("checkOut")} error={errors.checkOut?.message} />
      </div>

      <div>
        <label className="text-sm text-gray-500 font-semibold px-2 mb-4 block underline decoration-[#1e81b0]/30 decoration-2 underline-offset-4">Select Your Room</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div 
              key={room.id}
              onClick={() => setValue("roomId", room.id)}
              className={cn(
                "relative p-4 rounded-3xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden",
                selectedRoomId == room.id ? "border-[#1e81b0] bg-blue-50/30" : "border-gray-100 hover:border-[#1e81b0]/30"
              )}
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <img src={room.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={room.title} />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-gray-800 text-[15px]">{room.title}</h4>
                  <p className="text-[#1e81b0] font-black text-lg">₹{room.price}/- <span className="text-[10px] text-gray-400 font-medium">per night</span></p>
                </div>
              </div>
              {selectedRoomId == room.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#1e81b0] rounded-full flex items-center justify-center text-white shadow-sm">
                  <Check size={14} strokeWidth={4} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full max-w-[200px]">
        <label className="text-sm text-gray-500 font-semibold px-2">Guests</label>
        <select 
          {...register("guests")}
          className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 font-bold text-[#1e293b] focus:ring-2 focus:ring-[#1e81b0] outline-none"
        >
          {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
        </select>
      </div>
    </div>
  );
}
