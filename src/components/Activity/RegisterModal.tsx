import { useState } from 'react';
import { X, CheckCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/useUserStore';
import type { Activity } from '@/data/activities';

interface RegisterModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  participantCount: number;
  remark: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function RegisterModal({ activity, isOpen, onClose }: RegisterModalProps) {
  const { addRegistration, registrations, toggleRemind } = useUserStore();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    participantCount: 1,
    remark: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [enableRemind, setEnableRemind] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号格式';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入正确的邮箱格式';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !validateForm()) return;

    addRegistration(activity.id, activity.title);

    if (enableRemind) {
      const reg = registrations.find((r) => r.activityId === activity.id);
      if (reg && !reg.reminded) {
        toggleRemind(reg.id);
      }
    }

    setIsSuccess(true);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      participantCount: 1,
      remark: '',
    });
    setErrors({});
    setIsSuccess(false);
    setEnableRemind(true);
    onClose();
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-ink transition-colors rounded-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-gold" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-ink mb-2">
              报名成功！
            </h3>
            <p className="text-gray-600 mb-6">
              您已成功报名「{activity.title}」，我们将通过短信通知您活动详情。
            </p>

            <div className="mb-6 p-4 bg-gold/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <Bell size={20} className="mr-3 text-gold" />
                <div className="text-left">
                  <div className="font-medium text-ink">设置提醒</div>
                  <div className="text-xs text-gray-500">活动开始前提醒我</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setEnableRemind(!enableRemind);
                  const reg = registrations.find((r) => r.activityId === activity.id);
                  if (reg) {
                    if ((enableRemind && reg.reminded) || (!enableRemind && !reg.reminded)) {
                      toggleRemind(reg.id);
                    }
                  }
                }}
                className={cn(
                  'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                  enableRemind ? 'bg-gold' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                    enableRemind ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium"
            >
              完成
            </button>
          </div>
        ) : (
          <div className="p-8">
            <h3 className="text-2xl font-serif font-bold text-ink mb-2">
              活动报名
            </h3>
            <p className="text-gray-600 mb-6">
              请填写以下信息完成「{activity.title}」的报名
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入您的姓名"
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                    errors.name
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-gold/30 focus:border-gold'
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入您的手机号"
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                    errors.phone
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-gold/30 focus:border-gold'
                  )}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入您的邮箱（选填）"
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all',
                    errors.email
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-gold/30 focus:border-gold'
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  参与人数
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        participantCount: Math.max(1, formData.participantCount - 1),
                      })
                    }
                    className="w-10 h-10 border border-gray-200 rounded-l-lg flex items-center justify-center text-ink hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.participantCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        participantCount: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
                      })
                    }
                    className="w-16 h-10 border-t border-b border-gray-200 text-center focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        participantCount: Math.min(10, formData.participantCount + 1),
                      })
                    }
                    className="w-10 h-10 border border-gray-200 rounded-r-lg flex items-center justify-center text-ink hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  备注
                </label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="如有特殊需求请在此说明（选填）"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-gold text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
                >
                  提交报名
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
