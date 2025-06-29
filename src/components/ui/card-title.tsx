"use client";

import React from "react";

interface CardTitleProp {
  children: React.ReactNode;
  className?: string;
}

export default function CardTitle({ className, children }: CardTitleProp) {
  return (
    <h2
      className={`${className} border-b border-black/20 text-2xl font-bold pb-1 mb-4`}
    >
      {children}
    </h2>
  );
}
