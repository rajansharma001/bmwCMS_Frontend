"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authProvider";

export const useProtectedRoute = (redirectIfLoggedIn: boolean = false) => {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (redirectIfLoggedIn) {
      if (user) {
        router.replace("/dashboard");
      }
      return;
    }
    // Case 2: Protect dashboard pages
    if (!user) {
      router.replace("/login");
    }
  }, [user, isLoading, redirectIfLoggedIn, router]);
};
