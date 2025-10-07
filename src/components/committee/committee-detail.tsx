"use client";

import HighlightBox from "@/components/ui/highlight-box";
import Loading from "@/components/ui/loading";
import Panel from "@/components/ui/panel";
import {
  useCommitteeDetail,
  useCommitteeTarget,
  useListMembersOfCommittee,
  usePeriod,
} from "@/hooks/use-committee-detail-service";
import { ArrowLeft, Check, Pen, Plus, Trash2, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CommitteeEdit from "@/components/committee/committee-edit";
import AddMemberCommittee from "@/components/committee/add-member-committee";
import AddTarget from "./add-target";
import { committeeDetailService } from "@/services/committee-detail-service";

interface CommitteeDetailProp {
  id: string;
}

export default function CommitteeDetail({ id }: CommitteeDetailProp) {
  const { data: period } = usePeriod(id);
  const { data: committeeInfor } = useCommitteeDetail(id);
  const { data: targets, fetchData: refetchTargets } = useCommitteeTarget(id);
  const { data: member, loading: loadMembers } = useListMembersOfCommittee(id);

  const [teamEditing, setTeamEditing] = useState<boolean>(false);
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [addTarget, setAddTarget] = useState(false);
  const [targetEditing, setTargetEditing] = useState<boolean>(false);
  const [binTarget, setBinTarget] = useState<number[]>([]);

  function handleDeleteTarget(id: number) {
    setBinTarget([...binTarget, id]);
  }

  function handleDeleteDone() {
    committeeDetailService.deleteTarget(binTarget).then(() => {
      setTargetEditing(false);
      setBinTarget([]);
      refetchTargets();
    });
  }

  return (
    <div className="w-full" style={{ color: "var(--foreground)" }}>
      <Link href="/team" className="flex items-center gap-2.5 font-semibold">
        <ArrowLeft />
        Ban
      </Link>
      <div className="mt-2.5 border-b mb-2.5">
        <h2 className="flex justify-between text-3xl">
          {committeeInfor && committeeInfor.committeeName}
          <div
            className="flex ml-auto gap-2"
            style={{ color: "var(--sfit-gray-200)" }}
          >
            <div
              className="flex cursor-pointer justify-center items-center w-7 h-7 p-1 border rounded-md"
              style={{ borderColor: "var(--sfit-gray-200)" }}
              onClick={() => setTeamEditing(true)}
            >
              <Pen />
            </div>
            <div
              className="flex cursor-pointer justify-center items-center w-7 h-7 p-1 border rounded-md"
              style={{ borderColor: "var(--sfit-gray-200)" }}
              onClick={() => setAddingMember(true)}
            >
              <UsersRound />
            </div>
          </div>
        </h2>
      </div>
      <div className="shadow px-4 py-2 rounded-md">
        <p>{committeeInfor && committeeInfor.description}</p>
        <div className="mt-2.5 ml-3.5">
          <HighlightBox className="w-fit font-bold" color="red">
            Trưởng ban: {committeeInfor && committeeInfor.headOfCommittee}
          </HighlightBox>
        </div>
        <div className="mt-2.5 ml-3.5 flex gap-4 font-bold">
          {committeeInfor &&
            committeeInfor.viceHeadOfCommittee.map((name, index) => (
              <HighlightBox className="w-fit" key={index} color="yellow">
                Phó ban: {name}
              </HighlightBox>
            ))}
        </div>
      </div>
      <Panel
        className="mt-2.5"
        title={
          <div className="flex items-center">
            <div>Mục tiêu</div>
            <HighlightBox className="w-fit text-sm ml-5" color="blue">
              {period}
            </HighlightBox>
            <div
              className="flex ml-auto gap-2"
              style={{ color: "var(--sfit-gray-200)" }}
            >
              <div className="flex cursor-pointer justify-center items-center w-7 h-7 p-1 border border-gray-500 rounded-md">
                {targetEditing ? (
                  <Check onClick={() => handleDeleteDone()} />
                ) : (
                  <Pen onClick={() => setTargetEditing(!targetEditing)} />
                )}
              </div>
              <div
                className="flex cursor-pointer justify-center items-center w-7 h-7 p-2 border rounded-md"
                style={{ borderColor: "var(--sfit-gray-200)" }}
                onClick={() => setAddTarget(true)}
              >
                <div
                  className="rounded-full p-1"
                  style={{
                    backgroundColor: "var(--sfit-primary-dark)",
                    color: "var(--background)",
                  }}
                >
                  <Plus size={14} />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div>
          <table>
            <thead></thead>
            <tbody>
              {targets.map(({ id, title, expired, headDo, secretaryDo }) => (
                <tr
                  key={id}
                  className={`${binTarget.includes(id) ? "opacity-25" : ""}`}
                >
                  <td className="px-4 py-1">{title}</td>
                  <td className="px-4">
                    <HighlightBox color="red">{expired}</HighlightBox>
                  </td>
                  <td className="text-center">
                    <div
                      className={`w-fit m-auto border rounded-md`}
                      style={{
                        borderColor: headDo
                          ? "var(--sfit-green)"
                          : "var(--sfit-gray-200)",
                      }}
                    >
                      {headDo ? (
                        <Check style={{ color: "var(--sfit-green)" }} />
                      ) : (
                        <div className="p-3"></div>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div
                      className={`w-fit m-auto border rounded-md`}
                      style={{
                        borderColor: secretaryDo
                          ? "var(--sfit-green)"
                          : "var(--sfit-gray-200)",
                      }}
                    >
                      {secretaryDo ? (
                        <Check style={{ color: "var(--sfit-green)" }} />
                      ) : (
                        <div className="p-3"></div>
                      )}
                    </div>
                  </td>
                  {targetEditing && (
                    <td>
                      <div className="flex items-center gap-3 ml-4">
                        <Trash2
                          size={32}
                          className="cursor-pointer p-1.5 rounded-full overflow-visible"
                          style={{ color: "var(--sfit-red-500)" }}
                          onClick={() => handleDeleteTarget(id)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Thành viên" className="mt-2.5">
        {loadMembers ? (
          <Loading className="m-auto w-fit" size={48} />
        ) : member && member.length > 0 ? (
          <div className="space-y-2">
            {member.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.class}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "Trưởng ban"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "Phó ban"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Không có thành viên nào trong ban này
          </div>
        )}
      </Panel>
      <CommitteeEdit
        state={teamEditing}
        committeeDetail={committeeInfor}
        funcClickToBack={setTeamEditing}
      />
      <AddMemberCommittee
        state={addingMember}
        funcClickToBack={setAddingMember}
      />
      <AddTarget
        state={addTarget}
        funcClickToBack={setAddTarget}
        committeeId={id.toString()}
        onTargetAdded={refetchTargets}
      />
    </div>
  );
}
