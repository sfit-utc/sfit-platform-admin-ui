import React from "react";

interface PanelProp {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function Panel({ className, title, children }: PanelProp) {
  const classN = className || "";
  return (
    <div className={`${classN} shadow px-4 py-2.5 rounded-md`}>
      <div className="mb-5 font-semibold">{title}</div>
      <div className="">{children}</div>
    </div>
  );
}
