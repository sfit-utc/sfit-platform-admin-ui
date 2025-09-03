import { useEventService } from "@/hooks/use-event-service";
import EventItem from "@/components/event/event-item";
import Loading from "@/components/ui/loading";
import { EventStatus, Event } from "@/types/event";
import { useEffect } from "react";

interface EventListProps {
  status?: EventStatus;
  searchTerm?: string;
}

export default function EventList({ status, searchTerm }: EventListProps) {
  const { events, loading, error, registerForEvent, fetchEvents } = useEventService();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") || "" : "";

  useEffect(() => {
    fetchEvents({
      page: 1,
      pageSize: 20,
      // title: searchTerm ?? "",
      // type: "",
      // status: status,
    });
  }, [searchTerm, status]);
  
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


  const safeEvents: Event[] = Array.isArray(events) ? events : [];

  const filteredEvents = safeEvents.filter((event: Event) => {
    const matchesStatus = !status || event.status === status;
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Lỗi: {error}</div>;
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        {searchTerm ? "Không tìm thấy sự kiện phù hợp" : "Không có sự kiện nào"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
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