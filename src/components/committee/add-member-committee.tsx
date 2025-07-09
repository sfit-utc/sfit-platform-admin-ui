import Modal from "@/components/ui/modal";
import { useState } from "react";

interface AddMemberCommitteeProp {
  funcClickToBack: (b: boolean) => void;
  state: boolean;
}

export default function AddMemberCommittee({
  state,
  funcClickToBack,
}: AddMemberCommitteeProp) {
  const [memberID, setMemberID] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMemberID(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberID.trim()) {
      setError("Vui lòng nhập mã sinh viên");
      return;
    }
    setError(null);
    setMemberID(""); 
    funcClickToBack(false); 
  };

  const handleCancel = () => {
    setMemberID(""); 
    setError(null);
    funcClickToBack(false); 
  };

  return (
    <Modal className="w-96" state={state} funcClickToBack={funcClickToBack}>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Thêm Thành Viên</h2>
        <div>
          <label
            htmlFor="member-id"
            className="block text-sm font-medium text-gray-700"
          >
            Nhập mã sinh viên
          </label>
          <input
            type="text"
            name="member-id"
            id="member-id"
            value={memberID}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="VD: SV123456"
            aria-describedby={error ? "error-message" : undefined}
          />
          {error && (
            <p id="error-message" className="mt-1 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Thêm
          </button>
        </div>
      </form>
    </Modal>
  );
}
