import AccountList from "@/components/Account/account-list";
import DashboardAction from "@/components/ui/dashboard-action";
import { useAccountStats } from "@/hooks/use-account-service";
import Loading from "@/components/ui/loading";

export default function Account() {
  const { data: stats, loading, error } = useAccountStats();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const accountInfo = [
    {
      children: "Tổng thành viên",
      textColor: "text-sfit-blue",
      bgColor: "bg-sfit-blue-light",
      number: stats.totalMembers,
    },
    {
      children: "Thành viên",
      textColor: "text-sfit-green",
      bgColor: "bg-sfit-green-light",
      number: stats.activeMembers,
    },
    {
      children: "Lãnh đạo",
      textColor: "text-sfit-purple",
      bgColor: "bg-sfit-purple-light",
      number: stats.leaders,
    },
    {
      children: "Thành viên mới",
      textColor: "text-sfit-yellow",
      bgColor: "bg-sfit-yellow-light",
      number: stats.newMembers,
    },
  ];

  return (
    <div className="my-5">
      <div className="grid grid-cols-4 gap-5">
        {accountInfo.map(({ children, textColor, bgColor, number }) => {
          return (
            <DashboardAction
              key={children}
              className={`${textColor} ${bgColor} py-4`}
              number={number}
            >
              {children}
            </DashboardAction>
          );
        })}
      </div>

      <AccountList />
    </div>
  );
}
