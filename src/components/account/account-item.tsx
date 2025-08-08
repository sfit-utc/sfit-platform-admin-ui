"use client";
import { Account } from "@/types/account";
import { useState, useRef, useEffect } from "react";
import Avatar from "@/assets/icons/user.svg";
import { SquarePen, Trash, User } from "lucide-react";
import DetailModal from "@/components/ui/detail-modal";
import EditModal from "@/components/ui/edit-modal";
import DeleteModal from "@/components/ui/delete-modal";
interface AccountItemProps {
  account: Account;
  style?: string;
}

export default function AccountItem({ account, style }: AccountItemProps) {
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "Quản trị viên":
        return "text-purple-600 font-bold bg-purple-100";

      case "Người kiểm duyệt":
        return "text-red-600 font-bold bg-red-100";

      case "Người dùng":
        return "text-green-700 bg-green-100";
    }
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTeamsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const firstTeam = account.teams[0];
  const hasMultipleTeams = account.teams.length > 1;

  if (style === "line") {
    return (
      <div
        className="flex justify-between items-center py-4 border-2 my-2"
        style={{
          color: "var(--foreground)",
          backgroundColor: "var(--background)",
        }}
      >
        <div className="flex-2 text-center font-bold text-2xl">
          {account.id}
        </div>
        <div className="flex-5 text-left font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          {account.name}
        </div>
        <div className="flex-3 text-left relative" ref={dropdownRef}>
          {/* Styled Dropdown Button */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold whitespace-nowrap"
            onClick={() =>
              hasMultipleTeams && setShowTeamsDropdown(!showTeamsDropdown)
            }
            disabled={!hasMultipleTeams}
          >
            <span>{firstTeam}</span>
            {hasMultipleTeams && (
              <svg
                className="w-4 h-4 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </button>

          {/* Teams Dropdown Popup */}
          {showTeamsDropdown && hasMultipleTeams && (
            <div
              className="absolute top-full left-0 mt-1 border border-gray-200 rounded-md shadow-lg z-10 min-w-full"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              <div className="p-1">
                {account.teams.map((team) => (
                  <div
                    key={team}
                    className="py-1 px-3 hover:bg-amber-50 rounded text-sm cursor-pointer"
                  >
                    {team}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-3 flex justify-center items-center">
          <div
            className={`text-center py-1 px-4 w-fit ${getRoleStyle(
              account.role
            )} rounded-full text-sm font-semibold whitespace-nowrap`}
          >
            {account.role}
          </div>
        </div>
        <div className="flex-2 flex justify-center items-center">
          <div className="text-center py-1 px-4 w-fit bg-blue-100 text-blue-600 rounded-full text-sm font-semibold whitespace-nowrap">
            {account.class}
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
        {/* Modals */}
        <DetailModal
          open={openView}
          onClose={() => setOpenView(false)}
          memberId={account.id}
        />
        <EditModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          memberId={account.id}
        />
        <DeleteModal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          memberId={account.id}
        />
      </div>
    );
  }

  // Box view
  return (
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
            {account.id}
          </div>
        </div>

        <div className="mb-3 flex flex-col justify-center items-center">
          <img
            src={Avatar.src || account.avatar}
            alt={account.name}
            className="w-24 h-24 rounded-full"
          />
          <h3 className="text-lg font-semibold mt-2 text-center">
            {account.name}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Chức vụ:</span>
            <span
              className={`${getRoleStyle(
                account.role
              )} px-2 py-1 rounded text-sm`}
            >
              {account.role}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Lớp:</span>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
              {account.class}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ban:</span>
            <div className="flex flex-wrap gap-1">
              {account?.teams?.map((team, index) => (
                <span
                  key={index}
                  className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm"
                >
                  {team}
                </span>
              ))}
            </div>
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
      <DetailModal
        open={openView}
        onClose={() => setOpenView(false)}
        memberId={account.id}
      />
      <EditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        memberId={account.id}
      />
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        memberId={account.id}
      />
    </div>
  );
}
