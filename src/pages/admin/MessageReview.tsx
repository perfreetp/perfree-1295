import { useState } from "react";
import { Search, Check, X, MessageCircle, User } from "lucide-react";
import { useCollectionStore } from "@/stores/useCollectionStore";

type ReviewStatus = 'pending' | 'approved' | 'rejected';
type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const filterLabels: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已拒绝' },
];

const statusBadge: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: '待审核', className: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已通过', className: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', className: 'bg-red-100 text-red-700' },
};

export default function MessageReview() {
  const comments = useCollectionStore((s) => s.comments);
  const items = useCollectionStore((s) => s.items);

  const [reviewStatus, setReviewStatus] = useState<Record<string, ReviewStatus>>({});
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const getStatus = (id: string): ReviewStatus => reviewStatus[id] ?? 'pending';

  const handleApprove = (id: string) => {
    setReviewStatus((prev) => ({ ...prev, [id]: 'approved' }));
  };

  const handleReject = (id: string) => {
    setReviewStatus((prev) => ({ ...prev, [id]: 'rejected' }));
  };

  const filtered = comments.filter((c) => {
    if (filterStatus !== 'all' && getStatus(c.id) !== filterStatus) return false;
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      return (
        c.username.toLowerCase().includes(kw) ||
        c.content.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const getItemTitle = (collectionId: string) => {
    const item = items.find((i) => i.id === collectionId);
    return item?.title ?? '未知藏品';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-ink">留言审核</h1>
        <div className="flex items-center space-x-3">
          {filterLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                filterStatus === key
                  ? 'border-gold bg-gold/10 text-gold font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索用户名、内容..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">暂无符合条件的留言</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((comment) => {
              const status = getStatus(comment.id);
              const badge = statusBadge[status];
              return (
                <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-ink">{comment.username}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${badge.className}`}>
                            {badge.label}
                          </span>
                          <span className="text-sm text-gray-400">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageCircle size={14} className="mr-1" />
                          关联：{getItemTitle(comment.collectionId)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className={`p-2 rounded-md transition-colors ${
                          status === 'approved'
                            ? 'bg-green-100 text-green-600'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title="通过"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleReject(comment.id)}
                        className={`p-2 rounded-md transition-colors ${
                          status === 'rejected'
                            ? 'bg-red-100 text-red-600'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title="拒绝"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
