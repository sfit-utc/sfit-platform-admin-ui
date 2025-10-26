"use client";
import UserRegisterList from "@/components/course/register-section/user-register-list";
import { useCourseService } from "@/hooks/use-course-service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const { id } = useParams();
  const { getCourseDetailByID } = useCourseService();
  const [courseDetail, setCourseDetail] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (id) {
        const detail = await getCourseDetailByID(id as string);
        setCourseDetail(detail as any);
      }
    }
    fetchDetail();
  }, [id, getCourseDetailByID]);

  if (!courseDetail) return <div>Đang tải...</div>;

  return (
    <UserRegisterList
      selectedCourse={courseDetail}
      onBack={() => window.history.back()}
    />
  );
}