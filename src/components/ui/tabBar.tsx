"use client";
import React from "react";

export interface TabBarTab {
  label: string;
  value: string | number;
  count?: number;
}

interface TabBarProps {
  tabs: TabBarTab[];
  activeValue: string | number;
  onTabChange: (value: string | number) => void;
  className?: string;
  endBar?: React.ReactNode;
}

export default function TabBar({
  tabs,
  activeValue,
  onTabChange,
  className = "",
}: TabBarProps) {
  return (
    <div className={`flex border-black bg-white ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`flex items-center px-4 py-2 font-semibold text-base border-b-2 transition-all
            ${
              activeValue === tab.value
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-700 hover:text-green-600"
            }
          `}
          style={{
            minWidth: 120,
            outline: "none",
            background: "none",
            cursor: "pointer",
          }}
          onClick={() => onTabChange(tab.value)}
        >
          <span>{tab.label}</span>
          {typeof tab.count === "number" && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
