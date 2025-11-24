import Navbar from "@/components/webComponents/Navbar";
import Footer from "@/components/webComponents/Footer";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
