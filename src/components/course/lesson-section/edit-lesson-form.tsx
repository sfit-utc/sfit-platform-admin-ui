import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { LessonRequest, LessonType, Quiz } from "@/types/lesson";

interface EditLessonFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: LessonRequest) => void;
    lessonData: LessonRequest | null; // Dữ liệu bài giảng hiện tại
}

const LESSON_TYPES: LessonType[] = ["Online", "Offline", "Quiz", "Reading"];

export default function EditLessonForm({ open, onClose, onSubmit, lessonData }: EditLessonFormProps) {
    const [type, setType] = useState<LessonType>("Online");
    const [form, setForm] = useState<LessonRequest>({
        title: "",
        description: "",
        position: 1,
        duration: 60,
        type: "Online",
    });

    // Cập nhật dữ liệu bài giảng khi mở modal
    useEffect(() => {
        if (lessonData) {
            setForm(lessonData);
            setType(lessonData.type);
        }
    }, [lessonData]);
    // console.log(lessonData?.quizContent.Data[0].questions);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value as LessonType);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", form);
        onSubmit(form);
    };

    return (
        <Modal state={open} funcClickToBack={onClose} className="max-w-xl w-full">
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">Chỉnh sửa bài giảng</h2>
                <div>
                    <label className="block mb-1 font-medium">Loại bài giảng *</label>
                    <select name="type" value={type} onChange={handleTypeChange} className="w-full border rounded px-3 py-2">
                        {LESSON_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Tiêu đề *</label>
                    <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Mô tả</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Vị trí (position)</label>
                    <input name="position" type="number" value={form.position} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                {type === "Online" && (
                    <div>
                        <label className="block mb-1 font-medium">Video URL *</label>
                        <input name="videoUrl" value={form.videoUrl || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                )}
                {type === "Offline" && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">Địa điểm *</label>
                            <input name="location" value={form.location || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Ngày *</label>
                            <input name="date" type="datetime-local" value={form.date || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Thời lượng (phút) *</label>
                            <input name="duration" type="number" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                    </>
                )}
                {type === "Quiz" && (
                    <div>
                        {/* <label className="block mb-1 font-medium">Nội dung Quiz *</label>
                        {Array.isArray(form.quizContent) && form.quizContent.map((quiz: Quiz, questionIndex: number) => (
                            <div key={questionIndex} className="border p-4 mb-4 rounded">
                                <div>
                                    <label className="block mb-1 font-medium">Câu hỏi {questionIndex + 1}</label>
                                    <input
                                        type="text"
                                        value={quiz.Data[questionIndex].questions}
                                        onChange={(e) => {
                                            const updatedQuizContent = [...form.quizContent];
                                            updatedQuizContent[questionIndex].questions = e.target.value;
                                            setForm((prev) => ({ ...prev, quizContent: updatedQuizContent }));
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block mb-1 font-medium">Câu trả lời</label>
                                    {quiz.answers.map((answer: string, answerIndex: number) => (
                                        <div key={answerIndex} className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={answer}
                                                onChange={(e) => {
                                                    const updatedQuizContent = [...form.quizContent];
                                                    updatedQuizContent[questionIndex].answers[answerIndex] = e.target.value;
                                                    setForm((prev) => ({ ...prev, quizContent: updatedQuizContent }));
                                                }}
                                                className="w-full border rounded px-3 py-2"
                                                required
                                            />
                                            <input
                                                type="checkbox"
                                                checked={quiz.correctAnswers.includes(answerIndex)}
                                                onChange={(e) => {
                                                    const updatedQuizContent = [...form.quizContent];
                                                    if (e.target.checked) {
                                                        updatedQuizContent[questionIndex].correctAnswers.push(answerIndex);
                                                    } else {
                                                        updatedQuizContent[questionIndex].correctAnswers = updatedQuizContent[questionIndex].correctAnswers.filter(
                                                            (index: number) => index !== answerIndex
                                                        );
                                                    }
                                                    setForm((prev) => ({ ...prev, quizContent: updatedQuizContent }));
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedQuizContent = [...form.quizContent];
                                            updatedQuizContent[questionIndex].answers.push("");
                                            setForm((prev) => ({ ...prev, quizContent: updatedQuizContent }));
                                        }}
                                        className="text-blue-500"
                                    >
                                        Thêm câu trả lời
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    quizContent: [
                                        ...(Array.isArray(prev.quizContent) ? prev.quizContent : []),
                                        { questions: "", answers: [""], correctAnswers: [] },
                                    ],
                                }));
                            }}
                            className="text-blue-500"
                        >
                            Thêm câu hỏi
                        </button> */}
                    </div>
                )}
                {type === "Reading" && (
                    <div>
                        <label className="block mb-1 font-medium">Nội dung đọc *</label>
                        <textarea name="readingContent" value={form.readingContent || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
                    <button
                        type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Lưu thay đổi</button>
                </div>
            </form>
        </Modal>
    );
}