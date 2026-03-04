import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, SendHorizonal } from "lucide-react";

interface PostCommentsProps {
  postId: number;
}

const PostComments = ({ postId }: PostCommentsProps) => {
  // สมมติว่านี่คือข้อมูล Mockup (ในอนาคตใช้ fetch ตาม postId)
  const comments = [
    {
      id: 1,
      user: "John Doe",
      text: "ของชิ้นนี้ยังอยู่ไหมครับ? สนใจอยากเอาหนังสือไปแลกด้วย",
      time: "20 นาทีที่แล้ว",
      isOwner: false,
    },
    {
      id: 2,
      user: "สมชาย มาลัย",
      text: "ยังอยู่ครับผม ทักแชทมาคุยรายละเอียดได้เลยครับ",
      time: "10 นาทีที่แล้ว",
      isOwner: true,
    },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-gray-50 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      
      {/* --- Comment List --- */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0 border border-gray-100">
              <AvatarFallback className={`${comment.isOwner ? 'bg-orange-100 text-[#FF5800]' : 'bg-gray-100 text-gray-400'} text-[10px] font-bold`}>
                <User size={14} />
              </AvatarFallback>
            </Avatar>
            
            <div className={`flex flex-col gap-1 p-3 rounded-[20px] rounded-tl-none flex-1 shadow-sm ${
              comment.isOwner 
                ? 'bg-orange-50/50 border border-orange-100' 
                : 'bg-gray-50 border border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <p className={`text-[11px] font-black ${comment.isOwner ? 'text-[#FF5800]' : 'text-gray-900'}`}>
                  {comment.user} {comment.isOwner && "(เจ้าของโพสต์)"}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                  {comment.time}
                </p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Comment Input --- */}
      <div className="flex items-center gap-3 pt-2 bg-white sticky bottom-0">
        <Avatar className="h-9 w-9 shrink-0 border-2 border-orange-50">
          <AvatarFallback className="bg-orange-50 text-[#FF5800]">
             <User size={18} />
          </AvatarFallback>
        </Avatar>
        <div className="relative flex-1 group">
          <input 
            type="text" 
            placeholder="เขียนคอมเมนต์ของคุณ..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#FF5800]/20 focus:bg-white transition-all font-medium pr-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-[#FF5800] transition-colors active:scale-90">
            <SendHorizonal size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComments;