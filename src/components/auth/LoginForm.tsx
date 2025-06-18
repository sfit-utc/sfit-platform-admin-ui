"use client";

import { useState } from "react";
import Link from "next/link";
import Facebook from "@/components/icons/Facebook";
import Google from "@/components/icons/Google";
import { LoaderCircle } from "lucide-react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual login logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Login attempt:", formData);
      // Redirect to dashboard or home page
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-11/12 m-auto flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col justify-center items-center text-center">
        <h2 className="text-sfit-primary font-semibold text-5xl">SFIT</h2>
        <h3 className="text-2xl font-semibold text-black m-2">UTC'S IT CLUB</h3>
        <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="text-black flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <label htmlFor="email" className="text-gray-700">
            Email
          </label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            className="w-full border border-gray-400 bg-white rounded-lg p-2"
            onChange={handleChange}
            value={formData.email}
            placeholder="example@gmail.com"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-gray-700">
            Mật khẩu
          </label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
            onChange={handleChange}
            value={formData.password}
          />
        </div>
        <div className="w-full flex justify-between gap-1 text-sm">
          <label htmlFor="rememberMe">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              onChange={handleChange}
              checked={formData.rememberMe}
              className="mr-1"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link href="/forget" className="text-sfit-primary">
            Quên mật khẩu?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 p-2 bg-sfit-primary rounded-lg text-white cursor-pointer hover:bg-sfit-primary-dark"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" />
              Đang đăng nhập
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
      <div className="text-gray-600 text-center">
        Chưa có tài khoản?
        <Link href="/register" className="text-sfit-primary">
          Đăng ký
        </Link>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-sfit-primary-light text-gray-500 font-medium">
            Hoặc đăng nhập với
          </span>
        </div>
      </div>
      <div className="w-full text-black grid grid-cols-2 gap-4">
        <div className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
          <Google width={20} height={20} className="mr-2" />
          Google
        </div>
        <div className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
          <Facebook width={20} height={20} className="mr-2" />
          Facebook
        </div>
      </div>
    </div>
  );
}
