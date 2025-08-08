"use client";

import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/ui/loading";
import Card from "@/components/ui/card";
import AvatarIcon from "@/assets/icons/user.svg";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) return <Loading />;
  if (!user)
    return (
      <div className="p-6" style={{ color: "var(--foreground)" }}>
        Bạn chưa đăng nhập.
      </div>
    );

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="p-6 space-y-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Hồ sơ cá nhân</span>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/change-password")}
                className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                style={{
                  borderColor: "var(--sfit-gray-200)",
                  color: "var(--foreground)",
                }}
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="px-3 py-1 rounded-md text-white text-sm"
                style={{ backgroundColor: "var(--sfit-red-500)" }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-6 py-4">
          <img
            src={user.avatar || AvatarIcon.src}
            alt={fullName}
            className="w-24 h-24 rounded-full border"
            style={{ borderColor: "var(--sfit-gray-200)" }}
          />
          <div>
            <div
              className="text-2xl font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {fullName}
            </div>
            <div className="opacity-80">{user.email}</div>
            <div
              className="mt-1 inline-block px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: "var(--sfit-green-light)",
                color: "var(--sfit-green)",
              }}
            >
              {user.role}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div
            className="p-4 rounded border"
            style={{ borderColor: "var(--sfit-gray-200)" }}
          >
            <div className="text-sm opacity-70">Mã người dùng</div>
            <div className="font-medium">{user.id}</div>
          </div>
          <div
            className="p-4 rounded border"
            style={{ borderColor: "var(--sfit-gray-200)" }}
          >
            <div className="text-sm opacity-70">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div
            className="p-4 rounded border"
            style={{ borderColor: "var(--sfit-gray-200)" }}
          >
            <div className="text-sm opacity-70">Ngày tạo</div>
            <div className="font-medium">{user.createdAt}</div>
          </div>
          <div
            className="p-4 rounded border"
            style={{ borderColor: "var(--sfit-gray-200)" }}
          >
            <div className="text-sm opacity-70">Cập nhật gần nhất</div>
            <div className="font-medium">{user.updatedAt}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
