import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, ImagePlus, ChevronLeft, MoreVertical, User, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockMessages = [
  { id: 1, sender: "other", text: "สวัสดีครับ สนใจแลกของชิ้นนี้ไหมครับ?", time: "15:30" },
  { id: 2, sender: "me", text: "สนใจครับ! ของยังอยู่ไหมครับ?", time: "15:32" },
  { id: 3, sender: "other", text: "ยังอยู่ครับ สภาพดีมากเลย ใช้ไปแค่ 2 ครั้ง", time: "15:33" },
  { id: 4, sender: "me", text: "แลกกับหูฟังบลูทูธได้ไหมครับ ถ้ามี", time: "15:36" },
];

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postOwner = searchParams.get("user") || "Manasak Mako";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text: message,
        time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F0F2F5] py-6 px-4 md:py-10">
      {/* --- Main Chat Container --- */}
      <div className="mx-auto max-w-4xl w-full h-[85vh] bg-white rounded-[32px] shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden border border-white">
        
        {/* --- Header --- */}
        <header className="px-6 py-4 bg-white border-b border-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:text-[#FF5800]"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-orange-50">
                  <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-50 text-[#FF5800] font-bold">
                    <User size={24} />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <p className="text-base font-black text-gray-900 leading-tight">{postOwner}</p>
                <div className="flex items-center gap-1 mt-0.5">
                   <ShieldCheck size={12} className="text-blue-500" />
                   <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Verified Swapper</p>
                </div>
              </div>
            </div>
          </div>

          <button className="p-2.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </header>

        {/* --- Message List --- */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
        >
          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-5 py-3.5 shadow-sm ${
                    isMe 
                      ? "bg-[#FF5800] text-white rounded-[22px] rounded-br-none" 
                      : "bg-white border border-gray-100 text-gray-800 rounded-[22px] rounded-bl-none"
                  }`}>
                    <p className="text-[14px] font-medium leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-black mt-2 px-1 opacity-60">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
        </main>

        {/* --- Input Area --- */}
        <footer className="p-6 bg-white shrink-0">
          <div className="flex items-center gap-3 bg-[#F8F9FA] p-2.5 rounded-[24px] ring-1 ring-gray-100 focus-within:ring-2 focus-within:ring-[#FF5800]/20 focus-within:bg-white transition-all">
            <button className="p-2.5 text-gray-400 hover:text-[#FF5800] hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
              <ImagePlus size={22} />
            </button>

            <input
              type="text"
              placeholder="พิมพ์ข้อความตอบกลับ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent border-none py-2 text-[14px] font-bold outline-none placeholder:text-gray-400 placeholder:font-medium"
            />

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`flex h-12 w-12 items-center justify-center rounded-[18px] transition-all ${
                message.trim() 
                  ? "bg-[#FF5800] text-white shadow-lg shadow-orange-200 hover:scale-105 active:scale-95" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={20} fill={message.trim() ? "currentColor" : "none"} />
            </button>
          </div>
         
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;