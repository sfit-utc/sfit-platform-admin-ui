"use client";
import LessonAttendentList from "@/components/course/lesson-attendent/lesson-attendent-list";
import { useParams } from "next/navigation";

export default function LessonAttendentPage() {
  const { id, lessonId} = useParams();
    console.log(id);
    console.log(lessonId);

  if (!id || !lessonId) return <div>Không tìm thấy thông tin bài giảng.</div>;

  return (
    <LessonAttendentList
      lessonId={lessonId as string}
      moduleId={id as string}
      onBack={() => window.history.back()}
    />
  );
}