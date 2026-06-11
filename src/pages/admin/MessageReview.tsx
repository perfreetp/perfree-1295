import { useState, useMemo } from "react";
import { Search, Check, X, MessageCircle, User, CheckSquare, Square } from "lucide-react";
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

const getStatus = (comment: { reviewStatus?: ReviewStatus }): ReviewStatus => comment.reviewStatus ?? 'pending';

export default function MessageReview() {
  const comments = useCollectionStore((s) => s.comments);
  const items = useCollectionStore((s) => s.items);
  const updateCommentReviewStatus = useCollectionStore((s) => s.updateCommentReviewStatus);
  const batchUpdateCommentReviewStatus = useCollectionStore((s) => s.batchUpdateCommentReviewStatus);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      if (filterStatus !== 'all' && getStatus(c) !== filterStatus) return false;
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        return (
          c.username.toLowerCase().includes(kw) ||
          c.content.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [comments, filterStatus, searchKeyword]);

  const pendingFiltered = useMemo(() => filtered.filter((c) => getStatus(c) === 'pending'), [filtered]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  const someFilteredSelected = filtered.some((c) => selectedIds.has(c.id)) && !allFilteredSelected;
  const selectedCount = selectedIds.size;

  const handleApprove = (id: string) => {
    updateCommentReviewStatus(id, 'approved');
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleReject = (id: string) => {
    updateCommentReviewStatus(id, 'rejected');
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleBatchApprove = () => {
    if (selectedIds.size === 0) return;
    batchUpdateCommentReviewStatus(Array.from(selectedIds), 'approved');
    setSelectedIds(new Set());
  };

  const handleBatchReject = () => {
    if (selectedIds.size === 0) return;
    batchUpdateCommentReviewStatus(Array.from(selectedIds), 'rejected');
    setSelectedIds(new Set());
  };

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
              onClick={() => { setFilterStatus(key); setSelectedIds(new Set()); }}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                filterStatus === key
                  ? 'border-gold bg-gold/10 text-gold font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
              {key === 'pending' && pendingFiltered.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-400 text-white text-xs">
                  {pendingFiltered.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="mb-4 bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm text-ink font-medium">
            已选择 {selectedCount} 条留言
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchApprove}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Check size={16} />
              批量通过
            </button>
            <button
              onClick={handleBatchReject}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <X size={16} />
              批量驳回
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-2 text-gray-500 hover:text-ink text-sm transition-colors"
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); setSelectedIds(new Set()); }}
              placeholder="搜索用户名、内容..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {filtered.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-ink transition-colors"
            >
              {allFilteredSelected ? (
                <CheckSquare size={18} className="text-gold" />
              ) : someFilteredSelected ? (
                <CheckSquare size={18} className="text-gold/50" />
              ) : (
                <Square size={18} />
              )}
              {allFilteredSelected ? '取消全选' : '全选'}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">暂无符合条件的留言</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((comment) => {
              const status = getStatus(comment);
              const badge = statusBadge[status];
              const isSelected = selectedIds.has(comment.id);
              return (
                <div
                  key={comment.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gold/5' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => toggleSelect(comment.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare size={20} className="text-gold" />
                        ) : (
                          <Square size={20} className="text-gray-300 hover:text-gray-400 transition-colors" />
                        )}
                      </button>
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
                          {comment.type === 'question' && (
                            <span className="px-2 py-0.5 bg-teal/10 text-teal text-xs rounded">提问</span>
                          )}
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
