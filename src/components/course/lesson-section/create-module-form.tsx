import { useState } from "react";
import Modal from "@/components/ui/modal";
import { AddModuleToCourseRequest } from "@/types/course";

interface AddModuleFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: AddModuleToCourseRequest) => void;
}

export default function AddModuleForm({ open, onClose, onSubmit }: AddModuleFormProps) {
    const [moduleTitle, setModuleTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!moduleTitle.trim()) {
            alert("Vui lòng nhập tiêu đề module!");
            return;
        }
        onSubmit({ module_title: moduleTitle });
        setModuleTitle("");
    };

    return (
        <Modal state={open} funcClickToBack={onClose} className="max-w-md w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-2">Thêm module</h2>
                <div>
                    <label className="block mb-1 font-medium">Tiêu đề module *</label>
                    <input
                        type="text"
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                        Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                        Thêm module
                    </button>
                </div>
            </form>
        </Modal>
    );
}