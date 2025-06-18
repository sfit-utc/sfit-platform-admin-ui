"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import Google from "../icons/Google";
import Facebook from "../icons/Facebook";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Họ là bắt buộc";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Tên là bắt buộc";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Bạn phải đồng ý với điều khoản sử dụng";
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
      // TODO: Implement actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Registration attempt:", formData);
      // Redirect to email verification or login page
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-11/12 m-auto flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col justify-center items-center text-center">
        <h2 className="text-sfit-primary font-semibold text-5xl">SFIT</h2>
        <h3 className="text-2xl font-semibold text-black m-2">UTC'S IT CLUB</h3>
        <p className="text-gray-600">
          Đăng ký tài khoản SFIT CLASSROOM ngay hôm nay
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="text-black flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="text-gray-700">
              Họ
            </label>
            <br />
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="w-full bg-white border border-gray-400 rounded-lg p-2"
              onChange={handleChange}
              value={formData.lastName}
              placeholder="Nguyễn Văn"
            />
          </div>
          <div>
            <label htmlFor="firstName" className="text-gray-700">
              Tên
            </label>
            <br />
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="w-full bg-white border border-gray-400 rounded-lg p-2"
              onChange={handleChange}
              value={formData.firstName}
              placeholder="A"
            />
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="email" className="text-gray-700">
            Email
          </label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
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
            placeholder="Tạo mật khẩu mạnh"
            onChange={handleChange}
            value={formData.password}
          />
          <p className="text-xs text-gray-500">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
          </p>
        </div>
        <div className="w-full">
          <label htmlFor="confirmPassword" className="text-gray-700">
            Xác nhận mật khẩu
          </label>
          <br />
          <input
            type="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
            placeholder="Nhập lại mật khẩu"
            onChange={handleChange}
            value={formData.confirmPassword}
          />
        </div>
        <div className="w-full text-sm">
          <label htmlFor="agreeToTerms">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              onChange={handleChange}
              checked={formData.agreeToTerms}
              className="mr-1"
            />
            Tôi đồng ý với{" "}
            <Link href="/terms" className="text-sfit-primary">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link href="privacy" className="text-sfit-primary">
              Chính sách bảo mật
            </Link>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 p-2 bg-sfit-primary rounded-lg text-white cursor-pointer hover:bg-sfit-primary-dark"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" />
              Đang đăng ký
            </>
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>
      <div className="text-gray-600 text-center">
        Đã có tài khoản?
        <Link href="/login" className="text-sfit-primary">
          Đăng nhập
        </Link>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-sfit-primary-light text-gray-500 font-medium">
            Hoặc đăng ký với
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
