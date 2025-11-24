import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authProvider";

export const metadata: Metadata = {
  title: "Best BMW Management System",
  description: "Your complete travel management solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
