"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster theme="dark" richColors closeButton />
    </AuthProvider>
  );
}
