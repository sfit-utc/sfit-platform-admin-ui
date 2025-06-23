"use client";

import Link from "next/link";
import React from "react";

interface DashboardActionProp {
  className?: string;
  children?: string;
  icon?: React.ReactNode;
  href: string;
}

export default function DashboardAction({
  className,
  children,
  icon,
  href,
}: DashboardActionProp) {
  return (
    <Link
      href={href}
      className={`${className} text-center rounded-2xl shadow cursor-pointer text-xl`}
    >
      <div className="flex justify-center">{icon}</div>
      <div className="mt-2">{children}</div>
    </Link>
  );
}
