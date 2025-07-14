import React from "react";

interface BoxProp {
  children?: React.ReactNode;
  className?: string;
}

export default function Box({ children, className }: BoxProp) {
  return (
    <div
      className={`${className} bg-sfit-box px-5 py-3.5 rounded-md`}
      style={{
        color: "var(--foreground)",
      }}
    >
      {children}
    </div>
  );
}
