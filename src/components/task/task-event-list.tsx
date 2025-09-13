import { useEffect, useState, useRef } from "react";
import { useEventService } from "@/hooks/use-event-service";
import Loading from "../ui/loading";
import TaskCard from "../ui/card-task";
import { useTaskService } from "@/hooks/use-task-service";
import Task from "./task";

interface TaskEventListProps {
    status?: "ALL" | "ONGOING" | "UPCOMING" | "COMPLETED";
    onTaskChanged?: () => void;
}

const getTaskStatus = (task: any) => {
    if (task.percentComplete === 100) return "COMPLETED";
    if (task.percentComplete === 0) return "UPCOMING";
    return "ONGOING";
};


export default function TaskEventList({ status = "ALL", onTaskChanged }: TaskEventListProps) {
    const { events, fetchEvents, loading: loadingEvents } = useEventService();
    const { fetchTasksByEventID, loading, error } = useTaskService();
    const [eventTasks, setEventTasks] = useState<{ event: any, tasks: any[] }[]>([]);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    console.log(status);
    useEffect(() => {
        fetchEvents({ page: 1, page_size: 10 });
    }, [fetchEvents]);

    useEffect(() => {
        const fetchAllTasks = async () => {
            const result: { event: any, tasks: any[] }[] = [];
            await Promise.all(
                events.map(async (event) => {
                    const res = await fetchTasksByEventID(event.id, { page: 1, page_size: 10 });
                    let filtered = res?.items || [];
                    if (status !== "ALL") {
                        filtered = filtered.filter((task) => getTaskStatus(task) === status);
                    }
                    if (filtered.length > 0) {
                        result.push({ event, tasks: filtered });
                    }
                })
            );
            setEventTasks(result);
        };
        if (events.length > 0) {
            fetchAllTasks();
        } else {
            setEventTasks([]);
        }
    }, [events, fetchTasksByEventID, status]);
    if (loadingEvents || loading) return <Loading />;
    if (eventTasks.length === 0)
        return (
            <div className="text-center py-12 text-xl font-semibold text-sfit-red-500 bg-red-50 rounded-lg shadow border border-red-200">
                Không có công việc nào.
            </div>
        );

    return (
        <div>
            {eventTasks.map(({ event, tasks }) => (
                <div
                    key={event.id}
                    className="rounded-xl shadow border border-gray-200 p-6 mt-2 mb-8"
                    style={{
                        backgroundColor: "var(--search-bg)",
                        color: "var(--foreground)",
                    }}
                >
                    <div className="title">
                        <h1 className="text-2xl font-bold mb-2  border-black border-b-[1.5px] p-2 flex justify-between items-center">
                            {editingEventId === event.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        className="border rounded px-2 py-1 "
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                // handleSaveEdit(event.id); // TODO: implement edit event
                                            }
                                            if (e.key === "Escape") setEditingEventId(null);
                                        }}
                                    />
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                        onClick={() => {
                                            // handleSaveEdit(event.id); // TODO: implement edit event
                                        }}
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-gray-300 rounded"
                                        onClick={() => setEditingEventId(null)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            ) : (
                                event.title
                            )}
                            <div className="flex">
                                <div
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
                                    onClick={() => {
                                        setEditingEventId(event.id);
                                        setEditingTitle(event.title);
                                        setTimeout(() => inputRef.current?.focus(), 100);
                                    }}
                                >
                                    {/* icon edit */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 28 28">
                                        <rect width="28" height="28" fill="#eee" />
                                        <path d="M7 21l2-7 7-7 5 5-7 7-7 2z" fill="#888" />
                                    </svg>
                                </div>
                                <div
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
                                    onClick={async () => {
                                        // TODO: implement delete event
                                    }}
                                >
                                    {/* icon delete */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 25 26">
                                        <rect y="0.5" width="25" height="25" fill="#eee" />
                                        <path d="M8 10h9v1H8v-1zm0 3h9v1H8v-1zm-1-7h11v1H7v-1zm2 10h7v1H9v-1z" fill="#e53e3e" />
                                    </svg>
                                </div>
                            </div>
                        </h1>
                    </div>
                    <p className="font-[570] mb-2  text-xl p-2">Danh sách nhiệm vụ</p>
                    <div className="space-y-4">
                        {tasks.map((task, idx) => (
                            <TaskCard
                                key={`${event.id}-${task.id ?? idx}`}
                                task={task}
                                onUpdated={onTaskChanged}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}