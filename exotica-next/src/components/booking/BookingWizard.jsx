"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, CreditCard, ChevronRight, ChevronLeft, Check, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { cn } from "@/lib/utils";
import { EmailPreview } from "@/components/booking/EmailPreview";
import { RazorpayMock } from "@/components/booking/RazorpayMock";

import { api } from "@/lib/apiClient";


// --- Validation Schemas ---

const step1Schema = yup.object({
  checkIn: yup.date().required("Check-in date is required").min(new Date(new Date().setHours(0,0,0,0)), "Check-in must be today or later"),
  checkOut: yup.date().required("Check-out date is required").min(yup.ref('checkIn'), "Check-out must be after check-in"),
  roomId: yup.string().required("Please select a room"),
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
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [dbRooms, setDbRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await api.getRooms();
        setDbRooms(res.data);
      } catch (err) {
        console.error("Failed to load rooms:", err);
      } finally {
        setIsLoadingRooms(false);
      }
    }
    loadRooms();
  }, []);
  const searchParams = useSearchParams();
  const urlCheckIn = searchParams.get("checkIn");
  const urlCheckOut = searchParams.get("checkOut");
  const urlRoomId = searchParams.get("roomId");

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(step === 1 ? step1Schema : step === 2 ? step2Schema : allStepsSchema),
    defaultValues: {
      checkIn: urlCheckIn || "",
      checkOut: urlCheckOut || "",
      roomId: urlRoomId || "",
      guests: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    }
  });

  // Sync from URL if params change
  useEffect(() => {
    if (urlCheckIn) setValue("checkIn", urlCheckIn);
    if (urlCheckOut) setValue("checkOut", urlCheckOut);
    if (urlRoomId) setValue("roomId", urlRoomId);
  }, [urlCheckIn, urlCheckOut, urlRoomId, setValue]);

  const selectedRoomId = watch("roomId");
  const selectedRoom = useMemo(() => dbRooms.find(r => r.id === selectedRoomId), [selectedRoomId, dbRooms]);
  
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  
  const guests = watch("guests");
  
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const guestPrice = useMemo(() => {
    return (Number(guests) - 1) * 1000;
  }, [guests]);

  const totalPrice = useMemo(() => {
    if (!selectedRoom || nights <= 0) return 0;
    return (parseFloat(selectedRoom.basePrice) + guestPrice) * nights;
  }, [selectedRoom, nights, guestPrice]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const formData = watch();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data) => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    setIsProcessing(true);
    
    try {
      // 1. Create Pending Booking (Common for both flows)
      const bookingRes = await api.createBooking({
        roomId: selectedRoomId,
        guestName: `${data.firstName} ${data.lastName}`.trim(),
        guestEmail: data.email,
        guestPhone: data.phone,
        checkInDate: data.checkIn,
        checkOutDate: data.checkOut,
        numberOfGuests: Number(data.guests),
        totalAmount: totalPrice,
      });

      const bookingRef = bookingRes.data.bookingReference;

      // If no keys configured, use the Mock Flow
      if (!keyId) {
        setIsProcessing(false);
        setPendingBookingRef(bookingRef); // Store for mock completion
        setIsRazorpayOpen(true);
        return;
      }

      // 2. Create Razorpay Order
      const orderRes = await api.createPaymentOrder(bookingRef);

      // 3. Load SDK and Open Checkout
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK. Are you online?");
        return setIsProcessing(false);
      }

      const options = {
        key: keyId,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "The Exotica Agonda",
        description: `Booking ${bookingRef}`,
        order_id: orderRes.orderId,
        handler: function (response) {
          // The webhook handles the actual database update and emails securely
          setIsSuccess(true);
          setIsProcessing(false);
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#1e81b0",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      paymentObject.open();

    } catch (error) {
      console.error("Booking initiation failed:", error);
      alert("Booking failed: " + (error.message || "Unknown error"));
      setIsProcessing(false);
    }
  };

  const [pendingBookingRef, setPendingBookingRef] = useState(null);

  const handlePaymentSuccess = async () => {
    // This is ONLY called by the RazorpayMock flow
    setIsRazorpayOpen(false);
    setIsProcessing(true);
    
    try {
      if (!pendingBookingRef) throw new Error("No pending booking found");

      // Patch it to 'confirmed' natively (which the webhook usually does for real payments)
      await fetch(`/api/bookings/${pendingBookingRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "paid",
          bookingStatus: "confirmed",
          paymentId: "mock_payment_id_" + Math.random().toString(36).substr(2, 9)
        })
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Booking mock completion failed:", error);
      alert("Booking failed: " + (error.message || 'Unknown error.'));
    } finally {
      setIsProcessing(false);
    }
  };



  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank', 'height=800,width=800');
    if (!printWindow) return alert("Please allow popups to download your receipt.");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Exotica Agonda - Receipt</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1e81b0; padding-bottom: 20px; }
            .header h1 { color: #1e81b0; margin: 0 0 10px 0; font-size: 28px; }
            .header p { color: #64748b; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
            .info-box { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item label { display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 5px; }
            .info-item span { display: block; font-size: 16px; font-weight: bold; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 15px; background: #f1f5f9; color: #64748b; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
            td { padding: 15px; border-bottom: 1px solid #e2e8f0; font-weight: 500; }
            .total-row td { background: #1e81b0; color: white; font-weight: bold; font-size: 18px; border: none; }
            .footer { text-align: center; margin-top: 50px; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>The Exotica Agonda</h1>
            <p>Official Booking Receipt</p>
          </div>
          
          <div class="info-box">
            <div class="info-grid">
              <div class="info-item">
                <label>Guest Name</label>
                <span>${formData.firstName} ${formData.lastName}</span>
              </div>
              <div class="info-item">
                <label>Booking Reference</label>
                <span>EXO-${Math.floor(Math.random() * 90000) + 10000}</span>
              </div>
              <div class="info-item">
                <label>Email Address</label>
                <span>${formData.email}</span>
              </div>
              <div class="info-item">
                <label>Phone Number</label>
                <span>${formData.phone}</span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${selectedRoom?.roomName}</strong><br/>
                  <span style="color: #64748b; font-size: 13px;">${nights} Nights • ${formData.guests} Guest(s)</span>
                </td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td style="text-align: right;">₹${totalPrice}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">Total Amount Paid</td>
                <td style="text-align: right;">₹${totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Thank you for choosing The Exotica Agonda. We look forward to hosting you!</p>
            <p>Agonda Beach, Canacona, Goa 403702 • +91 98765 43210</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      // Only close if it's not blocked by the print dialog
      // printWindow.close(); 
    }, 500);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-[40px] p-10 md:p-16 text-center shadow-xl border border-gray-100 mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-sm">
            <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-[#1e293b] mb-4">You&apos;re All Set!</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto font-medium">
            Your booking at The Exotica Agonda has been confirmed. You will receive an email shortly with your full itinerary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button 
              onClick={() => setShowEmailPreview(false)}
              className={cn(
                "flex-1 py-4 rounded-3xl font-bold transition-all border-2",
                !showEmailPreview ? "bg-[#1e81b0] text-white border-[#1e81b0]" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              )}
            >
              View Receipt
            </button>
            <button 
              onClick={() => setShowEmailPreview(true)}
              className={cn(
                "flex-1 py-4 rounded-3xl font-bold transition-all border-2",
                showEmailPreview ? "bg-[#1e81b0] text-white border-[#1e81b0]" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              )}
            >
              Preview Confirmation Email
            </button>
          </div>

          <div className="flex justify-center mb-8">
             <button 
               onClick={handleDownloadPDF}
               className="bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
             >
               <span className="text-lg">📄</span> Download PDF / Print
             </button>
          </div>

          {!showEmailPreview ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f8fafc] rounded-3xl p-8 text-left border border-gray-100/50"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200/50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Booking Receipt</span>
                <span className="text-lg font-black text-[#1e81b0]">Ref: EXO-39485</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Guest Name</span>
                  <span className="text-gray-800 font-bold">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Room Type</span>
                  <span className="text-gray-800 font-bold">{selectedRoom?.roomName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Guests</span>
                  <span className="text-gray-800 font-bold">{formData.guests} {formData.guests == 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Stay Duration</span>
                  <span className="text-gray-800 font-bold">{nights} Nights</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-black text-[#1e293b]">Total Amount Paid</span>
                  <span className="text-2xl font-black text-[#1e81b0]">₹{totalPrice}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EmailPreview data={formData} room={selectedRoom} nights={nights} totalPrice={totalPrice} />
            </motion.div>
          )}
        </div>
        
        <Button onClick={() => window.location.href = '/'} className="w-full bg-[#1e81b0] py-5 text-lg shadow-xl shadow-[#1e81b0]/20 rounded-3xl">
          Return to Home
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Main Booking Form */}
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12" suppressHydrationWarning>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePicker label="Check In" {...register("checkIn")} />
                  <DatePicker label="Check Out" {...register("checkOut")} />
                </div>
                {errors.checkIn && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.checkIn.message}</p>}
                {errors.checkOut && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.checkOut.message}</p>}

                <div>
                  <label className="text-sm text-gray-500 font-semibold px-2 mb-4 block underline decoration-[#1e81b0]/30 decoration-2 underline-offset-4">Select Your Room</label>
                  {isLoadingRooms ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#1e81b0]" size={32} /></div>
                  ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dbRooms.map((room) => (
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
                            <img src={room.images?.[0] || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={room.roomName} />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-gray-800 text-[15px]">{room.roomName}</h4>
                            <p className="text-[#1e81b0] font-black text-lg">₹{room.basePrice}/- <span className="text-[10px] text-gray-400 font-medium">per night</span></p>
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
                  )}
                </div>

                <div className="flex flex-col gap-1 w-full max-w-[200px]">
                  <label className="text-sm text-gray-500 font-semibold px-2">Guests</label>
                  <select 
                    suppressHydrationWarning
                    {...register("guests")}
                    className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 font-bold text-[#1e293b] focus:ring-2 focus:ring-[#1e81b0] outline-none"
                  >
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>
                
                <div className="mt-12 flex gap-4">
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="flex-1 bg-[#1e81b0] py-4 text-white hover:shadow-xl hover:shadow-[#1e81b0]/20 transition-all font-bold group"
                  >
                    Continue <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" placeholder="John" {...register("firstName")} error={errors.firstName?.message} />
                  <Input label="Last Name" placeholder="Doe" {...register("lastName")} error={errors.lastName?.message} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Email Address" type="email" placeholder="john@example.com" {...register("email")} error={errors.email?.message} />
                  <Input label="Phone Number" placeholder="+91 98765 43210" {...register("phone")} error={errors.phone?.message} />
                </div>

                <div className="mt-12 flex gap-4">
                  <Button 
                    type="button" 
                    onClick={handleBack}
                    disabled={isProcessing}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 py-4 font-bold"
                  >
                    <ChevronLeft className="mr-2" size={20} /> Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="flex-1 bg-[#1e81b0] py-4 text-white hover:shadow-xl hover:shadow-[#1e81b0]/20 transition-all font-bold group"
                  >
                    Continue <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment/Summary */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-[#f8fafc] rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e81b0]/5 rounded-bl-full pointer-events-none" />
                  <h3 className="text-xl font-black text-[#1e293b] mb-6 flex items-center gap-2">
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-50">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stay Details</p>
                        <p className="font-bold text-gray-700">{selectedRoom?.roomName}</p>
                        <p className="text-sm text-gray-500 font-medium">{nights} nights ({new Date(checkIn).toLocaleDateString()} to {new Date(checkOut).toLocaleDateString()})</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#1e293b]">₹{selectedRoom?.basePrice * nights}</p>
                      </div>
                    </div>

                    <div className="space-y-2 px-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Room Price (₹{selectedRoom?.basePrice} x {nights})</span>
                        <span className="font-bold text-gray-700">₹{selectedRoom?.basePrice * nights}</span>
                      </div>
                      {Number(guests) > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Extra Guests (₹1,000 x {guests - 1} x {nights})</span>
                          <span className="font-bold text-gray-700">₹{(guests - 1) * 1000 * nights}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Service Fee</span>
                        <span className="font-bold text-gray-700">₹0</span>
                      </div>
                      <div className="pt-4 border-t border-gray-200 mt-4 flex justify-between items-center">
                        <span className="text-lg font-black text-[#1e293b]">Total Amount</span>
                        <span className="text-2xl font-black text-[#1e81b0]">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100">
                  <div className="mt-1">
                    <input type="checkbox" id="terms" className="w-5 h-5 rounded-md border-gray-300 text-[#1e81b0] focus:ring-[#1e81b0]" required />
                  </div>
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed font-medium cursor-pointer">
                    I agree to the <span className="text-[#1e81b0] font-bold underline cursor-pointer">Terms and Conditions</span> and understand the cancellation policy of The Exotica Agonda.
                  </label>
                </div>
                
                <div className="mt-12 flex gap-4">
                  <Button 
                    type="button" 
                    onClick={handleBack}
                    disabled={isProcessing}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 py-4 font-bold"
                  >
                    <ChevronLeft className="mr-2" size={20} /> Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="flex-1 bg-[#1e81b0] py-4 text-white font-black text-lg shadow-xl shadow-blue-500/20"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={20} /> Processing...
                      </>
                    ) : (
                      `Pay ₹${totalPrice} Now`
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Sidebar Summary Card */}
      <div className="w-full lg:w-80 shrink-0 sticky top-32 order-1 lg:order-2">
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
          <div className="relative h-48">
            <img src={selectedRoom?.images?.[0] || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" alt={selectedRoom?.roomName} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white font-black text-xl leading-tight">{selectedRoom?.roomName}</h3>
              <p className="text-white/80 text-sm font-medium"> {selectedRoom?.category} Stay</p>
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
                <p className="text-[11px] text-[#1e81b0] font-bold leading-relaxed">
                  * All taxes and fees are included in the final price.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RazorpayMock 
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={totalPrice}
      />
    </div>
  );
}
