"use client";
import Modal from "@/components/ui/modal";
import { useAccount } from "@/hooks/use-account-service";
import { accountService } from "@/services/account-service";
import Avatar from "@/assets/icons/user.svg";
import { useState, useEffect } from "react";

export default function AccountDetailModal({
  open,
  onClose,
  accountId,
}: {
  open: boolean;
  onClose: () => void;
  accountId: number | string;
}) {
  const { data: account, loading } = useAccount(accountId);
  const [displayRole, setDisplayRole] = useState<string>("");

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "text-purple-600 font-bold bg-purple-100";
      case "user":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  useEffect(() => {
    if (account && open) {
      setDisplayRole(account.role || "user");
    }
  }, [account, open]);

  return (
    <Modal
      state={open}
      funcClickToBack={() => onClose()}
      className="w-full max-w-xl"
    >
      <div className="space-y-4">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-green)" }}
        >
          Thông tin tài khoản
        </h2>
        {loading || !account ? (
          <div>Đang tải...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <img
                src={account.avatar || Avatar.src}
                alt={account.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <div className="text-lg font-bold">{account.name}</div>
                <div className="text-sm opacity-80">Mã: {account.userId}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm opacity-70">Quyền</div>
                <div
                  className={`text-center py-1 px-3 w-fit ${getRoleStyle(
                    displayRole
                  )} rounded-sm text-sm font-semibold`}
                >
                  {displayRole === "admin" ? "Quản trị viên" : "Người dùng"}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">Lớp</div>
                <div className="font-medium">{account.class || "—"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Email</div>
                <div className="font-medium">{account.email || "—"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Trạng thái</div>
                <div className="font-medium">{account.status || "—"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm opacity-70">Ban</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {account.teams?.length > 0 ? (
                    account.teams.map((team: string, index: number) => (
                      <span
                        key={`${account.id}-team-${index}-${team}`}
                        className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm"
                      >
                        {team}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Chưa tham gia ban nào
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm opacity-70">Ngày tham gia</div>
                <div className="font-medium">{account.joinDate || "—"}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
