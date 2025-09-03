import { useEventService } from "@/hooks/use-event-service";
import EventItem from "@/components/event/event-item";
import Loading from "@/components/ui/loading";
import { EventStatus } from "@/types/event";
import { useEffect } from "react";

interface EventListProps {
  status?: EventStatus;
  searchTerm?: string;
}

export default function EventList({ status, searchTerm }: EventListProps) {
  const {
    events,
    loading,
    error,
    registerForEvent,
    fetchEvents,
  } = useEventService();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") || "" : "";

  useEffect(() => {
    fetchEvents({
      page: 1,
      pageSize: 20,
      title: searchTerm,
      status: status,
    });
  }, [searchTerm, status, fetchEvents]);

  const handleRegister = async (eventId: string) => {
    try {
      if (!userId) {
        alert("Bạn cần đăng nhập để đăng ký sự kiện!");
        return;
      }
      await registerForEvent(eventId, userId);
      alert("Đăng ký thành công!");
    } catch (error) {
      alert(
        "Đăng ký thất bại: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleInfo = (eventId: string) => {
    console.log("Show info for event:", eventId);
  };

  const handleAttendance = (eventId: string) => {
    console.log("Mark attendance for event:", eventId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Lỗi: {error}</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        {searchTerm ? "Không tìm thấy sự kiện phù hợp" : "Không có sự kiện nào"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          onRegister={handleRegister}
          onInfo={handleInfo}
          onAttendance={handleAttendance}
        />
      ))}
    </div>
  );
}