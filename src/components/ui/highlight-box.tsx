"use client";

import React from "react";

interface StatusProp {
  children: React.ReactNode;
  color?: keyof typeof statusColor | undefined;
  className?: string;
}

const statusColor = {
  red: "bg-sfit-red-light text-sfit-red",
  yellow: "bg-sfit-yellow-light text-sfit-yellow",
  green: "bg-sfit-green-light text-sfit-green",
  blue: "bg-sfit-blue-light text-sfit-blue",
};

export type StatusColorKey = keyof typeof statusColor;

export default function HighlightBox({ children, color, className }: StatusProp) {
  const colorClass = color ? statusColor[color] : "";

  return (
    <div
      className={`${colorClass} ${className} rounded-4xl px-2 flex justify-center items-center`}
    >
      {children}
    </div>
  );
}
