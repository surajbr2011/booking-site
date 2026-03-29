"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function RazorpayMock({ amount, isOpen, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePay = () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#1e1e2e] p-6 text-white flex justify-between items-start shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold italic">R</span>
                </div>
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">Mock Checkout</span>
              </div>
              <h2 className="text-xl font-bold">The Exotica Agonda</h2>
              <p className="text-xs opacity-60">Test Environment Configuration</p>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Amount to Pay</span>
              <span className="text-2xl font-black text-gray-900">₹{amount}</span>
            </div>

            <div className="space-y-3 mb-8">
              {/* Option 1: Card */}
              <div 
                onClick={() => setSelectedMethod('card')}
                className={`p-4 border-2 rounded-xl flex flex-col justify-center cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMethod === 'card' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      <CreditCardIcon />
                    </div>
                    <div>
                      <p className={`text-sm font-bold transition-colors ${selectedMethod === 'card' ? 'text-blue-900' : 'text-gray-700'}`}>Credit / Debit Card</p>
                      <p className={`text-[10px] font-medium tracking-wide transition-colors ${selectedMethod === 'card' ? 'text-blue-600' : 'text-gray-400'}`}>Visa, MasterCard, RuPay</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 transition-colors ${selectedMethod === 'card' ? 'border-blue-600 bg-white' : 'border-gray-200'}`} />
                </div>
                {selectedMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-blue-200">
                    <input type="text" placeholder="Card Number" className="w-full text-sm bg-white border border-blue-200 rounded p-2 mb-2 focus:outline-none focus:border-blue-500 text-black font-medium" />
                    <div className="flex gap-2">
                       <input type="text" placeholder="MM/YY" className="w-1/2 text-sm bg-white border border-blue-200 rounded p-2 focus:outline-none focus:border-blue-500 text-black font-medium" />
                       <input type="text" placeholder="CVV" className="w-1/2 text-sm bg-white border border-blue-200 rounded p-2 focus:outline-none focus:border-blue-500 text-black font-medium" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Option 2: UPI */}
              <div 
                onClick={() => setSelectedMethod('upi')}
                className={`p-4 border-2 rounded-xl flex flex-col justify-center cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${selectedMethod === 'upi' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      UPI
                    </div>
                    <div>
                      <p className={`text-sm font-bold transition-colors ${selectedMethod === 'upi' ? 'text-blue-900' : 'text-gray-700'}`}>UPI / QR</p>
                      <p className={`text-[10px] font-medium tracking-wide transition-colors ${selectedMethod === 'upi' ? 'text-blue-600' : 'text-gray-400'}`}>GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 transition-colors ${selectedMethod === 'upi' ? 'border-blue-600 bg-white' : 'border-gray-200'}`} />
                </div>
                {selectedMethod === 'upi' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-blue-200 flex flex-col items-center">
                    <div className="w-24 h-24 mb-2 bg-white flex items-center justify-center rounded-lg shadow-sm border border-blue-300 pointer-events-none">
                      <QrCodeMock />
                    </div>
                    <p className="text-xs text-blue-800 font-bold">Scan with any UPI App</p>
                  </motion.div>
                )}
              </div>
            </div>

            <button 
              onClick={handlePay}
              disabled={isProcessing || !selectedMethod}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 ${selectedMethod ? 'bg-[#339af0] hover:bg-[#228be6] text-white shadow-blue-500/20' : 'bg-gray-200 text-gray-400 shadow-none'}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>{selectedMethod ? `Pay ₹${amount}` : `Select Payment Method`}</span>
              )}
            </button>
            
            <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-center gap-2 grayscale brightness-150 opacity-40">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">PCI DSS Compliant Secure Checkout</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CreditCardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
  );
}

function QrCodeMock() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-800" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
      <path d="M9 3v7"></path><path d="M15 3v7"></path><path d="M15 14v7"></path><path d="M9 14v7"></path>
      <path d="M3 9h7"></path><path d="M14 9h7"></path><path d="M14 15h7"></path><path d="M3 15h7"></path>
    </svg>
  );
}
