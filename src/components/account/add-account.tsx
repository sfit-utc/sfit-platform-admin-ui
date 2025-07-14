import Modal from "@/components/ui/modal";
import { useState } from "react";

interface AddAccountProp {
  funcClickToBack: (b: boolean) => void;
  state: boolean;
}

export default function AddAccount({ state, funcClickToBack }: AddAccountProp) {
  const [accountID, setAccountID] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountClass, setAccountClass] = useState<string>("");
  const [accountTeam, setAccountTeam] = useState<string>("");
  const [accountEmail, setAccountEmail] = useState<string>("");
  const [accountRole, setAccountRole] = useState<string>("");

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
    if (!accountID.trim()) {
      setErrorID("Vui lòng nhập mã sinh viên");
      hasError = true;
    } else {
      setErrorID(null);
    }
    if (!accountName.trim()) {
      setErrorName("Vui lòng nhập họ và tên");
      hasError = true;
    } else {
      setErrorName(null);
    }
    if (!accountEmail.trim()) {
      setErrorEmail("Vui lòng nhập email");
      hasError = true;
    } else {
      setErrorEmail(null);
    }
    if (!accountClass.trim()) {
      setErrorClass("Vui lòng nhập lớp - khoa");
      hasError = true;
    } else {
      setErrorClass(null);
    }
    if (!accountRole.trim()) {
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
    setAccountID("");
    setAccountClass("");
    setAccountEmail("");
    setAccountRole("");
    setAccountTeam("");
    setAccountName("");
    setSelectedTeams([]);
    funcClickToBack(false);
  };

  const handleCancel = () => {
    setAccountID("");
    setAccountName("");
    setAccountClass("");
    setAccountEmail("");
    setAccountRole("");
    setAccountTeam("");
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
                htmlFor="account-id"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Mã sinh viên
              </label>
              <input
                type="text"
                name="account-id"
                id="account-id"
                value={accountID}
                onChange={(e) => setAccountID(e.target.value)}
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
                htmlFor="account-name"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Họ và tên
              </label>
              <input
                type="text"
                name="account-name"
                id="account-name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
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
                htmlFor="account-email"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="account-email"
                id="account-email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
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
                htmlFor="account-class"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Lớp - Khoa
              </label>
              <input
                type="text"
                name="account-class"
                id="account-class"
                value={accountClass}
                onChange={(e) => setAccountClass(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="VD: CNTT2 - K64"
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
                htmlFor="account-role"
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Chức vụ
              </label>
              <select
                name="account-role"
                id="account-role"
                value={accountRole}
                onChange={(e) => setAccountRole(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                aria-describedby={errorRole ? "error-role-message" : undefined}
              >
                <option value="">Chọn chức vụ</option>
                <option value="Thành viên">Thành viên</option>
                <option value="Phó ban">Phó ban</option>
                <option value="Trưởng ban">Trưởng ban</option>
                <option value="Phó CN">Phó CN</option>
                <option value="Chủ nhiệm">Chủ nhiệm</option>
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
          <div className="">
            <div
              className="border rounded-md px-4 py-2"
              style={{
                borderColor: "var(--sfit-gray-200)",
                backgroundColor: "var(--background)",
              }}
            >
              <p
                className="block text-sm font-medium"
                style={{ color: "var(--sfit-green)" }}
              >
                Ban
              </p>
              <div className="flex flex-col flex-wrap h-64">
                {teamList.map((team, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 m-2"
                  >
                    <input
                      type="checkbox"
                      name="account-team"
                      value={team}
                      checked={selectedTeams.includes(team)}
                      onChange={handleCheckboxChange}
                      className="focus:ring-2"
                      style={{ accentColor: "var(--sfit-green)" }}
                    />
                    <span style={{ color: "var(--foreground)" }}>{team}</span>
                  </label>
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

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--sfit-gray-200)",
              color: "var(--sfit-green)",
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--sfit-green)",
              color: "var(--background)",
            }}
          >
            Thêm
          </button>
        </div>
      </form>
    </Modal>
  );
}
