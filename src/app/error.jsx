"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-4">Something went wrong!</h2>
        <p className="text-gray-500 mb-8 font-medium">We encountered an unexpected application error. Our technical team has been notified.</p>
        <Button onClick={() => reset()} className="w-full bg-[#1e81b0] py-4 rounded-full font-bold shadow-lg shadow-[#1e81b0]/20 text-white">
          Try Again
        </Button>
      </div>
    </div>
  );
}
