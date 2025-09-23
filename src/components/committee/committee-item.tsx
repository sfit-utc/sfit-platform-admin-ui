import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

interface CommitteeItemProp {
  id: string;
  committeeName: string;
  headOfCommittee: string;
  description: string;
  numberOfMember: number;
  onDelete?: (id: string) => void;
}

export default function CommitteeItem({
  id,
  committeeName,
  headOfCommittee,
  description,
  numberOfMember,
  onDelete,
}: CommitteeItemProp) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative">
      <Link
        href={`/team?id=${id}`}
        className="font-sans text-center shadow rounded-b-md px-11 py-5 flex flex-col items-center border border-solid min-h-[200px] justify-center"
        style={{
          color: "var(--foreground)",
          backgroundColor: "var(--search-bg)",
        }}
      >
        <h2 className="text-2xl font-extrabold">{committeeName}</h2>
        <div className="text-sfit-red-500 bg-sfit-red-50 font-bold rounded-2xl text-sm w-fit px-2">
          Trưởng ban: {headOfCommittee}
        </div>
        <p className="mt-4">{description}</p>
        <p className="font-bold mt-2.5">Thành viên: {numberOfMember}</p>
      </Link>

      <div className="absolute top-2 right-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="p-1 rounded hover:bg-black hover:bg-opacity-10"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-6 bg-white border rounded shadow-lg z-50"
            style={{ borderColor: "var(--sfit-gray-200)" }}
          >
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(id);
                setShowDropdown(false);
              }}
            >
              Xóa nhóm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
