"use client";

import HighlightBox from "@/components/ui/highlight-box";
import Loading from "@/components/ui/loading";
import Panel from "@/components/ui/panel";
import TaskItem from "@/components/ui/task-item";
import {
  useCommitteeDetail,
  useCommitteeTarget,
  useListMembersOfCommittee,
  usePeriod,
  useTasksOfCommittee,
} from "@/hooks/use-committee-detail-service";
import { ArrowLeft, Check, Pen, Plus, Trash2, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AccountItem from "@/components/account/account-item";
import CommitteeEdit from "@/components/committee/committee-edit";
import AddMemberCommittee from "@/components/committee/add-member-committee";
import AddTarget from "./add-target";
import { committeeDetailService } from "@/services/committee-detail-service";

interface CommitteeDetailProp {
  id: number;
}

export default function CommitteeDetail({ id }: CommitteeDetailProp) {
  const { data: period } = usePeriod(id);
  const { data: committeeInfor } = useCommitteeDetail(id);
  const { data: targets, fetchData: refetchTargets } = useCommitteeTarget(id);
  const { data: taskItems } = useTasksOfCommittee(id);
  const { data: member, loading: loadMembers } = useListMembersOfCommittee(id);

  const [teamEditing, setTeamEditing] = useState<boolean>(false);
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [addTarget, setAddTarget] = useState(false);
  const [targetEditing, setTargetEditing] = useState<boolean>(false);
  const [binTarget, setBinTarget] = useState<number[]>([]);

  function handleDeleteTarget(id: number) {
    console.log("delete target: ", id);
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
    <div className="w-full text-black">
      <Link href="/team" className="flex items-center gap-2.5 font-semibold">
        <ArrowLeft />
        Ban
      </Link>
      <div className="mt-2.5 border-b mb-2.5">
        <h2 className="flex justify-between text-3xl">
          {committeeInfor && committeeInfor.committeeName}
          <div className="flex ml-auto gap-2 text-gray-500">
            <div
              className="flex cursor-pointer justify-center items-center w-7 h-7 p-1 border border-gray-500 rounded-md"
              onClick={() => setTeamEditing(true)}
            >
              <Pen />
            </div>
            <div
              className="flex cursor-pointer justify-center items-center w-7 h-7 p-1 border border-gray-500 rounded-md"
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
          <div className="flex justify-between">
            <div>Nhiệm vụ</div>
            <Link
              href="/add-task"
              className="flex gap-2 items-center text-white text-sm bg-sfit-primary-dark px-3 py-1.5 rounded-2xl"
            >
              <Plus size={18} />
              Tạo nhiệm vụ mới
            </Link>
          </div>
        }
      >
        {taskItems.map(({ label, items }, index) => (
          <Panel key={index} title={label}>
            {items.map(({ title, expired, percentComplete }, inerIndex) => (
              <TaskItem
                className="mb-2"
                key={inerIndex}
                title={title}
                expired={expired}
                percentComplete={percentComplete}
              />
            ))}
          </Panel>
        ))}
      </Panel>
      <Panel
        className="mt-2.5"
        title={
          <div className="flex items-center">
            <div>Mục tiêu</div>
            <HighlightBox className="w-fit text-sm ml-5" color="blue">
              {period}
            </HighlightBox>
            <div className="flex ml-auto gap-2 text-gray-500">
              <div className="flex cursor-pointer justify-center items-center w-7 h-7 p-1 border border-gray-500 rounded-md">
                {targetEditing ? (
                  <Check onClick={() => handleDeleteDone()} />
                ) : (
                  <Pen onClick={() => setTargetEditing(!targetEditing)} />
                )}
              </div>
              <div
                className="flex cursor-pointer justify-center items-center w-7 h-7 p-2 border border-gray-500 rounded-md"
                onClick={() => setAddTarget(true)}
              >
                <div className="bg-sfit-primary-dark rounded-full text-white p-1">
                  <Plus size={14} />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th className="text-center px-4 ">trưởng/phó ban</th>
                <th className="text-center">Thư ký</th>
              </tr>
            </thead>
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
                      className={`w-fit m-auto border rounded-md ${
                        headDo && "border-green-500"
                      }`}
                    >
                      {headDo ? (
                        <Check className="text-green-500" />
                      ) : (
                        <div className="p-3"></div>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div
                      className={`w-fit m-auto border rounded-md ${
                        secretaryDo && "border-green-500"
                      }`}
                    >
                      {secretaryDo ? (
                        <Check className="text-green-500" />
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
                          className="text-red-500 cursor-pointer hover:bg-red-200 p-1.5 rounded-full overflow-visible"
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
        ) : (
          member.map((account) => (
            <AccountItem key={account.id} account={account} style="line" />
          ))
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
      <AddTarget state={addTarget} funcClickToBack={setAddTarget} />
    </div>
  );
}
