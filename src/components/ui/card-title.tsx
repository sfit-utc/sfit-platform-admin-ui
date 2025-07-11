"use client";

import React from "react";

interface CardTitleProp {
  children: React.ReactNode;
  className?: string;
}

export default function CardTitle({ className, children }: CardTitleProp) {
  return (
    <h2
      className={`${className} text-2xl font-bold pb-1 mb-4`}
      style={{
        borderBottom: "1px solid var(--card-title-border)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </h2>
  );
}
