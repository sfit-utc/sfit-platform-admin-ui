"use client";

import ClassItem from "@/components/home/ClassItem";
import EventItem from "@/components/home/EventItem";
import TaskItem from "@/components/ui/TaskItem";
import Card from "@/components/ui/card";
import DashboardAction from "@/components/ui/dashboard-action";
import HighlightBox from "@/components/ui/highlightBox";
import {
  useClass,
  useNearTask,
  useStartedEvent,
  useUpcomingEvents,
  useWeekClasses,
} from "@/hooks/useHomeService";
import {
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Plus,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const dashboardActions = [
  {
    icon: <CalendarCheck />,
    children: "Điểm danh sự kiện",
    textColor: "text-sfit-blue",
    bgColor: "bg-sfit-blue-light ",
    href: "/roll-up",
  },
  {
    icon: <GraduationCap />,
    children: "Tạo lớp học",
    textColor: "text-sfit-green",
    bgColor: "bg-sfit-green-light ",
    href: "/create-class",
  },
  {
    icon: <ClipboardList />,
    children: "Giao nhiệm vụ",
    textColor: "text-sfit-purple",
    bgColor: "bg-sfit-purple-light ",
    href: "/add-task",
  },
  {
    icon: <UsersRound />,
    children: "Thêm thành viên",
    textColor: "text-sfit-yellow",
    bgColor: "bg-sfit-yellow-light ",
    href: "/add-member",
  },
];

export default function Home() {
  const { data: nearTasks, loading: loadingNearTasks } = useNearTask();
  const { data: upcomingEvents, loading: loadingUpcomingEvents } =
    useUpcomingEvents();
  const { data: classes, loading: loadingClasses } = useClass();
  const { data: eventStarted, loading: loadingeventStarted } =
    useStartedEvent();
  const { data: timeline } = useWeekClasses();

  useEffect(() => {}, []);

  return (
    <div className="bg-white w-full p-5">
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
      <div className="grid md:grid-cols-[2fr_1fr] text-black mt-5 gap-x-5 gap-y-3">
        <Card
          title="Nhiệm vụ gần đây"
          className="relative"
          loading={loadingNearTasks}
        >
          <div className="grid grid-cols-1 gap-2.5 max-h-80 overflow-auto blur-xs">
            {nearTasks.map(({ title, expired, percentComplete }, index) => (
              <TaskItem
                key={index}
                title={title}
                expired={expired}
                percentComplete={percentComplete}
              />
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-1/2">
            Đang phát triển...
          </div>
        </Card>
        <Card
          title="Sự kiện sắp diễn ra"
          className="relative"
          loading={loadingUpcomingEvents}
        >
          <div className="flex flex-col gap-2.5 h-full max-h-80 overflow-auto">
            {upcomingEvents.map(
              ({ eventTitle, when, howManyPeople }, index) => (
                <EventItem
                  key={index}
                  eventTitle={eventTitle}
                  when={when}
                  howManyPeople={howManyPeople}
                />
              )
            )}
            <div className="absolute h-14 w-14 rounded-full bg-sfit-blue right-3 bottom-3 flex justify-center items-center z-10">
              <Link href="/event">
                <Plus className="text-white size-10" />
              </Link>
            </div>
          </div>
        </Card>
        <Card
          loading={loadingClasses}
          title={
            <div className="flex justify-between">
              Các lớp học trong tuần
              <HighlightBox className="text-xs font-medium" color={"blue"}>
                {timeline}
              </HighlightBox>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-3.5 max-h-72 overflow-auto">
            {classes.map(({ className, when, teacher, status }, index) => (
              <ClassItem
                key={index}
                name={className}
                when={when}
                teacher={teacher}
                status={status}
              />
            ))}
          </div>
        </Card>
        <Card title="Sự kiện diễn ra gần đây" loading={loadingeventStarted}>
          <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-auto">
            {eventStarted.map(
              ({ eventTitle, when, howManyPeople, status }, index) => (
                <EventItem
                  key={index}
                  eventTitle={eventTitle}
                  when={when}
                  howManyPeople={howManyPeople}
                  status={status}
                />
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
