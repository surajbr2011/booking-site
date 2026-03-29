"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { usePathname } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function RootAdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute>
          <AdminLayout>{children}</AdminLayout>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
