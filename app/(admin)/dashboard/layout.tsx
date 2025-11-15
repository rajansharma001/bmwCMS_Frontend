import DashboardLayout from "@/components/DashboardLayout";
import { AuthProvider } from "@/context/authProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </div>
  );
}
