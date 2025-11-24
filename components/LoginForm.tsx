"use client";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();
      setIsSubmitLoading(false);
      if (!res.ok) {
        setSuccess(false);
        setMessage(result.error);
      } else {
        setFormData({
          email: "",
          password: "",
        });
        setSuccess(true);
        setMessage("Logged-in successfull.");
        router.push("/dashboard");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`API ERROR. : ${error}`);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, []);

  return (
    <div className="w-full flex  justify-center py-20">
      <div className="w-96 p-6 border border-gray-300 rounded-md shadow-md">
        <div className="w-full flex flex-col items-center justify-center py-3">
          <Image
            src="/bmwtt.webp"
            alt="BMW Logo"
            width={520}
            height={520}
            className="w-[100px] "
          />
          <h1 className="text-md font-semibold text-primary text-center p-4">
            Welcome to BMW Management System
          </h1>
        </div>

        {/* notification alert */}
        {message !== "" && (
          <div
            className={` w-full p-5 rounded-md ${
              success ? "bg-green-200 text-white" : "bg-red-200 text-white"
            }`}
          >
            <h1 className={`${success ? "text-green-700 " : "text-red-700 "}`}>
              {message}
            </h1>
          </div>
        )}

        {isSubmitLoading ? (
          <div className="w-full flex flex-col items-center justify-center">
            <Loader size={30} className="animate-spin" />
            <h1>Loading</h1>
          </div>
        ) : (
          <form action="" onSubmit={handleSubmit} className="py-5">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md"
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-md cursor-pointer hover:bg-secondary transition duration-300 ease-in-out"
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
