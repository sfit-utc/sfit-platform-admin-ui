"use client";
import { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";

interface NavBarProps {
  activeTitle?: string;
}

export default function NavBar({ activeTitle = "Trang chủ" }: NavBarProps) {
  // Dark mode state and effect
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setIsDark(saved === "dark");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  }, []);

  const handleSearch = useCallback((value: string) => {}, []);

  return (
    <div
      className="sticky top-0 z-50 w-full h-14 flex justify-content items-center"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="flex-2/3 flex justify-between items-center mr-2">
        <div className="flex items-center ml-8">
          <div
            className="w-44 h-6 justify-center text-xl font-normal"
            style={{ color: "var(--foreground)" }}
          >
            {activeTitle}
          </div>
        </div>

        {(activeTitle == "Trang chủ" || activeTitle == "Quản lí nhiệm vụ") && (
          <SearchBar
            placeholder="Search"
            onSearch={handleSearch}
            className="w-96"
          />
        )}
      </div>

      <div className="flex-1/3 flex justify-between items-center w-full h-full">
        <div className="relative">
          <div className="absolute top-0 right-0 rounded-full bg-red-500 w-2 h-2"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0_15_159)">
              <rect width="24" height="24" fill="var(--navbar-bg)" />
              <path
                d="M9.5 19C8.89555 19 7.01237 19 5.61714 19C4.87375 19 4.39116 18.2177 4.72361 17.5528L5.57771 15.8446C5.85542 15.2892 6 14.6774 6 14.0564C6 13.2867 6 12.1434 6 11C6 9 7 5 12 5C17 5 18 9 18 11C18 12.1434 18 13.2867 18 14.0564C18 14.6774 18 15.2892 18.4223 15.8446L19.2764 17.5528C19.6088 18.2177 19.1253 19 18.382 19H14.5M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19"
                stroke="var(--foreground)"
                strokeLinejoin="round"
              />
              <path
                d="M12 5V3"
                stroke="var(--foreground)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_15_159">
                <rect width="24" height="24" fill="var(--navbar-bg)" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <button
          onClick={toggleTheme}
          className={`mx-4 p-2 rounded-full transition-colors ${
            isDark
              ? "bg-sfit-green hover:bg-gray-300"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 19.95l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-sfit-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          )}
        </button>
        <div className="text-black flex justify-center items-center mr-6">
          <div className="flex flex-col text-right *:font-montserrat ">
            <div className="text-base" style={{ color: "var(--foreground)" }}>
              Nam Khúc
            </div>
            <div className="text-xs" style={{ color: "var(--foreground)" }}>
              Thành viên
            </div>
          </div>
          <div className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
            >
              <rect width="37" height="37" fill="var(--navbar-bg)" />
              <circle
                cx="18.5"
                cy="13"
                r="6"
                stroke="var(--foreground)"
                strokeWidth="2"
                fill="none"
              />
              <ellipse
                cx="18.5"
                cy="27"
                rx="10"
                ry="6"
                stroke="var(--foreground)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
