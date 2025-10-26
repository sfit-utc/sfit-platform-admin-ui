import { useState } from "react";
import Modal from "@/components/ui/modal";
import { LessonType, Quiz } from "@/types/lesson";

interface CreateLessonFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const LESSON_TYPES: LessonType[] = ["Online", "Offline", "Quiz", "Reading"];

export default function CreateLessonForm({ open, onClose, onSubmit }: CreateLessonFormProps) {
    const [type, setType] = useState<LessonType>("Online");
    const [form, setForm] = useState<any>({
        title: "",
        description: "",
        position: 1,
        duration: 60,
        videoUrl: "",
        location: "",
        date: "",
        quizContent: [
            {
                questions: "",
                answers: [""],
                correctAnswers: [],
            },
        ] as Quiz[],
        reading_content: "",
    });

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi type
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value as LessonType);
    };


    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let data: any = {
            title: form.title,
            description: form.description,
            position: Number(form.position),
            type,
        };
        if (type === "Online") {
            data.video_url = form.videoUrl;
        }
        if (type === "Offline") {
            data.location = form.location;
            const formattedDate = new Date(form.date).toISOString();
            data.date = formattedDate;
            data.duration = Number(form.duration);
        }
        if (type === "Quiz") {
            data.quiz_content = form.quizContent.map((quiz: Quiz) => ({
                ...quiz,
                correct_answers: quiz.correctAnswers, 
            }));
            data.duration = Number(form.duration);
        }
        if (type === "Reading") {
            data = {
                title: form.title,
                description: form.description,
                position: Number(form.position),
                type,
                duration: Number(form.duration),
                reading_content : form.reading_content.trim(),
            };
        }
        console.log("Data to submit:", data); 
        onSubmit(data);
    };

    return (
        <Modal state={open} funcClickToBack={onClose} className="max-w-xl w-full">
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">Thêm bài giảng</h2>
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
                        <input name="videoUrl" value={form.videoUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                )}
                {type === "Offline" && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">Địa điểm *</label>
                            <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Ngày *</label>
                            <input name="date" type="datetime-local" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Thời lượng (phút) *</label>
                            <input name="duration" type="number" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                        </div>
                    </>
                )}
                {type === "Quiz" && (
                    <div>
                        <label className="block mb-1 font-medium">Nội dung Quiz *</label>
                        {form.quizContent.map((quiz: Quiz, questionIndex: number) => (
                            <div key={questionIndex} className="border p-4 mb-4 rounded">
                                <div>
                                    <label className="block mb-1 font-medium">Câu hỏi {questionIndex + 1}</label>
                                    <input
                                        type="text"
                                        name={`question-${questionIndex}`}
                                        value={quiz.questions}
                                        onChange={(e) => {
                                            const updatedQuizContent = [...form.quizContent];
                                            updatedQuizContent[questionIndex].questions = e.target.value;
                                            setForm((prev: typeof form) => ({ ...prev, quizContent: updatedQuizContent }));
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
                                                    setForm((prev: typeof form) => ({ ...prev, quizContent: updatedQuizContent }));
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
                                                        // Thêm index vào correctAnswers nếu được chọn
                                                        updatedQuizContent[questionIndex].correctAnswers.push(answerIndex);
                                                    } else {
                                                        // Loại bỏ index khỏi correctAnswers nếu bỏ chọn
                                                        updatedQuizContent[questionIndex].correctAnswers = updatedQuizContent[questionIndex].correctAnswers.filter(
                                                            (index: number) => index !== answerIndex
                                                        );
                                                    }
                                                    setForm((prev: any) => ({ ...prev, quizContent: updatedQuizContent }));
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedQuizContent = [...form.quizContent];
                                                    updatedQuizContent[questionIndex].answers.splice(answerIndex, 1);
                                                    updatedQuizContent[questionIndex].correctAnswers = updatedQuizContent[questionIndex].correctAnswers.filter(
                                                        (index: number) => index !== answerIndex
                                                    );
                                                    setForm((prev: any) => ({ ...prev, quizContent: updatedQuizContent }));
                                                }}
                                                className="text-red-500"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedQuizContent = [...form.quizContent];
                                            updatedQuizContent[questionIndex].answers.push("");
                                            setForm((prev: any) => ({ ...prev, quizContent: updatedQuizContent }));
                                        }}
                                        className="text-blue-500"
                                    >
                                        Thêm câu trả lời
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedQuizContent = [...form.quizContent];
                                        updatedQuizContent.splice(questionIndex, 1);
                                        setForm((prev: any) => ({ ...prev, quizContent: updatedQuizContent }));
                                    }}
                                    className="text-red-500 mt-2"
                                >
                                    Xóa câu hỏi
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setForm((prev: any) => ({
                                    ...prev,
                                    quizContent: [
                                        ...prev.quizContent,
                                        { questions: "", answers: [""], correctAnswers: [] },
                                    ],
                                }));
                            }}
                            className="text-blue-500"
                        >
                            Thêm câu hỏi
                        </button>
                    </div>
                )}
                {type === "Reading" && (
                    <div>
                        <label className="block mb-1 font-medium">Nội dung đọc *</label>
                        <textarea name="reading_content" value={form.reading_content} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Tạo bài giảng</button>
                </div>
            </form>
        </Modal>
    );
}