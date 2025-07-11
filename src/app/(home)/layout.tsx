"use client";

import NavBar from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar/sidebar";
import Line from "@/components/ui/line";
import { useState } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTitle, setActiveTitle] = useState("Trang chủ");

  const handleActiveItemChange = (itemName: string) => {
    setActiveTitle(itemName);
  };

  return (
    <div className="flex relative">
      <SideBar onActiveItemChange={handleActiveItemChange} />
      <div
        className="px-8 pb-10 flex-col w-full min-h-full bg-white absolute top-0 z-50 right-0 max-w-5/6"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <NavBar activeTitle={activeTitle} />
        <Line />
        {children}
      </div>
    </div>
  );
}
