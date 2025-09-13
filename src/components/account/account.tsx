"use client";
import AccountList from "@/components/account/account-list";
import DashboardAction from "@/components/ui/dashboard-action";
import { useAccountStats } from "@/hooks/use-account-service";
import Loading from "@/components/ui/loading";

export default function Account() {
  const { data: stats, loading, error, refetch } = useAccountStats();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const accountInfo = [
    {
      children: "Tổng tài khoản",
      textColor: "sfit-blue",
      bgColor: "sfit-blue-light",
      number: stats.totalUsers,
    },
    {
      children: "Tài khoản hoạt động",
      textColor: "sfit-green",
      bgColor: "sfit-green-light",
      number: stats.activeUsers,
    },
    {
      children: "Lãnh đạo",
      textColor: "sfit-purple",
      bgColor: "sfit-purple-light",
      number: stats.leaders,
    },
    {
      children: "Tài khoản mới",
      textColor: "sfit-yellow",
      bgColor: "sfit-yellow-light",
      number: stats.newUsers,
    },
  ];

  return (
    <div className="my-5">
      <div className="grid grid-cols-4 gap-5">
        {accountInfo.map(({ children, textColor, bgColor, number }) => {
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

      <AccountList onAccountUpdated={refetch} />
    </div>
  );
}
