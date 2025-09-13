import { Event } from "@/types/event";
import { useEffect } from "react";

interface EventItemProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onInfo?: (eventId: string) => void;
  onAttendance?: (eventId: string) => void;
}

export default function EventItem({
  event,
  onRegister,
  onInfo,
  onAttendance,
}: EventItemProps) {
  const handleRegister = () => {
    if (onRegister && event.id) {
      onRegister(event.id);
    }
  };
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      " " +
      pad(date.getDate()) +
      "/" +
      pad(date.getMonth() + 1) +
      "/" +
      date.getFullYear()
    );
  };
  const handleInfo = () => {
    if (onInfo && event.id) {
      onInfo(event.id);
    }
  };

  const handleAttendance = () => {
    if (onAttendance && event.id) {
      onAttendance(event.id);
    }
  };
  const isOngoing = event.status === "ONGOING";
  const isPast = event.status === "COMPLETED";
  const isUpcoming = event.status === "UPCOMING";
  return (
    <div 
      className="px-11 py-6 m-2 w-full border-2 bg-white rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
      style={{
        backgroundColor: "var(--search-bg)",
      }}
    >
      <h1 className="text-3xl font-semibold font-inter">{event.title}</h1>
      <div className="text-red-600 text-xl font-normal font-inter">
        Thời gian diễn ra: {formatDateTime(event.begin_at)}
      </div>
      <div className="text-red-600 text-xl font-normal font-inter">
        Địa điểm: {event.location}
      </div>
      <div className="text-red-600 text-xl font-normal font-inter">
        Số lượng tham dự: {event.max_people}
      </div>
      <div className="text-red-600 text-xl font-normal font-inter">
        Yêu cầu về sự kiện: {event.description}
      </div>
      <div className="flex justify-between gap-4 mt-4">
        {isOngoing && (
          <>
            <button
              onClick={handleInfo}
              className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-green-800 transition-colors"
            >
              Thông tin đăng ký
            </button>
            <button
              onClick={handleAttendance}
              className="cursor-pointer px-3 h-9 bg-blue-600 rounded-[5px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-blue-700 transition-colors"
            >
              Điểm danh
            </button>
          </>
        )}

        {isUpcoming && (
          <>
            <button
              onClick={handleRegister}
              className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-green-800 transition-colors"
            >
              Đăng ký
            </button>
          </>
        )}

        {isPast && (
          <>
            <button
              onClick={handleAttendance}
              className="cursor-pointer w-52 h-9 bg-blue-600 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-blue-700 transition-colors"
            >
              Xem điểm danh
            </button>
          </>
        )}
      </div>
    </div>
  );
}
