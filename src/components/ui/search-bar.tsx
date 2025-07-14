"use client";
import { useState, useCallback } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  debounceMs?: number;
  initialValue?: string;
  showIcon?: boolean;
}

export default function SearchBar({
  placeholder = "Tìm kiếm...",
  onSearch,
  className = "",
  debounceMs = 300,
  initialValue = "",
  showIcon = true,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(value);
        }, debounceMs);
      };
    })(),
    [onSearch, debounceMs]
  );

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        className="w-full pl-4 pr-10 h-9 bg-green-50 rounded-[20px] text-green-800 placeholder-green-800 outline-green-800 focus:ring-2 focus:ring-green-300 focus:border-transparent"
        style={{
          backgroundColor: "var(--search-bg)",
        }}
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
      />

      {showIcon && (
        <div className="absolute right-2 top-1/2 -translate-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            className="text-green-600"
          >
            <title>search</title>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="Icon-Set"
                transform="translate(-256, -1139)"
                fill="currentColor"
              >
                <path
                  d="M269.46,1163.45 C263.17,1163.45 258.071,1158.44 258.071,1152.25 C258.071,1146.06 263.17,1141.04 269.46,1141.04 C275.75,1141.04 280.85,1146.06 280.85,1152.25 C280.85,1158.44 275.75,1163.45 269.46,1163.45 Z M287.688,1169.25 L279.429,1161.12 C281.591,1158.77 282.92,1155.67 282.92,1152.25 C282.92,1144.93 276.894,1139 269.46,1139 C262.026,1139 256,1144.93 256,1152.25 C256,1159.56 262.026,1165.49 269.46,1165.49 C272.672,1165.49 275.618,1164.38 277.932,1162.53 L286.224,1170.69 C286.629,1171.09 287.284,1171.09 287.688,1170.69 C288.093,1170.3 288.093,1169.65 287.688,1169.25 Z"
                  id="search"
                />
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
