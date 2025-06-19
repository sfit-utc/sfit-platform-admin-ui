"use client";
import logo from "@/assets/icons/sfit-logo.png";
import SideItem from "./SideItem";
import homeIcon from "@/assets/icons/home.png";
import accountIcon from "@/assets/icons/account.png";
import teamIcon from "@/assets/icons/team.png";
import eventIcon from "@/assets/icons/event.png";
import classIcon from "@/assets/icons/class.png";
import taskIcon from "@/assets/icons/task.png";
import { useState } from "react";

export default function SideBar() {
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (nav: string) => {
    setActiveItem(nav);
  };

  return (
    <div className="pl-4 w-72 min-h-screen bg-green-800 rounded-[3px] flex flex-col">
      <div className="flex items-center p-5">
        <img src={logo.src} alt="logo" className="w-10 h-10" />
        <div className="ml-4 text-center text-white text-3xl font-bold font-['Oswald']">
          SFIT
        </div>
      </div>
      <div className="flex-1">
        <SideItem
          name={"TRANG CHỦ"}
          icon={homeIcon.src}
          nav={"home"}
          isActive={activeItem === "home"}
          onClick={() => handleItemClick("home")}
        />
        <SideItem
          name={"THÀNH VIÊN"}
          icon={accountIcon.src}
          nav={"account"}
          isActive={activeItem === "account"}
          onClick={() => handleItemClick("account")}
        />
        <SideItem
          name={"BAN"}
          icon={teamIcon.src}
          nav={"team"}
          isActive={activeItem === "team"}
          onClick={() => handleItemClick("team")}
        />
        <SideItem
          name={"SỰ KIỆN"}
          icon={eventIcon.src}
          nav={"event"}
          isActive={activeItem === "event"}
          onClick={() => handleItemClick("event")}
        />
        <SideItem
          name={"LỚP HỌC"}
          icon={classIcon.src}
          nav={"class"}
          isActive={activeItem === "class"}
          onClick={() => handleItemClick("class")}
        />
        <SideItem
          name={"NHIỆM VỤ"}
          icon={taskIcon.src}
          nav={"task"}
          isActive={activeItem === "task"}
          onClick={() => handleItemClick("task")}
        />
      </div>
    </div>
  );
}
