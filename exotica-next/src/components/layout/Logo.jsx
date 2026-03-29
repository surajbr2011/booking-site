import { Palmtree } from "lucide-react";

export function Logo() {
  return (
    <div className="w-[72px] h-[72px] bg-white rounded-[18px] flex items-center justify-center shadow-lg relative overflow-hidden shrink-0 border border-white">
      {/* Orange Circle */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-[45%] w-[68px] h-[68px] bg-[#f9a01b] rounded-full z-0" />
      
      {/* Palm Tree */}
      <Palmtree className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[38px] h-[38px] text-[#228b22] z-10 drop-shadow-md" strokeWidth={1.5} />
      
      {/* Small Birds */}
      <div className="absolute top-[16px] right-[24px] z-10 flex gap-[2px]">
         <span className="text-[#2b8a3e] text-[9px] leading-none select-none -rotate-12 italic">v</span>
         <span className="text-[#2b8a3e] text-[9px] leading-none select-none -translate-y-[3px] italic">v</span>
      </div>

      {/* Typography */}
      <div className="absolute right-[3px] top-1/2 -translate-y-[42%] z-20 flex flex-col items-center leading-[0.85]">
        <span className="font-serif text-[11px] text-[#065f46] italic font-bold tracking-tighter mix-blend-color-burn">The</span>
        <span className="font-serif text-[14px] text-[#065f46] italic font-black mt-[-1px] mix-blend-color-burn tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">Exotica</span>
        <span className="font-sans text-[7px] text-[#1e40af] font-black uppercase tracking-widest mt-[2px] mix-blend-color-burn shadow-white drop-shadow-sm">Resort</span>
      </div>
    </div>
  );
}
