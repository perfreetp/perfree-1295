import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye, X } from "lucide-react";
import { useCollectionStore } from "@/stores/useCollectionStore";
import type { Collection, Category, Dynasty } from "@/data/collections";

const categories: Category[] = ['书画', '陶瓷', '玉器', '青铜', '其他'];
const dynasties: Dynasty[] = ['商', '周', '秦', '汉', '唐', '宋', '元', '明', '清', '近代'];

const img = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`;

interface FormData {
  title: string;
  category: Category;
  dynasty: Dynasty;
  description: string;
}

const emptyForm: FormData = {
  title: '',
  category: '青铜',
  dynasty: '唐',
  description: '',
};

export default function ContentManagement() {
  const items = useCollectionStore((s) => s.items);
  const addItem = useCollectionStore((s) => s.addItem);
  const updateItem = useCollectionStore((s) => s.updateItem);
  const deleteItem = useCollectionStore((s) => s.deleteItem);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (!searchKeyword) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      item.title.toLowerCase().includes(kw) ||
      item.dynasty.toLowerCase().includes(kw) ||
      item.category.toLowerCase().includes(kw)
    );
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (item: Collection) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      dynasty: item.dynasty,
      description: item.description,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    if (editingId) {
      updateItem(editingId, {
        title: form.title,
        category: form.category,
        dynasty: form.dynasty,
        description: form.description,
      });
    } else {
      const newItem: Collection = {
        id: `c_${Date.now()}`,
        title: form.title,
        category: form.category,
        dynasty: form.dynasty,
        description: form.description,
        images: [img(`${form.dynasty}代${form.category}文物${form.title}，博物馆藏品，专业摄影`)],
        audioUrl: '',
        videoUrl: '',
        viewCount: 0,
      };
      addItem(newItem);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-ink">内容管理</h1>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <Plus size={18} />
          <span>新增藏品</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索藏品名称、朝代、类别..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">藏品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">朝代</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览量</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <span className="font-medium text-ink">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.dynasty}代</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.viewCount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-md transition-colors">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">共 {filtered.length} 条记录</span>
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-ink mb-3">确认删除</h3>
            <p className="text-gray-600 mb-6">确定要删除该藏品吗？此操作不可恢复。</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-ink">{editingId ? '编辑藏品' : '新增藏品'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="请输入藏品名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">朝代</label>
                  <select
                    value={form.dynasty}
                    onChange={(e) => setForm({ ...form, dynasty: e.target.value as Dynasty })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  >
                    {dynasties.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold resize-none"
                  placeholder="请输入藏品描述"
                />
              </div>
              {!editingId && (
                <p className="text-xs text-gray-400">新增藏品将自动生成展示图片</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gold text-white rounded-lg text-sm hover:bg-gold/90"
              >
                {editingId ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
