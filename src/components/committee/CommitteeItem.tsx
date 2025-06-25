import Link from "next/link";

interface CommitteeItemProp {
  committeeName: string;
  headOfCommittee: string;
  description: string;
  numberOfMember: number;
  href: string;
}

export default function CommitteeItem({
  committeeName,
  headOfCommittee,
  description,
  numberOfMember,
  href,
}: CommitteeItemProp) {
  return (
    <Link
      href={href}
      className="text-black text-center shadow rounded-b-md px-11 py-5 flex flex-col items-center"
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
