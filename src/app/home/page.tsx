import SideBar from "@/components/SideBar/SideBar";
import NavBar from "@/components/NavBar/NavBar";
export default function page() {
  return (
    <div className="flex">
      <SideBar />
      <NavBar />
      <p>Nội dung trang chủ</p>
    </div>
  );
}
