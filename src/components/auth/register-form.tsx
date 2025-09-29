"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import Google from "@/components/icons/google";
import Facebook from "@/components/icons/facebook";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    class_name: "",
    khoa: "",
    msv: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

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

    if (!formData.username.trim())
      newErrors.username = "Tên đăng nhập là bắt buộc";
    if (!formData.full_name.trim()) newErrors.full_name = "Họ tên là bắt buộc";

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc";
    if (!formData.class_name.trim()) newErrors.class_name = "Lớp là bắt buộc";
    if (!formData.khoa.trim()) newErrors.khoa = "Khoa là bắt buộc";
    if (!formData.msv.trim()) newErrors.msv = "Mã sinh viên là bắt buộc";

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
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        class_name: formData.class_name,
        khoa: formData.khoa,
        msv: formData.msv,
      });
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full text-black flex items-center justify-center px-8 py-12 md:px-12 order-2">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-green-600">
              SFIT
            </h1>
            <h2 className="text-xl font-semibold tracking-tight">
              UTC&apos;S IT CLUB
            </h2>
            <p className="text-sm text-gray-500">Đăng ký tài khoản của bạn</p>
          </div>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="w-full text-black grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  placeholder="username"
                  required
                  type="text"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ và tên
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10 ${
                    errors.full_name ? "border-red-500" : ""
                  }`}
                  placeholder="Nguyễn Văn A"
                  required
                  type="text"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.full_name}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="example@gmail.com"
                required
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="w-full text-black grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10"
                  placeholder="0987654321"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="class_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lớp
                </label>
                <input
                  id="class_name"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  className="bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10"
                  placeholder="CNTT-K65"
                  required
                  type="text"
                />
              </div>
            </div>
            <div className="w-full text-black grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="khoa"
                  className="block text-sm font-medium text-gray-700"
                >
                  Khoa
                </label>
                <input
                  id="khoa"
                  name="khoa"
                  value={formData.khoa}
                  onChange={handleChange}
                  className="bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10"
                  placeholder="CNTT"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="msv"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã sinh viên
                </label>
                <input
                  id="msv"
                  name="msv"
                  value={formData.msv}
                  onChange={handleChange}
                  className="bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10"
                  placeholder="123456"
                  required
                  type="text"
                />
              </div>
            </div>
            <div className="w-full text-black grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  required
                  placeholder="Tạo mật khẩu mạnh"
                  type="password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nhập lại mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 py-2 px-3 h-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  required
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Tôi đồng ý với {""}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-500 transition-colors font-medium"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và {""}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:text-green-500 transition-colors font-medium"
                  >
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>
            </div>
            <button
              className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>
          <div className="text-center text-sm text-gray-500">
            Đã có tài khoản? {""}
            <Link href="/login" className="text-green-600 hover:underline">
              Đăng nhập
            </Link>
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
      </div>
    </div>
  );
}
