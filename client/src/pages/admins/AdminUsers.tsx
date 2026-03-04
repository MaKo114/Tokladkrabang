import { blockUser, getAllUser, unblockUser } from "@/api/user";
import useTestStore from "@/store/tokStore";
import { useEffect, useState } from "react";
import Title from "../../titles/Title";
import Swal from "sweetalert2";
import { UserCheck, UserX, Mail, Hash, ShieldCheck, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "BANNED";
}

const AdminUsers = () => {
  const token = useTestStore((s) => s.token);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUser = async () => {
    try {
      const res = await getAllUser(token);
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch user error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const toggleStatus = async (id: number, currentStatus: "ACTIVE" | "BANNED") => {
    const isBlocking = currentStatus === "ACTIVE";
    
    const result = await Swal.fire({
      title: isBlocking ? "ระงับการใช้งาน?" : "ยกเลิกการระงับ?",
      text: isBlocking 
        ? "ผู้ใช้รายนี้จะไม่สามารถเข้าสู่ระบบได้ชั่วคราว" 
        : "ผู้ใช้จะกลับมาใช้งานระบบได้ตามปกติ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocking ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isBlocking ? "ยืนยันการระงับ" : "ยืนยันการคืนสิทธิ์",
      cancelButtonText: "ยกเลิก",
      borderRadius: "15px",
    });

    if (result.isConfirmed) {
      try {
        if (isBlocking) {
          await blockUser(token, id);
        } else {
          await unblockUser(token, id);
        }

        setUsers((prev) =>
          prev.map((u) =>
            u.student_id === id
              ? { ...u, status: isBlocking ? "BANNED" : "ACTIVE" }
              : u
          )
        );

        Swal.fire({
          title: "สำเร็จ!",
          text: "อัปเดตสถานะผู้ใช้เรียบร้อย",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเปลี่ยนสถานะได้", "error");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.student_id.toString().includes(searchTerm)
  );
  
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers.length]);
  

  return (
    <div className="space-y-6 font-['Inter',_sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Title />
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            User <span className="text-[#FF5800]">Management</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">จัดการสมาชิกและตรวจสอบสถานะการเข้าใช้งาน</p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5800] transition-colors" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ รหัสนักศึกษา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#FF5800]/20 focus:border-[#FF5800] transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500">
              Showing {Math.min(indexOfFirstUser + 1, filteredUsers.length)} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} Users
            </p>

            <div className="flex items-center gap-2">
              {/* ปุ่มถอยหลัง */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled = {currentPage === 1} 
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
              </button>
              {/* ปุมตัวเลขหน้า */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_,i) => i + 1).map((page)=>(
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                      currentPage === page
                      ? "bg-[#FF5800] text-white shadow-md shadow-[#FF5800]/20"
                      :"text-gray-400 hover:bg-white hover:text-[#FF5800]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              {/* ปุ่มไปข้างหน้า */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                  <div className="flex items-center gap-2"><Hash size={14}/> Student Info</div>
                </th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                  <div className="flex items-center gap-2"><Mail size={14}/> Email</div>
                </th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                  <div className="flex items-center gap-2"><ShieldCheck size={14}/> Role</div>
                </th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-center">
                  Status
                </th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentUsers.length > 0 ? currentUsers.map((user) => (
                <tr key={user.student_id} className="hover:bg-orange-50/20 transition-all duration-200 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF5800]/10 text-[#FF5800] rounded-full flex items-center justify-center font-black text-sm border border-[#FF5800]/20">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user.first_name} {user.last_name}</div>
                        <div className="text-[11px] text-gray-400 font-mono">ID: {user.student_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.status === "ACTIVE" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`} />
                      {user.status === "ACTIVE" ? "Active" : "Banned"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => toggleStatus(user.student_id, user.status)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        user.status === "ACTIVE"
                          ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {user.status === "ACTIVE" ? (
                        <><UserX size={14} strokeWidth={3} /> Block Member</>
                      ) : (
                        <><UserCheck size={14} strokeWidth={3} /> Unblock Member</>
                      )}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    ไม่พบข้อมูลผู้ใช้ที่คุณค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;