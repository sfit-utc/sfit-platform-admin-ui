"use client";
import AccountBox from "@/components/Box/AccountBox";
import { useState } from "react";
import AccountList from "@/components/Account/AccountList";
export default function page() {
  return (
    <div className="my-5">
      <div className="flex justify-between ">
        <AccountBox members={99} type={"Tổng thành viên"} index={0} />
        <AccountBox members={70} type={"Thành viên"} index={1} />
        <AccountBox members={30} type={"Lãnh đạo ban"} index={2} />
        <AccountBox members={0} type={"Thành viên mới"} index={3} />
      </div>

      <AccountList />
    </div>
  );
}
