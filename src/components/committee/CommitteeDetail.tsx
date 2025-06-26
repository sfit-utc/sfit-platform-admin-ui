"use client";

import HighlightBox from "@/components/ui/highlightBox";
import Panel from "@/components/ui/panel";
import { ArrowLeft, Check, Pen, Plus } from "lucide-react";
import TaskItem from "@/components/ui/TaskItem";
import {
  useCommitteeDetail,
  useCommitteeTarget,
  useListMembersOfCommittee,
  useTasksOfCommittee,
} from "@/hooks/useCommitteeDetailService";
import AccountItem from "../Account/AccountItem";
import Loading from "../ui/loading";

interface CommitteeDetailProp {
  id: number;
}

export default function CommitteeDetail({ id }: CommitteeDetailProp) {
  const period = "30/01/2025 - 01/06/2025";
  const { data: committeeInfor } = useCommitteeDetail(id);
  const { data: targets } = useCommitteeTarget(id);
  const { data: taskItems } = useTasksOfCommittee(id);
  const { data: member, loading: loadMembers } = useListMembersOfCommittee(id);

  return (
    <div className="w-full text-black">
      <div className="flex items-center gap-2.5 font-semibold">
        <ArrowLeft />
        Ban
      </div>
      <div className="mt-2.5 border-b mb-2.5">
        <h2 className="text-3xl">
          {committeeInfor && committeeInfor.committeeName}
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
            <div className="flex gap-2 items-center text-white text-sm bg-sfit-primary-dark px-3 py-1.5 rounded-2xl">
              <Plus size={18} />
              Tạo nhiệm vụ mới
            </div>
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
                <Pen />
              </div>
              <div className="flex cursor-pointer justify-center items-center w-7 h-7 p-2 border border-gray-500 rounded-md">
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
              {targets.map(({ title, expired, headDo, secretaryDo }, index) => (
                <tr key={index}>
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
            <AccountItem key={account.id} account={account} />
          ))
        )}
      </Panel>
    </div>
  );
}
