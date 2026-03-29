"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, CreditCard, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { rooms } from "@/lib/rooms";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { RazorpayMock } from "@/components/booking/RazorpayMock";
import { saveBooking } from "@/lib/bookings";

// Modular steps
import { StepSelection } from "./wizard/StepSelection";
import { StepInformation } from "./wizard/StepInformation";
import { StepPayment } from "./wizard/StepPayment";
import { BookingSuccess } from "./wizard/BookingSuccess";

// --- Validation Schemas ---
const step1Schema = yup.object({
  checkIn: yup.date().required("Check-in date is required").min(new Date(new Date().setHours(0,0,0,0)), "Check-in must be today or later"),
  checkOut: yup.date().required("Check-out date is required").min(yup.ref('checkIn'), "Check-out must be after check-in"),
  roomId: yup.number().required("Please select a room"),
  guests: yup.number().min(1, "At least 1 guest").max(4, "Max 4 guests per room").required(),
});

const step2Schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
});

const allStepsSchema = step1Schema.concat(step2Schema);

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  const searchParams = useSearchParams();
  const urlCheckIn = searchParams.get("checkIn");
  const urlCheckOut = searchParams.get("checkOut");
  const urlRoomId = searchParams.get("roomId");

  const methods = useForm({
    resolver: yupResolver(step === 1 ? step1Schema : step === 2 ? step2Schema : allStepsSchema),
    defaultValues: {
      checkIn: urlCheckIn || "",
      checkOut: urlCheckOut || "",
      roomId: urlRoomId ? Number(urlRoomId) : 1,
      guests: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    }
  });

  const { handleSubmit, watch, trigger, setValue } = methods;

  useEffect(() => {
    if (urlCheckIn) setValue("checkIn", urlCheckIn);
    if (urlCheckOut) setValue("checkOut", urlCheckOut);
    if (urlRoomId) setValue("roomId", Number(urlRoomId));
  }, [urlCheckIn, urlCheckOut, urlRoomId, setValue]);

  const selectedRoomId = watch("roomId");
  const selectedRoom = useMemo(() => rooms.find(r => r.id === Number(selectedRoomId)), [selectedRoomId]);
  
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const guests = watch("guests");
  
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const guestPrice = useMemo(() => (Number(guests) - 1) * 1000, [guests]);
  const totalPrice = useMemo(() => {
    if (!selectedRoom || nights <= 0) return 0;
    return (selectedRoom.price + guestPrice) * nights;
  }, [selectedRoom, nights, guestPrice]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);
  const onSubmit = async () => setIsRazorpayOpen(true);

  const formData = watch();

  const handlePaymentSuccess = () => {
    setIsRazorpayOpen(false);
    setIsProcessing(true);
    
    saveBooking({
      guest: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      room: selectedRoom?.title,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      amount: totalPrice
    });

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return <BookingSuccess formData={formData} selectedRoom={selectedRoom} nights={nights} totalPrice={totalPrice} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden order-2 lg:order-1">
        
        {/* Progress Indicator */}
        <div className="bg-[#f8fafc] px-8 py-6 border-b border-gray-100 flex items-center justify-between overflow-x-auto gap-4 custom-scrollbar">
          {[
            { id: 1, label: "Selection", icon: Calendar },
            { id: 2, label: "Your Info", icon: User },
            { id: 3, label: "Payment", icon: CreditCard },
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-3 shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                step === s.id ? "bg-[#1e81b0] text-white shadow-lg" : 
                step > s.id ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              )}>
                {step > s.id ? <Check size={20} strokeWidth={3} /> : <s.icon size={20} />}
              </div>
              <span className={cn(
                "text-sm font-bold tracking-wide",
                step === s.id ? "text-[#1e81b0]" : step > s.id ? "text-green-600" : "text-gray-400"
              )}>
                {s.label}
              </span>
              {s.id < 3 && <div className="hidden sm:block w-8 h-[2px] bg-gray-200 ml-2" />}
            </div>
          ))}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <StepSelection selectedRoomId={selectedRoomId} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <StepInformation />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <StepPayment 
                    selectedRoom={selectedRoom} 
                    nights={nights} 
                    guests={guests} 
                    totalPrice={totalPrice} 
                    checkIn={checkIn} 
                    checkOut={checkOut} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex gap-4">
              {step > 1 && (
                <Button type="button" onClick={handleBack} disabled={isProcessing} className="flex-1 bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 py-4 font-bold">
                  <ChevronLeft className="mr-2" size={20} /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1 bg-[#1e81b0] py-4 text-white hover:shadow-xl hover:shadow-[#1e81b0]/20 transition-all font-bold group">
                  Continue <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              ) : (
                <Button type="submit" disabled={isProcessing} className="flex-1 bg-[#1e81b0] py-4 text-white font-black text-lg shadow-xl shadow-blue-500/20">
                  {isProcessing ? <><Loader2 className="mr-2 animate-spin" size={20} /> Processing...</> : `Pay ₹${totalPrice} Now`}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      <div className="w-full lg:w-80 shrink-0 sticky top-32 order-1 lg:order-2">
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
          <div className="relative h-48">
            <img src={selectedRoom?.img} className="w-full h-full object-cover" alt={selectedRoom?.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white font-black text-xl leading-tight">{selectedRoom?.title}</h3>
              <p className="text-white/80 text-sm font-medium"> Luxury Stay</p>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Check In</p>
                  <p className="font-bold text-[#1e293b]">{checkIn ? new Date(checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Check Out</p>
                  <p className="font-bold text-[#1e293b]">{checkOut ? new Date(checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                  <p className="font-bold text-[#1e293b]">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-[#1e81b0]">₹{totalPrice}</p>
                </div>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                <p className="text-[11px] text-[#1e81b0] font-bold leading-relaxed">* All taxes and fees are included in the final price.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RazorpayMock isOpen={isRazorpayOpen} onClose={() => setIsRazorpayOpen(false)} onSuccess={handlePaymentSuccess} amount={totalPrice} />
    </div>
  );
}
