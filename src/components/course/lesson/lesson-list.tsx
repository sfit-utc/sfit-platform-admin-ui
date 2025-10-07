import { CourseDetailResponse } from "@/types/course";
import { useCourseService } from "@/hooks/use-course-service";
import { useLessonService } from "@/hooks/use-lesson-service";
import { LessonRequest } from "@/types/lesson";
import { useState } from "react";
import { useParams } from "next/navigation";
import CreateLessonForm from "./create-lesson-form";
import { AddModuleToCourseRequest} from "@/types/course";
import AddModuleForm from "./create-module-form";


const AddLessonIcon = ({ onClick }: { onClick: () => void }) => (
    <button
        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        type="button"
        onClick={onClick}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            fill="none"
            viewBox="0 0 24 24"
        >
            <rect width="24" height="24" rx="6" fill="#22C55E" />
            <path
                d="M12 6v12M18 12H6"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        Thêm bài giảng
    </button>
);
const EditIcon = () => (
    <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
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
);

const DeleteIcon = () => (
    <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
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
);


interface LessonListProps {
    selectedCourse: CourseDetailResponse;
    onBack: () => void;

}

export default function LessonList({
    selectedCourse,
    onBack,
}: LessonListProps) {
    const { addModuleToCourse, getCourseDetailByID, deleteModule } = useCourseService();
    const { createLesson, deleteLesson } = useLessonService();
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [isLessonModalOpen, setLessonModalOpen] = useState(false);
    const [isModuleModalOpen, setModuleModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();
    const handleDeleteModule = async (moduleId: string) => {
        if (!id) {
            alert("Không tìm thấy course ID!");
            return;
        }
        try {
            const isDeleted = await deleteModule(moduleId);
            if (isDeleted) {
                const updatedCourse = await getCourseDetailByID(id);
                if (updatedCourse) {
                    selectedCourse.course_content = updatedCourse.course_content;
                }
            }
        } catch (error) {
            alert("Không thể xóa module: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };
    const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
        if (!id) {
            alert("Không tìm thấy course ID!");
            return;
        }
        try {
            await deleteLesson(moduleId, lessonId);

            const updatedCourse = await getCourseDetailByID(id);
            if (updatedCourse) {
                selectedCourse.course_content = updatedCourse.course_content;
            }
        } catch (error) {
            alert("Không thể xóa bài giảng: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };
    const AddModuleIcon = () => (
        <button
            onClick={() => setModuleModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            type="button"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                fill="none"
                viewBox="0 0 24 24"
            >
                <rect width="24" height="24" rx="6" fill="#22C55E" />
                <path
                    d="M12 6v12M18 12H6"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            Thêm module
        </button>
    );
    const handleAddModule = async (moduleData: AddModuleToCourseRequest) => {
        if (!id) {
            alert("Không tìm thấy course ID!");
            return;
        }
        try {
            await addModuleToCourse(id, moduleData);
            setModuleModalOpen(false);

            const updatedCourse = await getCourseDetailByID(id);
            if (updatedCourse) {
                selectedCourse.course_content = updatedCourse.course_content;
            }
        } catch (error) {
            alert("Không thể thêm module: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };
    const handleAddLesson = async (lessonData: LessonRequest) => {
        if (!selectedModuleId) {
            alert("Không tìm thấy module ID!");
            return;
        }
        if (!id) {
            alert("Không tìm thấy course ID!");
            return;
        }
        try {
            await createLesson(selectedModuleId, lessonData);
            setLessonModalOpen(false);

            const updatedCourse = await getCourseDetailByID(id);
            if (updatedCourse) {
                selectedCourse.course_content = updatedCourse.course_content;
            }
        } catch (error) {
            alert("Không thể thêm bài giảng: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };
    return (
        <div className="py-8 px-4">
            <button
                className="mb-6 px-5 py-2 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-colors shadow-sm"
                onClick={onBack}
            >
                ← Quay lại danh sách khóa học
            </button>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCourse.title} - Danh sách bài giảng
                </h2>
                <span >
                    <AddModuleIcon />
                </span>
            </div>
            {selectedCourse.course_content && selectedCourse.course_content.length === 0 && (
                <div className="text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    Chưa có module nào.
                </div>
            )}
            <div className="space-y-6">
                {(selectedCourse.course_content || []).map((module) => (
                    <div
                        key={module.id}
                        className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                <h3 className="text-lg font-semibold text-green-700">{module.module_title}</h3>
                            </div>
                            <div className="flex gap-2">

                                <button
                                    className="p-1 rounded hover:bg-red-100"
                                    title="Xóa module"
                                    onClick={() => handleDeleteModule(module.id)}
                                >
                                    <DeleteIcon />
                                </button>
                                <span>
                                    <AddLessonIcon onClick=
                                    {() => {
                                        setSelectedModuleId(module.id);
                                        setLessonModalOpen(true)
                                        }
                                    }
                                    />

                                </span>
                            </div>
                        </div>
                        {(!module.lessons || module.lessons.length === 0) ? (
                            <div className="text-gray-400 italic">Chưa có bài giảng nào.</div>
                        ) : (
                            <ul className="space-y-2 pl-2">
                                {module.lessons.map((lesson, idx) => (
                                    <li
                                        key={lesson.id}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors group"
                                    >
                                        <span className="text-green-500 font-medium">{idx + 1}.</span>
                                        <span className="text-gray-800 group-hover:text-green-700 flex-1">{lesson.title}</span>
                                        <button
                                            className="p-1 rounded hover:bg-blue-100"
                                            title="Sửa bài giảng"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="p-1 rounded hover:bg-red-100"
                                            title="Xóa bài giảng"
                                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <CreateLessonForm
                open={isLessonModalOpen}
                onClose={() => setLessonModalOpen(false)}
                onSubmit={handleAddLesson}
            />
            <AddModuleForm
                open={isModuleModalOpen}
                onClose={() => setModuleModalOpen(false)}
                onSubmit={handleAddModule}
            />

        </div>
    );
}