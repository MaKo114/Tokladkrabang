import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Camera, Mail, Phone, Lock, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

const EditProfile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "นมศักดิ์ มาโล",
    email: "nomsak@example.com",
    phone: "081-234-5678",
    password: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    navigate("/my-posts");
  };

  return (
    // ปรับเป็น h-screen และ overflow-hidden เพื่อไม่ให้เลื่อน
    <div className="h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Container หลัก จำกัดความกว้างและความสูงไม่ให้เกินหน้าจอ */}
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- Cover Image Section (ลดความสูงลงเล็กน้อย) --- */}
        <div className="relative h-36 shrink-0 bg-gradient-to-r from-[#FFB800] to-[#FF5800]">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cuisines.png')]"></div>
          
          {/* Back Button อยู่ใน Cover เลยเพื่อประหยัดที่ */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <button className="absolute bottom-3 right-4 flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white border border-white/30 hover:bg-white/40 transition-all shadow-lg">
            <Camera size={14} />
            เปลี่ยนรูปหน้าปก
          </button>
        </div>

        {/* --- Profile Picture Section --- */}
        <div className="relative -mt-12 flex justify-center shrink-0">
          <div className="relative group cursor-pointer" onClick={handleClick}>
            <Avatar className="h-28 w-28 border-[5px] border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
              {preview ? (
                <img src={preview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-orange-50 text-[#FF5800]">
                  <User size={40} />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity border-[5px] border-white">
              <Camera size={20} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5800] text-white border-4 border-white shadow-lg">
              <Camera size={12} />
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        {/* --- Form Section (ปรับ Padding ให้กระชับ) --- */}
        <div className="flex-1 px-8 md:px-12 py-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase ml-1">ชื่อ-นามสกุล</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="pl-9 h-10 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#FF5800]/20 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase ml-1">เบอร์โทรศัพท์</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="pl-9 h-10 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#FF5800]/20 font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase ml-1">อีเมล</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#FF5800]/20 font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase ml-1">รหัสผ่านใหม่</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#FF5800]/20 font-bold text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Action Buttons (Fixed at Bottom) --- */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 shrink-0">
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 h-11 rounded-xl font-bold text-gray-400 hover:bg-gray-100"
              onClick={() => navigate(-1)}
            >
              ยกเลิก
            </Button>
            <Button
              className="flex-[2] h-11 rounded-xl bg-[#FF5800] text-white font-black shadow-lg shadow-orange-100 hover:bg-[#E64F00] flex gap-2 active:scale-95 transition-all"
              onClick={handleSave}
            >
              <Save size={18} />
              บันทึกข้อมูล
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;