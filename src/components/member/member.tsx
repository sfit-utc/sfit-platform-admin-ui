"use client";
import MemberList from "@/components/member/member-list";
import DashboardAction from "@/components/ui/dashboard-action";
import { useMemberStats } from "@/hooks/use-member-service";
import Loading from "@/components/ui/loading";

export default function Member() {
  const { data: stats, loading, error } = useMemberStats();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const memberInfo = [
    {
      children: "Tổng thành viên",
      textColor: "sfit-blue",
      bgColor: "sfit-blue-light",
      number: stats.totalMembers,
    },
    {
      children: "Thành viên",
      textColor: "sfit-green",
      bgColor: "sfit-green-light",
      number: stats.activeMembers,
    },
    {
      children: "Lãnh đạo",
      textColor: "sfit-purple",
      bgColor: "sfit-purple-light",
      number: stats.leaders,
    },
    {
      children: "Thành viên mới",
      textColor: "sfit-yellow",
      bgColor: "sfit-yellow-light",
      number: stats.newMembers,
    },
  ];

  return (
    <div className="my-5">
      <div className="grid grid-cols-4 gap-5">
        {memberInfo.map(({ children, textColor, bgColor, number }) => {
          return (
            <DashboardAction
              key={children}
              className="py-4"
              number={number}
              style={{
                color: `var(--${textColor})`,
                backgroundColor: `var(--${bgColor})`,
              }}
            >
              {children}
            </DashboardAction>
          );
        })}
      </div>

      <MemberList />
    </div>
  );
}
