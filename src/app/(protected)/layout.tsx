"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    const hasToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!isLoading && !isAuthenticated && !hasToken) {
      router.push("/login"); // Only redirect if no token is present
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex w-full flex-col items-center justify-center bg-white">
        <div className="relative z-10 h-[60px] w-[200px]">
          <div className="animate-circle-loading absolute left-[15%] h-5 w-5 origin-center rounded-full bg-blue-600"></div>
          <div
            className="animate-circle-loading absolute left-[45%] h-5 w-5 origin-center rounded-full bg-blue-600"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="animate-circle-loading absolute right-[15%] left-auto h-5 w-5 origin-center rounded-full bg-blue-600"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div className="animate-shadow-loading absolute left-[15%] top-[62px] -z-10 h-1 w-5 origin-center rounded-full bg-black/20 blur-[1px]"></div>
          <div
            className="animate-shadow-loading absolute left-[45%] top-[62px] -z-10 h-1 w-5 origin-center rounded-full bg-black/20 blur-[1px]"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="animate-shadow-loading absolute right-[15%] left-auto top-[62px] -z-10 h-1 w-5 origin-center rounded-full bg-black/20 blur-[1px]"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
        <p className="mt-3 text-lg font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
