"use client";

import NavBar from "@/components/NavBar/NavBar";
import SideBar from "@/components/SideBar/SideBar";
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
    <div className="flex overflow-x-scroll">
      <SideBar onActiveItemChange={handleActiveItemChange} />
      <div className="px-8 pb-10 flex-col w-full bg-white">
        <NavBar activeTitle={activeTitle} />
        <Line />
        {children}
      </div>
    </div>
  );
}
