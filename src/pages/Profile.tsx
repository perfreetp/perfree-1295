import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Award,
  Calendar,
  Heart,
  BookOpen,
  LogOut,
  History,
  X,
  Bell,
  BellOff,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Sparkles,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { useLearningStore } from '@/stores/useLearningStore';
import { collections, type Collection } from '@/data/collections';
import { activities, type Activity } from '@/data/activities';
import { defaultUsers, type User as UserType } from '@/data/users';
import StatsChart from '@/components/Profile/StatsChart';
import { cn } from '@/lib/utils';

type TabKey = 'overview' | 'favorites' | 'registrations' | 'learning' | 'certificates' | 'history';

const tabItems: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: 'overview', label: '概览', icon: User },
  { key: 'favorites', label: '我的收藏', icon: Heart },
  { key: 'registrations', label: '活动预约', icon: Calendar },
  { key: 'learning', label: '学习记录', icon: BookOpen },
  { key: 'certificates', label: '我的证书', icon: Award },
  { key: 'history', label: '浏览历史', icon: History },
];

const defaultUser: UserType = defaultUsers[1];

function OverviewTab() {
  const user = useUserStore((s) => s.user) ?? defaultUser;
  const favorites = useUserStore((s) => s.favorites);
  const registrations = useUserStore((s) => s.registrations);
  const certificates = useUserStore((s) => s.certificates);
  const { tasks, taskProgress } = useLearningStore();

  const completedTasks = Object.values(taskProgress).filter(
    (p) => p.status === 'completed'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-ink via-ink to-teal rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-24 h-24 rounded-full ring-4 ring-gold/40 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold rounded-full flex items-center justify-center ring-2 ring-white text-xs font-bold text-ink">
              LV3
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-serif font-bold mb-1">{user.nickname}</h1>
            <p className="text-gray-300 mb-4">ID: {user.id.toUpperCase()}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <div>
                <div className="text-2xl font-bold text-gold">{favorites.length}</div>
                <div className="text-sm text-gray-400">收藏</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">{registrations.length}</div>
                <div className="text-sm text-gray-400">活动</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">{completedTasks}</div>
                <div className="text-sm text-gray-400">任务</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">{certificates.length}</div>
                <div className="text-sm text-gray-400">证书</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
          <BookOpen className="text-gold" size={20} />
          学习进度
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tasks.map((task) => {
            const progress = taskProgress[task.id];
            const total = task.quizzes.length;
            const answered = progress
              ? progress.status === 'completed'
                ? total
                : Math.floor(((progress.score || 0) / 100) * total)
              : 0;
            const percent = progress
              ? progress.status === 'completed'
                ? 100
                : progress.score || 0
              : 0;

            return (
              <div key={task.id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-ink mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {progress?.status === 'completed' ? (
                        <span className="text-teal flex items-center gap-1">
                          <CheckCircle size={14} /> 已完成 · {progress.score}分
                        </span>
                      ) : progress?.status === 'in_progress' ? (
                        <span className="text-gold flex items-center gap-1">
                          <Clock size={14} /> 进行中 · {answered}/{total}题
                        </span>
                      ) : (
                        <span className="text-gray-400">未开始</span>
                      )}
                    </p>
                  </div>
                  {progress?.status === 'completed' ? (
                    <Trophy size={20} className="text-gold" />
                  ) : (
                    <BookOpen size={20} className="text-teal" />
                  )}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      progress?.status === 'completed'
                        ? 'bg-gradient-gold'
                        : 'bg-gradient-teal'
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
          <Sparkles className="text-gold" size={20} />
          数据统计
        </h2>
        <StatsChart />
      </div>
    </div>
  );
}

function FavoritesTab() {
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const navigate = useNavigate();

  const favoriteItems: Collection[] = favorites
    .map((id) => collections.find((c) => c.id === id))
    .filter((c): c is Collection => !!c);

  if (favoriteItems.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-serif font-bold text-ink mb-2">暂无收藏</h3>
        <p className="text-gray-500 mb-6">快去云展厅发现你喜欢的文物吧</p>
        <Link
          to="/exhibition"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-ink rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <ChevronRight size={18} />
          前往云展厅
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
      {favoriteItems.map((item) => (
        <div
          key={item.id}
          className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div
            className="relative aspect-[4/3] overflow-hidden bg-ink/5 cursor-pointer"
            onClick={() => navigate(`/exhibition/${item.id}`)}
          >
            <img
              src={item.images[0]}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
              className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors"
            >
              <Heart size={18} fill="currentColor" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="mb-2 font-serif text-lg font-semibold text-white line-clamp-1">
                {item.title}
              </h3>
              <div className="flex gap-2">
                <span className="rounded bg-gold px-2 py-0.5 text-xs font-medium text-white">
                  {item.dynasty}
                </span>
                <span className="rounded bg-teal px-2 py-0.5 text-xs font-medium text-white">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RegistrationsTab() {
  const registrations = useUserStore((s) => s.registrations);
  const toggleRemind = useUserStore((s) => s.toggleRemind);

  if (registrations.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-serif font-bold text-ink mb-2">暂无预约</h3>
        <p className="text-gray-500 mb-6">快去报名感兴趣的活动吧</p>
        <Link
          to="/activity"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-ink rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <ChevronRight size={18} />
          查看活动
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {registrations.map((reg) => {
        const activity: Activity | undefined = activities.find((a) => a.id === reg.activityId);
        return (
          <div
            key={reg.id}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-serif font-bold text-ink text-lg">{reg.activityTitle}</h3>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-medium',
                    activity?.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : activity?.status === 'ongoing'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {activity?.status === 'upcoming'
                    ? '即将开始'
                    : activity?.status === 'ongoing'
                    ? '进行中'
                    : '已结束'}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  报名日期: {reg.registerDate}
                </span>
                {activity && (
                  <>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      活动时间: {activity.date} {activity.time}
                    </span>
                    <span>📍 {activity.location}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 md:flex-shrink-0">
              <button
                onClick={() => toggleRemind(reg.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  reg.reminded
                    ? 'bg-gold/10 text-gold hover:bg-gold/20'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
              >
                {reg.reminded ? <Bell size={16} /> : <BellOff size={16} />}
                提醒我
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LearningTab() {
  const { tasks, taskProgress, userAnswers } = useLearningStore();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-serif font-bold text-ink mb-2">暂无学习任务</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {tasks.map((task) => {
        const progress = taskProgress[task.id];
        const total = task.quizzes.length;
        const answered = progress
          ? progress.status === 'completed'
            ? total
            : Math.floor(((progress.score || 0) / 100) * total)
          : 0;
        const percent = progress
          ? progress.status === 'completed'
            ? 100
            : progress.score || 0
          : 0;

        return (
          <div key={task.id} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-ink text-lg mb-1">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              {progress?.status === 'completed' && (
                <div className="flex items-center gap-1 bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium">
                  <Trophy size={16} />
                  {progress.score}分
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  进度: {answered}/{total} 题
                </span>
                <span className="font-medium text-ink">{percent}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    progress?.status === 'completed' ? 'bg-gradient-gold' : 'bg-gradient-teal'
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {progress?.status === 'completed' && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 mb-3">答题详情:</p>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {task.quizzes.map((quiz, idx) => {
                    const key = `${task.id}_${idx}`;
                    const userAnswer = userAnswers[key];
                    const isCorrect = userAnswer === quiz.correctIndex;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'aspect-square rounded-lg flex items-center justify-center text-sm font-medium',
                          isCorrect
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        )}
                        title={`第${idx + 1}题: ${isCorrect ? '答对' : '答错'}`}
                      >
                        {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {progress?.status !== 'completed' && (
              <Link
                to="/learning"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors text-sm font-medium"
              >
                <BookOpen size={16} />
                {progress?.status === 'in_progress' ? '继续学习' : '开始学习'}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CertificatesTab() {
  const certificates = useUserStore((s) => s.certificates);

  if (certificates.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Award size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-serif font-bold text-ink mb-2">暂无证书</h3>
        <p className="text-gray-500 mb-6">完成学习任务即可获得证书</p>
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-ink rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <BookOpen size={18} />
          去学习
        </Link>
      </div>
    );
  }

  const handlePreview = (certId: string) => {
    alert(`预览证书: ${certId}`);
  };

  const handleDownload = (certId: string) => {
    alert(`下载证书: ${certId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="relative p-1 bg-gradient-to-br from-gold via-yellow-400 to-gold">
            <div className="bg-gradient-to-br from-cream to-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center">
                <Award size={32} className="text-gold" />
              </div>
              <h4 className="font-serif font-bold text-ink text-lg mb-2">{cert.taskTitle}</h4>
              <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-3" />
              <p className="text-xs text-gray-500 mb-1">证书编号</p>
              <p className="font-mono text-sm text-ink mb-3">{cert.id.toUpperCase()}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                颁发日期: {cert.issueDate}
              </div>
              <div className="mt-3 flex items-center justify-center gap-1">
                <Trophy size={14} className="text-gold" />
                <span className="text-gold font-bold text-lg">{cert.score}分</span>
              </div>
            </div>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => handlePreview(cert.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
            >
              <Eye size={16} />
              预览
            </button>
            <button
              onClick={() => handleDownload(cert.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-gold hover:bg-gold/5 transition-colors font-medium"
            >
              <Download size={16} />
              下载
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab() {
  const browseHistory = useUserStore((s) => s.browseHistory);

  if (browseHistory.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <History size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-serif font-bold text-ink mb-2">暂无浏览记录</h3>
        <p className="text-gray-500 mb-6">快去探索文物吧</p>
        <Link
          to="/exhibition"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-ink rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <ChevronRight size={18} />
          前往云展厅
        </Link>
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/20" />
      <div className="space-y-4">
        {browseHistory.map((item) => {
          const collection = collections.find((c) => c.id === item.collectionId);
          return (
            <div key={item.id} className="relative pl-16">
              <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-gold ring-4 ring-cream" />
              <Link
                to={`/exhibition/${item.collectionId}`}
                className="block bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow flex gap-4"
              >
                <img
                  src={collection?.images[0] ?? item.collectionImage}
                  alt={item.collectionTitle}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-ink mb-1 line-clamp-1">
                    {item.collectionTitle}
                  </h4>
                  {collection && (
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded">
                        {collection.dynasty}
                      </span>
                      <span className="px-2 py-0.5 bg-teal/10 text-teal text-xs rounded">
                        {collection.category}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <History size={12} />
                    浏览于 {item.browseDate}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-300 self-center flex-shrink-0" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const login = useUserStore((s) => s.login);

  const handleQuickLogin = (user: UserType) => {
    login(user);
    onClose();
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

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'favorites':
        return <FavoritesTab />;
      case 'registrations':
        return <RegistrationsTab />;
      case 'learning':
        return <LearningTab />;
      case 'certificates':
        return <CertificatesTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isLoggedIn && (
        <div className="mb-6 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border border-gold/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Sparkles className="text-gold" size={20} />
            </div>
            <div>
              <p className="font-medium text-ink">登录后体验完整功能</p>
              <p className="text-sm text-gray-500">保存收藏、预约活动、获取证书</p>
            </div>
          </div>
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gold text-ink rounded-lg hover:bg-gold/90 transition-colors font-medium"
          >
            <LogIn size={18} />
            立即登录
          </button>
        </div>
      )}

      {isLoggedIn && user && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.nickname} className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/30" />
            <div>
              <p className="font-medium text-ink">{user.nickname}</p>
              <p className="text-xs text-gray-500">
                {user.role === 'admin' ? '管理员' : '普通用户'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-1 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-gradient-gold text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {renderTabContent()}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
