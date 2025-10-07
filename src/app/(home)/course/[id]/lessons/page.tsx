"use client"
import LessonList from "@/components/course/lesson/lesson-list";
import { useCourseService } from "@/hooks/use-course-service";
import { CourseDetailResponse } from "@/types/course";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LessonsPage() {
  const { id } = useParams();
  const { getCourseDetailByID } = useCourseService();
  const [courseDetail, setCourseDetail] = useState<CourseDetailResponse | undefined>(undefined);

  useEffect(() => {
    async function fetchDetail() {
      if (id) {
        const detail = await getCourseDetailByID(id as string);
        setCourseDetail(detail);
      }
    }
    fetchDetail();
  }, [id, getCourseDetailByID]);
  console.log(id);
  if (!courseDetail) return <div>Đang tải...</div>;

  return (
    <LessonList
      selectedCourse={courseDetail}
      onBack={() => window.history.back()}
    />
  );
}