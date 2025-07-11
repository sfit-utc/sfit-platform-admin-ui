"use client";
import { Account } from "@/types/account";
import { useState, useRef, useEffect } from "react";
import Avatar from "@/assets/icons/user.svg";
interface AccountItemProps {
  account: Account;
  style?: string;
}

export default function AccountItem({ account, style }: AccountItemProps) {
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "Chủ nhiệm":
        return "text-purple-600 font-bold bg-purple-100";
      case "Phó CN":
        return "text-pink-500 font-semibold bg-pink-100";
      case "Trưởng ban":
        return "text-red-600 font-bold bg-red-100";
      case "Phó ban":
        return "text-orange-500 font-semibold bg-orange-100";
      case "Thành viên":
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
        <div className="flex-1 cursor-pointer flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="31"
            height="32"
            viewBox="0 0 31 32"
            fill="none"
          >
            <rect
              y="0.5"
              width="31"
              height="31"
              fill="url(#pattern0_1070_155)"
            />
            <defs>
              <pattern
                id="pattern0_1070_155"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0_1070_155" transform="scale(0.01)" />
              </pattern>
              <image
                id="image0_1070_155"
                width="100"
                height="100"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>
        <div className="flex-1 cursor-pointer flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <rect width="28" height="28" fill="url(#pattern0_1070_151)" />
            <defs>
              <pattern
                id="pattern0_1070_151"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0_1070_151" transform="scale(0.01)" />
              </pattern>
              <image
                id="image0_1070_151"
                width="100"
                height="100"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwklEQVR4nO2dS6hNURzGt7xmjCRRDMnAK8mrFClFkkKUmYEwkQxdE2WgONRZ37f2vQOv4iTmlFcxZWLkNUDJQLnEjXK1co+O6+5z9vOc5azvV3t2zv+stX/nv15777WjSAghhBBCCCGEd9RqtRkAtllr98VxvKjX5QkakmsAvCE52nK8BHCuXq8v63X5gsIYsxbA8DgZfx0AHlpr1/e6rH2PSSFj3NEYGhqa1ety9yUmu4xmtrwHsLHX5e/HPmM4q4yW44e19kCv6xF0ZvDfTPlpjNnf6/qEIOMWyfMkX6QQ813NV7WjqSuNRmNy8zsktwB40qlPUUffBRlNSE4FgE6jr6xlChZTQEYrJI93kLKue7UKXEaTdpkC4P6fD4rqZTSbL5JPk+JZa5emjRUUpgIZrR19m7hnq6lR/w9tb+eR0aTNkPhFubUJZNIH4BvJzXl/Z2yekhR/Ybm1CmQGjpxSXGYBuNkm9t4odEz+hcJMUsZkXGkX01q7KwoZU3BtKq2UNDIAfCA5MwoVk3I0RdIUkZJSxrArTxQqTLGEDuD6wMDAlNHR0UkALnTIlhFr7dYEGZc6/M4XY8yGKFSYQUbzO3mkSEZFMvJIkYwuzcCdFJL1FH3KbfUZFWVGzkxRn9ENGUWlqANn+TLySpEMVicjqxTJYPUyHBpNpUAyPILKDH+gZPgDJcMfKBn+QMnwB0qGP1Ay/IGS4Q+UDH+QDI+QjP/vmb5rWiiUjLBQZniEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEtXYeyY8droFfLrLFkUM7JKQEwIBkeATJe7o7xBPcrTgkPyfdqqNmqsvEcbyiTXasLBJbD1jmgOThBBlfG43GtCgnkpETklcThDzIG1MyCkDydYKQ03niSUYBSM5J6j+MMduzxpOMgpDcmSQkjuPZWWJJRgmQPJOwhcXzLHEkoyRIPk7IkItpY0hGSdRqteljO6lNJORgyo3qV7nJY4cNY4aD3r0zy+pumw59yQSfn0lyE8mTAO64eYq2OCoRkseS/tFuQmitXexegsXfPHMvxUq78Zf2m8oBgBsJJ9I1Y5+ynHw1UyVA8m2Rk67MKBFjzIIqZLiLXOrAcwBgd4kS3NL9XZInjDFz85QneAAcKdAkvXKbFwM45F51XfTRZtH5GkjrMQLgkZvRW2t3uLUvncCKIHlqgn//Ozf6AnAUwGo3eazq98UEkFw+doFqz+Dg4HydJCGEEEIIIYSI+oJfm/8/Fy7JNMoAAAAASUVORK5CYII="
              />
            </defs>
          </svg>
        </div>
        <div className="flex-1 cursor-pointer flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="25"
            height="26"
            viewBox="0 0 25 26"
            fill="none"
          >
            <rect
              y="0.5"
              width="25"
              height="25"
              fill="url(#pattern0_1070_169)"
            />
            <defs>
              <pattern
                id="pattern0_1070_169"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0_1070_169" transform="scale(0.01)" />
              </pattern>
              <image
                id="image0_1070_169"
                width="100"
                height="100"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>
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
          <h3
            className="my-3 font-semibold text-lg mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {account.name}
          </h3>
          <div className="text-sm" style={{ color: "var(--foreground)" }}>
            Email : {account.email || "Chưa có"}
          </div>
          <div
            className={` my-3 text-center py-1 px-4 w-fit rounded-full text-sm font-semibold whitespace-nowrap ${getRoleStyle(
              account.role
            )}`}
          >
            {account.role}
          </div>
          <div className="mb-3 flex flex-wrap gap-1 justify-center items-center">
            {account.teams.map((team) => (
              <button
                key={team}
                type="button"
                className=" bg-amber-50 text-amber-800 text-center py-1 px-4 w-fit rounded-full text-sm font-semibold whitespace-nowrap"
              >
                <span>Ban {team}</span>
              </button>
            ))}
          </div>
          <div className="text-center py-1 px-4 w-fit bg-blue-100 text-green-600 rounded-full text-sm font-semibold whitespace-nowrap">
            {account.class}
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex justify-center space-x-2 mb-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 31 32"
              fill="none"
            >
              <rect
                y="0.5"
                width="31"
                height="31"
                fill="url(#pattern0_1070_155)"
              />
              <defs>
                <pattern
                  id="pattern0_1070_155"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1070_155" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1070_155"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              fill="none"
              height={24}
              width={24}
              stroke="var(--foreground)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-red-50 rounded-full">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              height={24}
              width={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <div className=" text-black w-full text-center py-1 px-4 bg-green-100 rounded-full text-sm font-semibold whitespace-nowrap">
          Trạng thái: {account.status || "Chưa cập nhật"}
        </div>
      </div>
    </div>
  );
}
