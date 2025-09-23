"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

interface DashboardActionProp {
  className?: string;
  children?: string;
  icon?: React.ReactNode;
  href?: string;
  number?: number;
  style?: React.CSSProperties;
  onDelete?: () => void;
  showMenu?: boolean;
}

export default function DashboardAction({
  className,
  children,
  icon,
  href,
  number,
  style,
  onDelete,
  showMenu = false,
}: DashboardActionProp) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const content = (
    <>
      <p className="mt-2">{children}</p>
    </>
  );

  const actionContent = (
    <div className="relative">
      <div className="flex justify-center">{icon}</div>
      {content}
      {showMenu && (
        <div className="absolute top-2 right-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1 rounded hover:bg-black hover:bg-opacity-10"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-6 bg-white border rounded shadow-lg z-50"
              style={{ borderColor: "var(--sfit-gray-200)" }}
            >
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.();
                  setShowDropdown(false);
                }}
              >
                Xóa nhóm
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!href || href === "") {
    return (
      <div
        className={`${className} text-center rounded-2xl shadow cursor-pointer text-xl`}
        style={style}
      >
        <span className="flex justify-center text-3xl font-bold -mb-2">
          {number}
        </span>
        {actionContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} text-center rounded-2xl shadow cursor-pointer text-xl`}
      style={style}
    >
      {actionContent}
    </Link>
  );
}
