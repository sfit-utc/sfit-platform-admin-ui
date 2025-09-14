import { useEventService } from "@/hooks/use-event-service";
import EventItem from "@/components/event/event-item";
import Loading from "@/components/ui/loading";
import { useEffect } from "react";
import { EventStatus } from "@/types/event";
interface EventListProps {
  status?: EventStatus;
  searchTerm?: string;
  onChange?: ()=> void;
}

export default function EventList({ status, searchTerm, onChange }: EventListProps) {
  // const { events, loading, error, fetchEvents } = useEventServ ice();
// export default function EventList({ status, searchTerm, onChange }: EventListProps) {
  const { events, loading, error, fetchEvents } =
    useEventService();

  useEffect(() => {
    fetchEvents({
      page: 1,
      page_size: 20,
      status: status ? status.toUpperCase() : undefined,
    });
  }, [status, fetchEvents]);
  const handleRegister = async (eventId: string) => {
    try {
      // You would typically get userId from auth context
      const userId = 1; // Replace with actual user ID
      // await registerForEvent(eventId, userId);
      alert("Đăng ký thành công!");
    } catch (error) {
      alert(
        "Đăng ký thất bại: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleInfo = (eventId: string) => {
    // Navigate to event details or show modal
  };

  const handleAttendance = (eventId: string) => {
    // Handle attendance logic
  };

  // Filter events based on status and search term
  const filteredEvents = events.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
          status= {status}
          onRegister={handleRegister}
          onInfo={handleInfo}
          onAttendance={handleAttendance}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
