"use client";
import LoginForm from "@/components/LoginForm";
import { useProtectedRoute } from "@/context/useProtected";

const Login = () => {
  useProtectedRoute(true);
  return (
    <div className="w-full">
      <LoginForm />
    </div>
  );
};

export default Login;
