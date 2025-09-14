"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProfileService } from "@/hooks/use-profile-service";
import Loading from "@/components/ui/loading";
import Card from "@/components/ui/card";
import AvatarIcon from "@/assets/icons/user.svg";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { profileService } from "@/services/profile-service";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const { userProfile, profileLoading, profileError, refetch } =
    useProfileService(user?.id);
  const router = useRouter();

  // Form state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    class_name: "",
    khoa: "",
    phone: "",
    introduction: "",
    social_link: {
      Github: "",
      Facebook: "",
      Instagram: "",
      LinkedIn: "",
    },
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when userProfile is loaded
  useEffect(() => {
    if (userProfile && !isEditMode) {
      setFormData({
        full_name: userProfile.full_name || "",
        class_name: userProfile.class_name || "",
        khoa: userProfile.khoa || "",
        phone: userProfile.phone || "",
        introduction: userProfile.introduction || "",
        social_link: {
          Github: userProfile.social_link?.Github || "",
          Facebook: userProfile.social_link?.Facebook || "",
          Instagram: userProfile.social_link?.Instagram || "",
          LinkedIn: userProfile.social_link?.LinkedIn || "",
        },
      });
    }
  }, [userProfile, isEditMode]);

  // Set creating mode when user doesn't have profile
  useEffect(() => {
    if (
      (profileError && profileError.includes("404")) ||
      (!userProfile && !profileLoading)
    ) {
      setIsCreating(true);
    } else if (userProfile) {
      setIsCreating(false);
    }
  }, [profileError, userProfile, profileLoading]);

  // Early returns for loading and error states
  if (isLoading || profileLoading) return <Loading />;

  if (!user) {
    return (
      <div className="p-6" style={{ color: "var(--foreground)" }}>
        Bạn chưa đăng nhập.
      </div>
    );
  }

  // Form handling functions
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialKey = name.replace("social_", "");
      setFormData((prev) => ({
        ...prev,
        social_link: {
          ...prev.social_link,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Họ tên là bắt buộc";
    }

    if (!formData.class_name.trim()) {
      errors.class_name = "Lớp là bắt buộc";
    }

    if (!formData.khoa.trim()) {
      errors.khoa = "Khoa là bắt buộc";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isCreating) {
        // Create new profile
        await profileService.createUserProfile({
          full_name: formData.full_name,
          class_name: formData.class_name,
          khoa: formData.khoa,
          phone: formData.phone,
          introduction: formData.introduction,
          social_link: Object.fromEntries(
            Object.entries(formData.social_link).filter(([_, value]) =>
              value.trim()
            )
          ),
        });
        setIsCreating(false);
        await refetch();
      } else {
        // Update existing profile
        await profileService.updateUserProfile({
          id: userProfile!.id,
          full_name: formData.full_name,
          class_name: formData.class_name,
          khoa: formData.khoa,
          email: userProfile!.email,
          phone: formData.phone,
          introduction: formData.introduction,
          social_link: Object.fromEntries(
            Object.entries(formData.social_link).filter(([_, value]) =>
              value.trim()
            )
          ),
        });
        setIsEditMode(false);
        await refetch();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setFormErrors({
        general: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
    } else {
      setIsEditMode(false);
      // Reset form data to original values
      if (userProfile) {
        setFormData({
          full_name: userProfile.full_name || "",
          class_name: userProfile.class_name || "",
          khoa: userProfile.khoa || "",
          phone: userProfile.phone || "",
          introduction: userProfile.introduction || "",
          social_link: {
            Github: userProfile.social_link?.Github || "",
            Facebook: userProfile.social_link?.Facebook || "",
            Instagram: userProfile.social_link?.Instagram || "",
            LinkedIn: userProfile.social_link?.LinkedIn || "",
          },
        });
      }
    }
    setFormErrors({});
  };

  // Helper functions
  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Display data
  const displayName =
    userProfile?.full_name || `${user.firstName} ${user.lastName}`.trim();
  const displayEmail = userProfile?.email || user.email;

  return (
    <div className="p-6 space-y-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>
              {isCreating
                ? "Tạo hồ sơ cá nhân"
                : isEditMode
                ? "Chỉnh sửa hồ sơ"
                : "Hồ sơ cá nhân"}
            </span>
            <div className="flex gap-2">
              {!isCreating && !isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                  style={{
                    borderColor: "var(--sfit-gray-200)",
                    color: "var(--foreground)",
                  }}
                >
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={handleChangePassword}
                className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                style={{
                  borderColor: "var(--sfit-gray-200)",
                  color: "var(--foreground)",
                }}
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md text-white text-sm"
                style={{ backgroundColor: "var(--sfit-red-500)" }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        }
      >
        {/* Show form for creating or editing */}
        {isCreating || isEditMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {formErrors.general && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{formErrors.general}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3
                className="text-lg font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập họ và tên"
                  />
                  {formErrors.full_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập số điện thoại"
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Lớp *
                  </label>
                  <input
                    type="text"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập tên lớp"
                  />
                  {formErrors.class_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.class_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Khoa *
                  </label>
                  <input
                    type="text"
                    name="khoa"
                    value={formData.khoa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập tên khoa"
                  />
                  {formErrors.khoa && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.khoa}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Giới thiệu
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                  placeholder="Giới thiệu về bản thân..."
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3
                className="text-lg font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Liên kết mạng xã hội
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.social_link).map(([platform, url]) => (
                  <div key={platform}>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {platform}
                    </label>
                    <input
                      type="url"
                      name={`social_${platform}`}
                      value={url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      style={{ borderColor: "var(--sfit-gray-200)" }}
                      placeholder={`https://${platform.toLowerCase()}.com/username`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : isCreating
                  ? "Tạo hồ sơ"
                  : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          /* Show existing profile display */
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-6 py-4">
              <img
                src={user.avatar || AvatarIcon.src}
                alt={displayName}
                className="w-24 h-24 rounded-full border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1
                    className="text-2xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {displayName}
                  </h1>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: "var(--sfit-green-light)",
                      color: "var(--sfit-green)",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="opacity-80 mb-1">{displayEmail}</div>
                {(userProfile?.class_name || userProfile?.khoa) && (
                  <div className="opacity-70 text-sm">
                    {userProfile?.class_name && (
                      <span>{userProfile.class_name}</span>
                    )}
                    {userProfile?.class_name && userProfile?.khoa && (
                      <span> - </span>
                    )}
                    {userProfile?.khoa && <span>{userProfile.khoa}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Introduction */}
            {userProfile?.introduction && (
              <div
                className="mt-4 p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70 mb-2">Giới thiệu</div>
                <div className="font-medium">{userProfile.introduction}</div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Mã người dùng</div>
                <div className="font-medium">{userProfile?.id || user.id}</div>
              </div>
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Email</div>
                <div className="font-medium">{displayEmail}</div>
              </div>
              {userProfile?.phone && (
                <div
                  className="p-4 rounded border"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div className="text-sm opacity-70">Số điện thoại</div>
                  <div className="font-medium">{userProfile.phone}</div>
                </div>
              )}
              {userProfile?.class_name && (
                <div
                  className="p-4 rounded border"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div className="text-sm opacity-70">Lớp</div>
                  <div className="font-medium">{userProfile.class_name}</div>
                </div>
              )}
            </div>

            {/* Statistics */}
            {userProfile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div
                  className="p-4 rounded border text-center"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--sfit-blue-500)" }}
                  >
                    {userProfile.completed_course}
                  </div>
                  <div className="text-sm opacity-70">Khóa học hoàn thành</div>
                </div>
                <div
                  className="p-4 rounded border text-center"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--sfit-green-500)" }}
                  >
                    {userProfile.joined_event}
                  </div>
                  <div className="text-sm opacity-70">Sự kiện tham gia</div>
                </div>
                <div
                  className="p-4 rounded border text-center"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--sfit-purple-500)" }}
                  >
                    {userProfile.completed_task}
                  </div>
                  <div className="text-sm opacity-70">Nhiệm vụ hoàn thành</div>
                </div>
              </div>
            )}

            {/* Social Links */}
            {userProfile?.social_link &&
              Object.keys(userProfile.social_link).length > 0 && (
                <div
                  className="mt-4 p-4 rounded border"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div className="text-sm opacity-70 mb-3">
                    Liên kết mạng xã hội
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userProfile.social_link).map(
                      ([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-md text-sm border hover:bg-gray-50"
                          style={{
                            borderColor: "var(--sfit-gray-200)",
                            color: "var(--foreground)",
                          }}
                        >
                          {platform}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Ngày tạo</div>
                <div className="font-medium">
                  {userProfile?.created_at
                    ? formatDate(userProfile.created_at)
                    : user.createdAt}
                </div>
              </div>
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Cập nhật gần nhất</div>
                <div className="font-medium">
                  {userProfile?.updated_at
                    ? formatDate(userProfile.updated_at)
                    : user.updatedAt}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
