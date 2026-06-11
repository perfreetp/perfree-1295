import { X, LogIn, ChevronRight } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { defaultUsers, type User } from '@/data/users';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  const login = useUserStore((s) => s.login);

  if (!open) return null;

  const handleQuickLogin = (user: User) => {
    login(user);
    onClose();
    onLoginSuccess?.();
  };

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
            <LogIn size={32} className="text-gold" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink mb-1">欢迎登录</h2>
          <p className="text-gray-500 text-sm">选择账号一键登录</p>
        </div>
        <div className="space-y-3">
          {defaultUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => handleQuickLogin(u)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gold hover:bg-gold/5 transition-all text-left"
            >
              <img src={u.avatar} alt={u.nickname} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink">{u.nickname}</p>
                <p className="text-xs text-gray-500">
                  {u.role === 'admin' ? '管理员账号' : '普通用户账号'}
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
