import { Search, Check, X, MessageCircle, User } from "lucide-react";

const messages = [
  {
    id: "m001",
    user: "张三",
    avatar: "",
    content: "这个展品真的太棒了！讲解非常详细，让我对青铜器有了更深的了解。",
    item: "后母戊鼎",
    time: "2026-06-12 14:30",
    type: "comment",
  },
  {
    id: "m002",
    user: "李四",
    avatar: "",
    content: "请问四羊方尊现在收藏在哪个博物馆？有机会想去看看实物。",
    item: "四羊方尊",
    time: "2026-06-12 11:20",
    type: "question",
  },
  {
    id: "m003",
    user: "王五",
    avatar: "",
    content: "希望能增加更多关于唐宋书画的内容，非常喜欢这个板块！",
    item: "书画专区",
    time: "2026-06-11 16:45",
    type: "comment",
  },
];

export default function MessageReview() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-ink">留言审核</h1>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">全部</button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">待审核</button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">已通过</button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">已拒绝</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户、内容..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-ink">{msg.user}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        msg.type === "question"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {msg.type === "question" ? "提问" : "评论"}
                      </span>
                      <span className="text-sm text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{msg.content}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageCircle size={14} className="mr-1" />
                      关联：{msg.item}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="通过">
                    <Check size={18} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="拒绝">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
