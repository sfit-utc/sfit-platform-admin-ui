"use client";
import { AccountListItem } from "@/types/account";
import { useState, useEffect } from "react";
import Avatar from "@/assets/icons/user.svg";
import { SquarePen, Trash, User } from "lucide-react";
import AccountDetailModal from "@/components/account/account-detail-modal";
import AccountEditModal from "@/components/account/account-edit-modal";
import AccountDeleteModal from "@/components/account/account-delete-modal";
import Image from "next/image";
interface AccountItemProps {
  account: AccountListItem;
  index: number;
  style?: string;
  onAccountUpdated?: () => void;
}

export default function AccountItem({
  account,
  index,
  style,
  onAccountUpdated,
}: AccountItemProps) {
  // Early return if account is undefined
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [displayRole, setDisplayRole] = useState<string>(account.role);
  useEffect(() => {
    setDisplayRole(account.role);
  }, [account, setDisplayRole]);

  if (!account) {
    return null;
  }

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "text-purple-600 font-bold bg-purple-100";
      case "user":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const lineView = (
    <div
      className="flex justify-between items-center py-4 border-2 my-2"
      style={{
        color: "var(--foreground)",
        backgroundColor: "var(--background)",
      }}
    >
      <div className="flex-2 text-center font-bold text-2xl">{index}</div>
      <div className="flex-5 text-left">
        <div className="font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          {account.name || "Unknown"}
        </div>
        <div className="text-sm text-gray-500">
          {account.email || "unknown"}
        </div>
      </div>
      <div className="flex-3 flex justify-center items-center">
        <div
          className={`text-center py-1 px-4 w-fit ${getRoleStyle(
            displayRole
          )} rounded-full text-sm font-semibold whitespace-nowrap`}
        >
          {displayRole}
        </div>
      </div>
      <div className="flex-2 flex justify-center items-center">
        <div className="text-center py-1 px-4 w-fit bg-blue-100 text-blue-600 rounded-full text-sm font-semibold whitespace-nowrap">
          {account.class || "Chưa phân lớp"}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1">
        <button
          className="p-1 rounded-full hover:text-green-400 hover:bg-gray-100"
          onClick={() => setOpenView(true)}
        >
          <User />
        </button>
        <button
          className="p-1 rounded-full hover:text-yellow-400 hover:bg-gray-100"
          onClick={() => setOpenEdit(true)}
        >
          <SquarePen />
        </button>
        <button
          className="p-1 rounded-full hover:text-red-400 hover:bg-gray-100"
          onClick={() => setOpenDelete(true)}
        >
          <Trash />
        </button>
      </div>
    </div>
  );

  const boxView = (
    <div
      className="rounded-lg shadow-md p-4 border flex flex-col justify-between"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="">
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-lg font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {index}
          </div>
        </div>

        <div className="mb-3 flex flex-col justify-center items-center">
          <Image
            src={Avatar.src || account.avatar}
            alt={account.name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full"
          />
          <h3 className="text-lg font-semibold mt-2 text-center">
            {account.name || "Unknown"}
          </h3>
          <span className="text-sm text-gray-500 mt-1">
            {account.email || "unknown"}
          </span>

          {/* Display Selected Team's Role */}
          <div className="mt-2"></div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Chức vụ:</span>
            <span
              className={`text-center py-1 px-4 w-fit ${getRoleStyle(
                displayRole
              )} rounded-sm text-sm font-semibold`}
            >
              {displayRole}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Lớp:</span>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
              {account.class || "Chưa phân lớp"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 hover:text-green-400"
          onClick={() => setOpenView(true)}
        >
          <User />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 hover:text-yellow-400"
          onClick={() => setOpenEdit(true)}
        >
          <SquarePen />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-400"
          onClick={() => setOpenDelete(true)}
        >
          <Trash />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {style === "line" ? lineView : boxView}
      <AccountDetailModal
        open={openView}
        onClose={() => setOpenView(false)}
        accountId={account.userId || ""}
      />
      <AccountEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        accountId={account.userId || ""}
        currentRole={account.role}
        onSaved={() => {
          if (onAccountUpdated) {
            onAccountUpdated();
          }
        }}
      />
      <AccountDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        accountId={account.userId || ""}
        accountName={account.name}
        onDeleted={() => {
          if (onAccountUpdated) {
            onAccountUpdated();
          }
        }}
      />
    </>
  );
}
