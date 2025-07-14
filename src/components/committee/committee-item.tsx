import Link from "next/link";

interface CommitteeItemProp {
  id: number;
  committeeName: string;
  headOfCommittee: string;
  description: string;
  numberOfMember: number;
}

export default function CommitteeItem({
  id,
  committeeName,
  headOfCommittee,
  description,
  numberOfMember,
}: CommitteeItemProp) {
  return (
    <Link
      href={`/team?id=${id}`}
      className="text-center shadow rounded-b-md px-11 py-5 flex flex-col items-center border border-solid"
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
  );
}
