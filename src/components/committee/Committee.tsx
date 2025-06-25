"use client";

import CommitteeItem from "@/components/committee/CommitteeItem";
import DashboardAction from "@/components/ui/dashboard-action";
import { useAllCommitteeInfor } from "@/hooks/useCommittee";
import { CalendarDays, ClipboardList, Plus, Star, Video } from "lucide-react";
import Link from "next/link";
import Loading from "@/components/ui/loading";

const dashboardActions = [
  {
    icon: <ClipboardList />,
    children: "Giao nhiệm vụ các ban",
    textColor: "text-sfit-purple",
    bgColor: "bg-sfit-purple-light ",
    href: "/add-task",
  },
  {
    icon: <CalendarDays />,
    children: "Lịch hoạt động",
    textColor: "text-sfit-green",
    bgColor: "bg-sfit-green-light ",
    href: "/action-calendar",
  },
  {
    icon: <Star />,
    children: "Đánh giá hoạt động",
    textColor: "text-sfit-blue",
    bgColor: "bg-sfit-blue-light ",
    href: "/action-check",
  },
  {
    icon: <Video />,
    children: "Họp câu lạc bộ",
    textColor: "text-sfit-yellow",
    bgColor: "bg-sfit-yellow-light",
    href: "/meeting-club",
  },
];

export default function Committee() {
  const { data: committeeItems, loading: loadCommittees } =
    useAllCommitteeInfor();

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-5">
        {dashboardActions.map(
          ({ icon, children, textColor, bgColor, href }) => (
            <DashboardAction
              key={children}
              href={href}
              className={`${textColor} ${bgColor} px-2 py-4`}
              icon={icon}
            >
              {children}
            </DashboardAction>
          )
        )}
      </div>
      {loadCommittees ? (
        <Loading className="mx-auto my-10 w-fit" size={48} />
      ) : (
        <div className="mt-5 grid lg:grid-cols-3 gap-4">
          {committeeItems.map(
            ({
              id,
              committeeName,
              headOfCommittee,
              description,
              numberOfMember,
              href,
            }) => (
              <CommitteeItem
                key={id}
                href={href}
                committeeName={committeeName}
                headOfCommittee={headOfCommittee}
                description={description}
                numberOfMember={numberOfMember}
              />
            )
          )}
        </div>
      )}
      <div className="ml-auto mr-3.5 my-3  h-14 w-14 rounded-full bg-sfit-blue flex justify-center items-center">
        <Link href="/add-committee">
          <Plus className="text-white size-10" />
        </Link>
      </div>
    </div>
  );
}
