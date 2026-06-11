import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Users, X } from "lucide-react";
import { useActivityStore } from "@/stores/useActivityStore";
import type { Activity, ActivityStatus } from "@/data/activities";

const statusConfig: Record<ActivityStatus, { label: string; color: string }> = {
  upcoming: { label: "即将开始", color: "bg-blue-100 text-blue-700" },
  ongoing: { label: "进行中", color: "bg-green-100 text-green-700" },
  ended: { label: "已结束", color: "bg-gray-100 text-gray-500" },
};

const statusOptions: ActivityStatus[] = ['upcoming', 'ongoing', 'ended'];

interface FormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  status: ActivityStatus;
}

const emptyForm: FormData = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  capacity: 50,
  status: 'upcoming',
};

export default function ActivityManagement() {
  const activities = useActivityStore((s) => s.activities);
  const addActivity = useActivityStore((s) => s.addActivity);
  const updateActivity = useActivityStore((s) => s.updateActivity);
  const deleteActivity = useActivityStore((s) => s.deleteActivity);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = activities.filter((a) => {
    if (!searchKeyword) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      a.title.toLowerCase().includes(kw) ||
      a.location.toLowerCase().includes(kw)
    );
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingId(activity.id);
    setForm({
      title: activity.title,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      description: activity.description,
      capacity: activity.capacity,
      status: activity.status,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    if (editingId) {
      updateActivity(editingId, {
        title: form.title,
        date: form.date,
        time: form.time,
        location: form.location,
        description: form.description,
        capacity: form.capacity,
        status: form.status,
      });
    } else {
      const newActivity: Activity = {
        id: `a_${Date.now()}`,
        title: form.title,
        date: form.date,
        time: form.time,
        location: form.location,
        description: form.description,
        capacity: form.capacity,
        registeredCount: 0,
        status: form.status,
      };
      addActivity(newActivity);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-ink">活动管理</h1>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <Plus size={18} />
          <span>新增活动</span>
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
              placeholder="搜索活动名称、地点..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名情况</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((activity) => {
                const config = statusConfig[activity.status];
                const progress = activity.capacity > 0 ? Math.round((activity.registeredCount / activity.capacity) * 100) : 0;
                return (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">{activity.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{activity.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{activity.date}</div>
                      <div className="text-gray-400">{activity.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Users size={14} className="mr-1 text-gold" />
                        {activity.registeredCount}/{activity.capacity}
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-gold rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(activity)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(activity.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-ink mb-3">确认删除</h3>
            <p className="text-gray-600 mb-6">确定要删除该活动吗？此操作不可恢复。</p>
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
              <h3 className="text-lg font-bold text-ink">{editingId ? '编辑活动' : '新增活动'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="请输入活动标题"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="如 14:00-16:00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="请输入活动地点"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold resize-none"
                  placeholder="请输入活动描述"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名额</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    min={1}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ActivityStatus })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
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
