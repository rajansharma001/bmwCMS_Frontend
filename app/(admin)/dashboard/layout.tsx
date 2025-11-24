import DashboardLayout from "@/components/DashboardLayout";
import { AuthProvider } from "@/context/authProvider";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Best Mid West Tours & Travels - Admin",
  description: "Admin Dashboard for Vehicle & Ticket Management",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.className} h-full min-h-screen w-full antialiased bg-gray-900`}
    >
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </div>
  );
}
