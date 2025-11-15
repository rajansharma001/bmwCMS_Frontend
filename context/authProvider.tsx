"use client";
import { UserTypes } from "@/types/userTypes";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: UserTypes | null;
  fetchUser: () => Promise<void>;
  isLoading: boolean;
  logoutUser: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`,
        { method: "GET", credentials: "include" }
      );
      const result = await res.json();
      if (res.ok) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    console.log("frontend clicked?");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    console.log("status: ", res.status);
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, fetchUser, isLoading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
