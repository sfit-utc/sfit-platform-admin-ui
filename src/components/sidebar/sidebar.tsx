"use client";
import logo from "@/assets/icons/sfit-logo.svg";
import SideItem from "@/components/sidebar/side-item";
import HomeIcon from "@/assets/icons/home.svg";
import AccountIcon from "@/assets/icons/user-icon.svg";
import MemberIcon from "@/assets/icons/member.svg";
import TeamIcon from "@/assets/icons/team.svg";
import EventIcon from "@/assets/icons/event.svg";
import ClassIcon from "@/assets/icons/class.svg";
import TaskIcon from "@/assets/icons/task.svg";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SideBarProps {
  onActiveItemChange?: (itemName: string) => void;
}

export default function SideBar({ onActiveItemChange }: SideBarProps) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("home");

  const navDisplayNames: { [key: string]: string } = {
    home: "Trang chủ",
    account: "Quản lí thành viên",
    team: "Quản lí ban",
    event: "Quản lí sự kiện",
    class: "Quản lí lớp học",
    task: "Quản lí nhiệm vụ",
  };

  // Sync active item with current route
  useEffect(() => {
    const currentPath = pathname.split("/")[1] || "home"; // Get the first segment of the path
    setActiveItem(currentPath);

    if (onActiveItemChange) {
      onActiveItemChange(navDisplayNames[currentPath] || navDisplayNames.home);
    }
  }, [pathname, onActiveItemChange]);

  const handleItemClick = (nav: string) => {
    setActiveItem(nav);

    if (onActiveItemChange) {
      onActiveItemChange(navDisplayNames[nav] || nav);
    }
  };

  return (
    <div
      className="xl:pl-4 xl:min-w-1/6 min-h-full rounded-[3px] flex flex-col fixed top-0 left-0 z-50"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
      }}
    >
      <div className="flex items-center p-5">
        <img src={logo.src} alt="logo" className="w-10 h-10" />
        <div
          className="hidden xl:block ml-4 text-center text-3xl font-bold font-['Oswald']"
          style={{ color: "var(--sidebar-text)" }}
        >
          SFIT
        </div>
      </div>
      <div className="flex-1 ">
        <SideItem
          name={"TRANG CHỦ"}
          icon={HomeIcon.src}
          nav={"home"}
          isActive={activeItem === "home"}
          onClick={() => handleItemClick("home")}
        />
        <SideItem
          name={"THÀNH VIÊN"}
          icon={MemberIcon.src}
          nav={"member"}
          isActive={activeItem === "member"}
          onClick={() => handleItemClick("member")}
        />
        <SideItem
          name={"BAN"}
          icon={TeamIcon.src}
          nav={"team"}
          isActive={activeItem === "team"}
          onClick={() => handleItemClick("team")}
        />
        <SideItem
          name={"SỰ KIỆN"}
          icon={EventIcon.src}
          nav={"event"}
          isActive={activeItem === "event"}
          onClick={() => handleItemClick("event")}
        />
        <SideItem
          name={"LỚP HỌC"}
          icon={ClassIcon.src}
          nav={"class"}
          isActive={activeItem === "class"}
          onClick={() => handleItemClick("class")}
        />
        <SideItem
          name={"NHIỆM VỤ"}
          icon={TaskIcon.src}
          nav={"task"}
          isActive={activeItem === "task"}
          onClick={() => handleItemClick("task")}
        />
        <SideItem
          name={"NGƯỜI DÙNG"}
          icon={AccountIcon.src}
          nav={"account"}
          isActive={activeItem === "account"}
          onClick={() => handleItemClick("account")}
        />
      </div>
    </div>
  );
}
