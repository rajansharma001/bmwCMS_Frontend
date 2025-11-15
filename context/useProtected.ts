"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authProvider";

export const useProtectedRoute = (redirectIfLoggedIn: boolean = false) => {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Case 1: Redirect logged-in users away from auth pages
    if (redirectIfLoggedIn && user) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
      return;
    }

    // Case 2: Protect restricted pages
    if (!redirectIfLoggedIn) {
      if (!user) {
        router.replace("/login");
        return;
      }
    }
  }, [user, isLoading, redirectIfLoggedIn, router]);
};
