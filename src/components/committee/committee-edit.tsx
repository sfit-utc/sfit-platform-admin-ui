import Modal from "@/components/ui/modal";
import { CommitteeDetail } from "@/types/committee";
import { useEffect, useState } from "react";

interface CommitteeEditProp {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
  committeeDetail?: CommitteeDetail;
}

export default function CommitteeEdit({
  state,
  funcClickToBack,
  committeeDetail,
}: CommitteeEditProp) {
  const [formData, setFormData] = useState<CommitteeDetail | null>(
    committeeDetail || null
  );

  useEffect(() => {
    setFormData(committeeDetail || null);
  }, [committeeDetail]);

  if (!formData) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated committee details:", formData);
    funcClickToBack(false);
  };

  return (
    <Modal
      className="w-3xl max-w-	null2xl"
      state={state}
      funcClickToBack={funcClickToBack}
    >
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 p-6">
        <div className="flex flex-col">
          <label htmlFor="committee-name" className="mb-1 font-medium">
            Tên ban:
          </label>
          <input
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="committeeName"
            type="text"
            id="committee-name"
            value={formData.committeeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 font-medium">
            Mô tả:
          </label>
          <textarea
            className="resize-none p-2 border rounded-md h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="head" className="mb-1 font-medium">
            Trưởng ban:
          </label>
          <input
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="headOfCommittee"
            id="head"
            value={formData.headOfCommittee}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="vice" className="mb-1 font-medium">
            Phó ban:
          </label>
          <input
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="viceHeadOfCommittee"
            id="vice"
            value={formData.viceHeadOfCommittee}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => funcClickToBack(false)}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
}
