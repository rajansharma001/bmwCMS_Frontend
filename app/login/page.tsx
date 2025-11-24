"use client";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/webComponents/Footer";
import Navbar from "@/components/webComponents/Navbar";
import PageHeader from "@/components/webComponents/PageHeader";
import { useProtectedRoute } from "@/context/useProtected";

const Login = () => {
  useProtectedRoute(true);
  return (
    <div className="w-full">
      <Navbar />
      <PageHeader breadcrumb={"login"} title={"Login"} />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;
