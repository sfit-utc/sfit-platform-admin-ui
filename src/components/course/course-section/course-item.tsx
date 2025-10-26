import Line from "@/components/ui/line";
import { Course, UpdateCourseRequest } from "@/types/course";
import { useState } from "react";
import { useCourseService } from "@/hooks/use-course-service";
import { useRouter } from "next/navigation";
import { useLessonService } from "@/hooks/use-lesson-service";

interface CourseItemProps {
  course: Course;
  // onShowLessons?: (courseId: string) => void;
}
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
export default function CourseItem({ course, onCourseDeleted }: CourseItemProps & { onCourseDeleted: () => void }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<UpdateCourseRequest>({});
  const [detail, setDetail] = useState<any>(null);
  const { getCourseDetailByID, loading, deleteCourse, updateCourse, deleteModule } = useCourseService();
  const { deleteLesson } = useLessonService();
  const handleShowDetail = async () => {
    setShowModal(true);
    const resp = await getCourseDetailByID(course.id);
    setDetail(resp);
    if (resp) {
      setEditData(resp);
    }

  };
  const handleEditChange = (field: keyof UpdateCourseRequest, value: string | string[]) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSaveChanges = async () => {
    try {
      await updateCourse(course.id, editData);
      alert("Cập nhật khóa học thành công!");
      setEditMode(false); // Tắt chế độ chỉnh sửa sau khi lưu
      setDetail(editData); // Cập nhật thông tin hiển thị
    } catch {
      alert("Cập nhật khóa học thất bại!");
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setDetail(null);
    setEditMode(false);
  };
  // const handleDeleteCourse = async (courseId: string) => {
  //   if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
  //     try {
  //       // Lấy chi tiết khóa học để truy cập course_content
  //       const courseDetail = await getCourseDetailByID(courseId);

  //       if (courseDetail && courseDetail.course_content) {
  //         // Lặp qua từng module trong course_content
  //         for (const module of courseDetail.course_content) {
  //           // Lặp qua từng bài học trong module và xóa
  //           for (const lesson of module.lessons || []) {
  //             await deleteLesson(module.id, lesson.id);
  //           }

  //           // Xóa module sau khi xóa hết bài học
  //           await deleteModule(module.id);
  //         }
  //       } else {
  //       }

  //       // Xóa khóa học
  //       await deleteCourse(courseId);

  //       onCourseDeleted(); // Gọi lại hàm sau khi xóa thành công
  //       alert("Xóa khóa học thành công!");
  //     } catch (error) {
  //       console.error("Lỗi khi xóa khóa học:", error);
  //       alert("Xóa khóa học thất bại!");
  //     }
  //   }
  // };
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      try {
        // Lấy chi tiết khóa học để truy cập course_content
        const courseDetail = await getCourseDetailByID(courseId);

        if (courseDetail && courseDetail.course_content) {
          // Lặp qua từng module trong course_content
          for (const courseModule of courseDetail.course_content) {
            // Lặp qua từng bài học trong module và xóa
            for (const lesson of courseModule.lessons || []) {
              await deleteLesson(courseModule.id, lesson.id);
            }

            // Xóa module sau khi xóa hết bài học
            await deleteModule(courseModule.id);
          }
        }

        // Xóa khóa học
        await deleteCourse(courseId);

        onCourseDeleted(); // Gọi lại hàm sau khi xóa thành công
        alert("Xóa khóa học thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        alert("Xóa khóa học thất bại!");
      }
    }
  };
  return (
    <div
      className="flex flex-col h-full p-4 bg-white rounded-[10px] shadow"
      style={{
        backgroundColor: "var(--search-bg)",
      }}
    >
      <div className="flex-1 flex flex-col">
        <div
          className="flex justify-between mb-2 *:items-center *:gap-2"
          style={{
            color: "var(--foreground)",
          }}
        >
          <h1 className="min-h-[3.5rem]  font-inter text-lg font-bold mr-5 line-clamp-2">
            {course.title}
          </h1>

          <div className="flex">
            <div
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={handleShowDetail}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="20"
                height="20"
                viewBox="0 0 28 28"
                fill="none"
              >
                <rect width="28" height="28" fill="url(#pattern0_1070_151)" />
                <defs>
                  <pattern
                    id="pattern0_1070_151"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1070_151" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1070_151"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwklEQVR4nO2dS6hNURzGt7xmjCRRDMnAK8mrFClFkkKUmYEwkQxdE2WgONRZ37f2vQOv4iTmlFcxZWLkNUDJQLnEjXK1co+O6+5z9vOc5azvV3t2zv+stX/nv15777WjSAghhBBCCCGEd9RqtRkAtllr98VxvKjX5QkakmsAvCE52nK8BHCuXq8v63X5gsIYsxbA8DgZfx0AHlpr1/e6rH2PSSFj3NEYGhqa1ety9yUmu4xmtrwHsLHX5e/HPmM4q4yW44e19kCv6xF0ZvDfTPlpjNnf6/qEIOMWyfMkX6QQ813NV7WjqSuNRmNy8zsktwB40qlPUUffBRlNSE4FgE6jr6xlChZTQEYrJI93kLKue7UKXEaTdpkC4P6fD4rqZTSbL5JPk+JZa5emjRUUpgIZrR19m7hnq6lR/w9tb+eR0aTNkPhFubUJZNIH4BvJzXl/Z2yekhR/Ybm1CmQGjpxSXGYBuNkm9t4odEz+hcJMUsZkXGkX01q7KwoZU3BtKq2UNDIAfCA5MwoVk3I0RdIUkZJSxrArTxQqTLGEDuD6wMDAlNHR0UkALnTIlhFr7dYEGZc6/M4XY8yGKFSYQUbzO3mkSEZFMvJIkYwuzcCdFJL1FH3KbfUZFWVGzkxRn9ENGUWlqANn+TLySpEMVicjqxTJYPUyHBpNpUAyPILKDH+gZPgDJcMfKBn+QMnwB0qGP1Ay/IGS4Q+UDH+QDI+QjP/vmb5rWiiUjLBQZniEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEtXYeyY8droFfLrLFkUM7JKQEwIBkeATJe7o7xBPcrTgkPyfdqqNmqsvEcbyiTXasLBJbD1jmgOThBBlfG43GtCgnkpETklcThDzIG1MyCkDydYKQ03niSUYBSM5J6j+MMduzxpOMgpDcmSQkjuPZWWJJRgmQPJOwhcXzLHEkoyRIPk7IkItpY0hGSdRqteljO6lNJORgyo3qV7nJY4cNY4aD3r0zy+pumw59yQSfn0lyE8mTAO64eYq2OCoRkseS/tFuQmitXexegsXfPHMvxUq78Zf2m8oBgBsJJ9I1Y5+ynHw1UyVA8m2Rk67MKBFjzIIqZLiLXOrAcwBgd4kS3NL9XZInjDFz85QneAAcKdAkvXKbFwM45F51XfTRZtH5GkjrMQLgkZvRW2t3uLUvncCKIHlqgn//Ozf6AnAUwGo3eazq98UEkFw+doFqz+Dg4HydJCGEEEIIIYSI+oJfm/8/Fy7JNMoAAAAASUVORK5CYII="
                  />
                </defs>
              </svg>
            </div>
            <div
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => handleDeleteCourse(course.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="20"
                height="20"
                viewBox="0 0 25 26"
                fill="none"
              >
                <rect
                  y="0.5"
                  width="25"
                  height="25"
                  fill="url(#pattern0_1070_169)"
                />
                <defs>
                  <pattern
                    id="pattern0_1070_169"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use xlinkHref="#image0_1070_169" transform="scale(0.01)" />
                  </pattern>
                  <image
                    id="image0_1070_169"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <Line />
        <div className=" font-inter text-sm font-normal my-2 line-clamp-2">
          {course.description}
        </div>
        <Line />
        <div className="*:flex *:justify-start *:gap-2 my-2 *:line-clamp-2 *:truncate">
          <div>
            <b>Giảng viên:</b>
            <span>{course.teachers?.join(", ") || "Chưa cập nhật"}</span>
          </div>
          <div>
            <b>Tag:</b>
            <span>{course.tags?.join(", ")}</span>
          </div>
        </div>
        <div className=" *:flex *:justify-start *:gap-2 my-2 *:line-clamp-2 *:truncate">
        </div>
        <Line />
      </div>
      <div className="mt-4 hover:grayscale-50">
        <div
          style={{
            backgroundColor: "var(--search-bg)",
          }}
          className=" w-full cursor-pointer p-2.5 bg-slate-50 rounded-[5px]  outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2.5"
          onClick={handleShowDetail}>
          <div

            className="text-center justify-center text-blue-600 text-base font-normal font-inter"
          >
            Thông tin khóa học
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          style={{
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.05",
          }}>
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw] shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            {loading && <div>Đang tải...</div>}
            {!loading && detail && (
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) => handleEditChange("title", e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập tiêu đề khóa học"
                    />
                  ) : (
                    detail.title
                  )}
                </h2>
                <div>
                  <b>Mô tả:</b>{" "}
                  {editMode ? (
                    <textarea
                      value={editData.description || ""}
                      onChange={(e) => handleEditChange("description", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập mô tả khóa học"
                    />
                  ) : (
                    detail.description
                  )}
                </div>
                <div><b>Mô tả:</b> {detail.description}</div>
                <div>
                  <b>Loại:</b>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.type || ""}
                      onChange={(e) => handleEditChange("type", e.target.value)}
                      className="border p-1 w-full"
                    />
                  ) : (
                    detail.type
                  )}
                </div>
                <div>
                  <b>Giảng viên:</b>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.teachers?.join(", ") || ""}
                      onChange={(e) =>
                        handleEditChange("teachers", e.target.value.split(",").map((t) => t.trim()))
                      }
                      className="border p-1 w-full"
                    />
                  ) : (
                    detail.teachers?.join(", ")
                  )}
                </div>
                <div><b>Cấp độ:</b> {editMode ? (
                  <select
                    value={editData.level || "Beginner"}
                    onChange={(e) => handleEditChange("level", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--sfit-gray-200)",
                    }}
                  >
                    <option value="Beginner">Cơ bản</option>
                    <option value="Intermediate">Trung cấp</option>
                    <option value="Advanced">Nâng cao</option>
                  </select>
                ) : (
                  detail.level
                )}</div>
                <div><b>Giảng viên:</b> {detail.teachers?.join(", ")}</div>
                <div><b>Tag:</b> {detail.tags?.join(", ")}</div>
                <div><b>Thời lượng:</b> {detail.total_time} phút</div>
                <div><b>Số bài học:</b> {detail.total_lessons}</div>
                <div><b>Ngôn ngữ:</b> {detail.language}</div>
                <div><b>Đã đăng ký:</b> {detail.like ? "Đã đăng ký" : "Chưa đăng ký"}</div>
                <div><b>Số người đăng ký:</b> {detail.total_registered}</div>
                <div><b>Điểm đánh giá:</b> {detail.star}</div>
                <div><b>Yêu cầu:</b> {detail.require?.join(", ")}</div>
                <div><b>Đối tượng:</b> {detail.target?.join(", ")}</div>
                <div><b>Cập nhật lúc:</b> {formatDateTime(detail.updated_at)}</div>
                {editMode ? (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleSaveChanges}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-4 hover:grayscale-50">
        <div
          style={{
            backgroundColor: "var(--search-bg)",
          }}
          className=" w-full cursor-pointer p-2.5 bg-slate-50 rounded-[5px]  outline-1 outline-offset-[-1px] outline-green-600 inline-flex justify-center items-center gap-2.5"
          onClick={() => router.push(`/course/${course.id}/lessons`)}
        >
          <div
            className="text-center justify-center text-green-600 text-base font-normal font-inter"

          >
            Thông tin bài giảng
          </div>
        </div>
      </div>
      <div className="mt-4 hover:grayscale-50">
        <div
          style={{
            backgroundColor: "var(--search-bg)",
          }}
          onClick={() => router.push(`/course/${course.id}/registers`)}
          className=" w-full cursor-pointer p-2.5 bg-slate-50 rounded-[5px]  outline-1 outline-offset-[-1px] outline-yellow-600 inline-flex justify-center items-center gap-2.5"
        >
          <div
            className="text-center justify-center text-yellow-600 text-base font-normal font-inter"
          >
            Thông tin đăng ký
          </div>
        </div>
      </div>
    </div>
  );
}
