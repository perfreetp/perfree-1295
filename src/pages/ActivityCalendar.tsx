import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityStore } from '@/stores/useActivityStore';
import ActivityCard from '@/components/Activity/ActivityCard';
import RegisterModal from '@/components/Activity/RegisterModal';
import type { Activity, ActivityStatus } from '@/data/activities';

type FilterType = 'all' | ActivityStatus;

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'ongoing', label: '进行中' },
  { value: 'ended', label: '已结束' },
];

export default function ActivityCalendar() {
  const { activities, selectedDate, setSelectedDate } = useActivityStore();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const activityListRef = useRef<HTMLDivElement>(null);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysArray = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const hasActivity = (day: number | null) => {
    if (!day) return false;
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.some((a) => a.date === dateStr);
  };

  const selectDay = (day: number | null) => {
    if (!day) return;
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    activityListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];

  const handleRegister = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const filteredActivities = activities.filter((a) => {
    const matchesDate = !selectedDate || a.date === selectedDate;
    const matchesFilter = activeFilter === 'all' || a.status === activeFilter;
    return matchesDate && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-3">活动日历</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          精彩文化活动，尽在掌握。选择日期查看活动详情，在线预约参与。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-serif font-bold text-ink">
                {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysArray().map((day, idx) => {
                const dateStr = day
                  ? `${currentMonth.getFullYear()}-${String(
                      currentMonth.getMonth() + 1
                    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : '';
                const isSelected = dateStr === selectedDate;
                const hasAct = hasActivity(day);

                return (
                  <button
                    key={idx}
                    onClick={() => selectDay(day)}
                    disabled={!day}
                    className={cn(
                      'relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all',
                      !day
                        ? 'invisible'
                        : isSelected
                        ? 'bg-gold text-white font-bold ring-2 ring-gold ring-offset-2'
                        : hasAct
                        ? 'bg-gold/10 text-ink hover:bg-gold/20 hover:ring-2 hover:ring-gold/50 font-medium'
                        : 'hover:bg-gray-100 hover:ring-2 hover:ring-gold/30 text-gray-700'
                    )}
                  >
                    {day}
                    {hasAct && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-gold rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedDate(null)}
                className="w-full py-2.5 text-sm text-gray-600 hover:text-gold transition-colors"
              >
                查看全部活动
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2" ref={activityListRef}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-serif font-bold text-ink">
              {selectedDate ? `${selectedDate} 活动` : '全部活动'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                    activeFilter === opt.value
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gold/10 border border-gray-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-500">
            共 {filteredActivities.length} 场活动
          </div>

          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onRegister={handleRegister}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-serif font-bold text-ink mb-2">暂无活动</h3>
                <p className="text-gray-500">该条件下暂无活动，请尝试其他筛选条件</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RegisterModal
        activity={selectedActivity}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
