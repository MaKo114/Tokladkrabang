import NavbarAdmin from "../components/navbars/NavbarAdmin";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]"> {/* พื้นหลังเทาอ่อนสไตล์แอปสมัยใหม่ */}
      {/* Sidebar - ตัวมันเองจะ Sticky อยู่ข้างในก้อน flex นี้ */}
      <NavbarAdmin />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-8 lg:p-12">
          {/* Outlet จะเปลี่ยนหน้าไปตามเมนูที่เลือก */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;