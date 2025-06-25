"use client";

import Link from "next/link";
import React from "react";

interface DashboardActionProp {
  className?: string;
  children?: string;
  icon?: React.ReactNode;
  href?: string;
  number?: number;
}

export default function DashboardAction({
  className,
  children,
  icon,
  href,
  number,
}: DashboardActionProp) {
  const content = (
    <>
      <div className="mt-2">{children}</div>
    </>
  );

  if (!href || href === "") {
    return (
      <div
        className={`${className} text-center rounded-2xl shadow cursor-pointer text-xl`}
      >
        <div className="flex justify-center text-3xl font-bold -mb-2">
          {number}
        </div>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} text-center rounded-2xl shadow cursor-pointer text-xl`}
    >
      <div className="flex justify-center">{icon}</div>
      {content}
    </Link>
  );
}
