import Modal from "@/components/ui/modal";
import { useState } from "react";

interface AddMemberProp {
  funcClickToBack: (b: boolean) => void;
  state: boolean;
}

export default function AddMember({ state, funcClickToBack }: AddMemberProp) {
  const [memberID, setMemberID] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [memberClass, setMemberClass] = useState<string>("");
  const [memberTeam, setMemberTeam] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberRole, setMemberRole] = useState<string>("");

  //Sẽ sửa
  const teamList = [
    "Học tập",
    "Hậu cần",
    "Đối ngoại",
    "Truyền thông",
    "Kỹ thuật",
    "Data & AI",
    "IOT",
    "Game",
    "Web",
    "Chuyên môn",
    "Cán sự",
    "Chủ nhiệm",
  ];
  const [errorID, setErrorID] = useState<string | null>(null);
  const [errorName, setErrorName] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorClass, setErrorClass] = useState<string | null>(null);
  const [errorRole, setErrorRole] = useState<string | null>(null);
  const [errorTeam, setErrorTeam] = useState<string | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTeams([...selectedTeams, value]);
    } else {
      setSelectedTeams(selectedTeams.filter((team) => team !== value));
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!memberID.trim()) {
      setErrorID("Vui lòng nhập mã sinh viên");
      hasError = true;
    } else {
      setErrorID(null);
    }
    if (!memberName.trim()) {
      setErrorName("Vui lòng nhập họ và tên");
      hasError = true;
    } else {
      setErrorName(null);
    }
    if (!memberEmail.trim()) {
      setErrorEmail("Vui lòng nhập email");
      hasError = true;
    } else {
      setErrorEmail(null);
    }
    if (!memberClass.trim()) {
      setErrorClass("Vui lòng nhập lớp - khoa");
      hasError = true;
    } else {
      setErrorClass(null);
    }
    if (!memberRole.trim()) {
      setErrorRole("Vui lòng chọn chức vụ");
      hasError = true;
    } else {
      setErrorRole(null);
    }
    if (selectedTeams.length === 0) {
      setErrorTeam("Vui lòng chọn ban trực thuộc");
      hasError = true;
    } else {
      setErrorTeam(null);
    }
    if (hasError) return;
    setMemberID("");
    setMemberClass("");
    setMemberEmail("");
    setMemberRole("");
    setMemberTeam("");
    setMemberName("");
    setSelectedTeams([]);
    funcClickToBack(false);
  };

  const handleCancel = () => {
    setMemberID("");
    setMemberName("");
    setMemberClass("");
    setMemberEmail("");
    setMemberRole("");
    setMemberTeam("");
    setSelectedTeams([]);
    setErrorID(null);
    setErrorName(null);
    setErrorEmail(null);
    setErrorClass(null);
    setErrorRole(null);
    setErrorTeam(null);
    funcClickToBack(false);
  };

  return (
    <Modal className="w-1/2" state={state} funcClickToBack={funcClickToBack}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-green)" }}
        >
          Thêm Thành Viên
        </h2>
        <div className="flex justify-around">
          <div className="*:my-2">
            <div>
              <label
                htmlFor="member-id"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Mã sinh viên
              </label>
              <input
                type="text"
                name="member-id"
                id="member-id"
                value={memberID}
                onChange={(e) => setMemberID(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="VD: 231238888"
                aria-describedby={errorID ? "error-id-message" : undefined}
              />
              {errorID && (
                <p
                  id="error-id-message"
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errorID}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="member-name"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Họ và tên
              </label>
              <input
                type="text"
                name="member-name"
                id="member-name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="VD: Nguyễn Đức Mạnh"
                aria-describedby={errorName ? "error-name-message" : undefined}
              />
              {errorName && (
                <p
                  id="error-name-message"
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errorName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="member-email"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="member-email"
                id="member-email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="VD: nkdkhtl@gmail.com"
                aria-describedby={
                  errorEmail ? "error-email-message" : undefined
                }
              />
              {errorEmail && (
                <p
                  id="error-email-message"
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errorEmail}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="member-class"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Lớp - Khoa
              </label>
              <input
                type="text"
                name="member-class"
                id="member-class"
                value={memberClass}
                onChange={(e) => setMemberClass(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="VD: CNTT-K65"
                aria-describedby={
                  errorClass ? "error-class-message" : undefined
                }
              />
              {errorClass && (
                <p
                  id="error-class-message"
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errorClass}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="member-role"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Chức vụ
              </label>
              <select
                name="member-role"
                id="member-role"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                aria-describedby={errorRole ? "error-role-message" : undefined}
              >
                <option value="">Chọn chức vụ</option>
                <option value="Chủ nhiệm">Chủ nhiệm</option>
                <option value="Phó CN">Phó CN</option>
                <option value="Trưởng ban">Trưởng ban</option>
                <option value="Phó ban">Phó ban</option>
                <option value="Thành viên">Thành viên</option>
              </select>
              {errorRole && (
                <p
                  id="error-role-message"
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errorRole}
                </p>
              )}
            </div>
          </div>
          <div className="*:my-2">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--sfit-green)" }}
              >
                Ban trực thuộc
              </label>
              <div
                className="border rounded-md p-3 max-h-48 overflow-y-auto"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                {teamList.map((team) => (
                  <div key={team} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={team}
                      value={team}
                      checked={selectedTeams.includes(team)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor={team}
                      className="text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {team}
                    </label>
                  </div>
                ))}
              </div>
              {errorTeam && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errorTeam}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              borderColor: "var(--sfit-gray-200)",
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Thêm thành viên
          </button>
        </div>
      </form>
    </Modal>
  );
}
