export function StepPayment({ selectedRoom, nights, guests, totalPrice, checkIn, checkOut }) {
  return (
    <div className="space-y-8">
      <div className="bg-[#f8fafc] rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e81b0]/5 rounded-bl-full pointer-events-none" />
        <h3 className="text-xl font-black text-[#1e293b] mb-6 flex items-center gap-2">
          Booking Summary
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stay Details</p>
              <p className="font-bold text-gray-700">{selectedRoom?.title}</p>
              <p className="text-sm text-gray-500 font-medium">{nights} nights ({new Date(checkIn).toLocaleDateString()} to {new Date(checkOut).toLocaleDateString()})</p>
            </div>
            <div className="text-right">
              <p className="font-black text-[#1e293b]">₹{selectedRoom?.price * nights}</p>
            </div>
          </div>

          <div className="space-y-2 px-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Room Price (₹{selectedRoom?.price} x {nights})</span>
              <span className="font-bold text-gray-700">₹{selectedRoom?.price * nights}</span>
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
    </div>
  );
}
