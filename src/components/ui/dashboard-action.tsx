"use client";

import Link from "next/link";
import React from "react";

interface DashboardActionProp {
  className?: string;
  children?: string;
  icon?: React.ReactNode;
  href?: string;
  number?: number;
  style?: React.CSSProperties;
}

export default function DashboardAction({
  className,
  children,
  icon,
  href,
  number,
  style,
}: DashboardActionProp) {
  const content = (
    <>
      <p className="mt-2">{children}</p>
    </>
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
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} text-center rounded-2xl shadow cursor-pointer text-xl`}
      style={style}
    >
      <div className="flex justify-center">{icon}</div>
      {content}
    </Link>
  );
}
