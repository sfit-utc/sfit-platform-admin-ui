import logo from "@/assets/icons/sfit-logo.png";
import SideItem from "./SideItem";
import homeIcon from "@/assets/icons/home.png";
import accountIcon from "@/assets/icons/account.png";
import teamIcon from "@/assets/icons/team.png";
import eventIcon from "@/assets/icons/event.png";
import classIcon from "@/assets/icons/class.png";
import taskIcon from "@/assets/icons/task.png";

export default function SideBar() {
  return (
    <div className=" pl-2 w-60 h-screen bg-green-800 rounded-[3px]">
      <div className="flex items-center p-5">
        <img src={logo.src} alt="logo" className="w-10 h-10" />
        <div className=" ml-4 text-center text-white text-3xl font-['Anton'] tracking-widest">
          SFIT
        </div>
      </div>
      <SideItem name={"TRANG CHỦ"} icon={homeIcon.src} nav={"home"} />
      <SideItem name={"THÀNH VIÊN"} icon={accountIcon.src} nav={"account"} />
      <SideItem name={"BAN"} icon={teamIcon.src} nav={"team"} />
      <SideItem name={"SỰ KIỆN"} icon={eventIcon.src} nav={"event"} />
      <SideItem name={"LỚP HỌC"} icon={classIcon.src} nav={"class"} />
      <SideItem name={"NHIỆM VỤ"} icon={taskIcon.src} nav={"task"} />
    </div>
  );
}
