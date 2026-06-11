import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/useUserStore';
import type { Activity, ActivityStatus } from '@/data/activities';

interface ActivityCardProps {
  activity: Activity;
  onRegister: (activity: Activity) => void;
  className?: string;
}

const statusConfig: Record<ActivityStatus, { label: string; color: string }> = {
  upcoming: { label: '即将开始', color: 'bg-blue-100 text-blue-700' },
  ongoing: { label: '进行中', color: 'bg-green-100 text-green-700' },
  ended: { label: '已结束', color: 'bg-gray-100 text-gray-500' },
};

export default function ActivityCard({ activity, onRegister, className }: ActivityCardProps) {
  const { registrations, toggleRemind } = useUserStore();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const registration = registrations.find((r) => r.activityId === activity.id);
  const isRegistered = !!registration;

  const config = statusConfig[activity.status];
  const progress = Math.round((activity.registeredCount / activity.capacity) * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getButtonText = () => {
    if (activity.status === 'ended') return '活动已结束';
    if (progress >= 100) return '名额已满';
    if (isRegistered) return '已报名 ✓';
    return '立即报名';
  };

  const isButtonDisabled = activity.status === 'ended' || progress >= 100 || isRegistered;

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-slide-up',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
            <h3 className="text-lg font-serif font-bold text-ink">
              {activity.title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {activity.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-gold" />
          {activity.date}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2 text-gold" />
          {activity.time}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 text-gold" />
          {activity.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2 text-gold" />
          {activity.registeredCount}/{activity.capacity} 人
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>报名进度</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-gold rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {isRegistered && (
        <div className="mb-4 p-3 bg-gold/10 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-sm text-ink">
            {registration.reminded ? (
              <Bell size={16} className="mr-2 text-gold" />
            ) : (
              <BellOff size={16} className="mr-2 text-gray-400" />
            )}
            <span>{registration.reminded ? '已开启活动提醒' : '活动提醒未开启'}</span>
          </div>
          <button
            onClick={() => toggleRemind(registration.id)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              registration.reminded ? 'bg-gold' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                registration.reminded ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      )}

      <button
        onClick={() => !isButtonDisabled && onRegister(activity)}
        disabled={isButtonDisabled}
        className={cn(
          'w-full py-3 rounded-lg transition-colors font-medium',
          isButtonDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-ink text-white hover:bg-ink/90'
        )}
      >
        {getButtonText()}
      </button>
    </div>
  );
}
