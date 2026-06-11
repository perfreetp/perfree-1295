import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Calendar,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { useActivityStore } from '@/stores/useActivityStore';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    title: '千年文明 璀璨瑰宝',
    subtitle: '穿越时空，探寻中华五千年文化传承',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
      encodeURIComponent('中国博物馆大厅，宏伟古典建筑，金碧辉煌，古代文物展览，墨色与金色交织，国潮风格') +
      '&image_size=landscape_16_9',
  },
  {
    title: '青铜时代 华夏重器',
    subtitle: '商周青铜文明，见证王朝兴衰',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
      encodeURIComponent('商周青铜器展览，大鼎尊爵，古代青铜文明，博物馆展厅，暖光照射，古典典雅') +
      '&image_size=landscape_16_9',
  },
  {
    title: '丹青翰墨 书画瑰宝',
    subtitle: '历代名家真迹，感受笔墨神韵',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
      encodeURIComponent('中国古代书画展览，水墨山水，书法作品，卷轴展开，博物馆展陈，古典文雅') +
      '&image_size=landscape_16_9',
  },
];

const quickNavItems = [
  { icon: Landmark, label: '云展厅', desc: '在线观展', path: '/other' },
  { icon: Calendar, label: '活动日历', desc: '精彩活动', path: '/other' },
  { icon: BookOpen, label: '学习任务', desc: '知识探索', path: '/other' },
  { icon: User, label: '个人中心', desc: '我的收藏', path: '/other' },
];

function formatViewCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

function formatDate(dateStr: string): { month: string; day: string } {
  const date = new Date(dateStr);
  return {
    month: `${date.getMonth() + 1}月`,
    day: `${date.getDate()}日`,
  };
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { items, exhibitions } = useCollectionStore();
  const { activities } = useActivityStore();

  const upcomingActivities = activities
    .filter((a) => a.status === 'upcoming' || a.status === 'ongoing')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-cream">
      <section className="relative h-screen w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/80" />
          </div>
        ))}

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 md:px-8">
          <div
            key={currentSlide}
            className="animate-fade-in"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-wider text-shadow-ink">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-cream/90 mb-8 md:mb-12 max-w-2xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link
              to="/other"
              className="group relative inline-flex items-center gap-2 px-8 md:px-12 py-3 md:py-4 bg-gradient-gold text-ink font-bold text-lg md:text-xl rounded-lg shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/50 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <Sparkles className="w-5 h-5" />
              <span>立即参观</span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-ink/50 hover:bg-ink/70 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-gold/30 hover:border-gold/60"
          aria-label="上一张"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-ink/50 hover:bg-ink/70 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-gold/30 hover:border-gold/60"
          aria-label="下一张"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'transition-all duration-300 rounded-full',
                index === currentSlide
                  ? 'w-10 h-3 bg-gradient-gold shadow-lg shadow-gold/50'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              )}
              aria-label={`跳转到第 ${index + 1} 张`}
            />
          ))}
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-cream to-cream/80">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {quickNavItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className="group flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gold/10 hover:border-gold/40"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/20 flex items-center justify-center mb-4 group-hover:bg-gradient-gold group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-ink mb-1 group-hover:text-gold transition-colors duration-300">
                    {item.label}
                  </h3>
                  <p className="text-sm text-ink/60">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 bg-ink">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                精选展览
              </h2>
              <p className="text-cream/60">探索精彩特展，领略文化魅力</p>
            </div>
            <Link
              to="/other"
              className="hidden md:inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors font-medium"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {exhibitions.map((exhibition) => (
              <Link
                key={exhibition.id}
                to={`/exhibition/${exhibition.id}`}
                className="group flex-shrink-0 w-64 md:w-80 bg-cream/5 rounded-2xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative w-full h-44 md:h-52 overflow-hidden">
                  <img
                    src={exhibition.coverImage}
                    alt={exhibition.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-1">
                    {exhibition.title}
                  </h3>
                  <p className="text-cream/50 text-sm mb-3">
                    {exhibition.startDate} - {exhibition.endDate}
                  </p>
                  <p className="text-cream/70 text-sm line-clamp-2">
                    {exhibition.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 bg-cream">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-2">
                热门藏品
              </h2>
              <p className="text-ink/60">镇馆之宝，传世珍品</p>
            </div>
            <Link
              to="/other"
              className="hidden md:inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors font-medium"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {items.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                to={`/exhibition/${item.id}`}
                className="group relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                <div className="absolute top-2 md:top-3 left-2 md:left-3 flex gap-1 md:gap-2">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-gold/90 text-ink text-xs font-bold rounded-full backdrop-blur-sm">
                    {item.dynasty}
                  </span>
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-ink/60 text-cream text-xs rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-2 md:top-3 right-2 md:right-3 flex items-center gap-1 text-white text-xs bg-ink/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Eye className="w-3 h-3" />
                  <span>{formatViewCount(item.viewCount)}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                  <h3 className="font-serif text-base md:text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-cream/70 text-xs md:text-sm line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-cream/80 to-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-2">
              活动预告
            </h2>
            <p className="text-ink/60">精彩文化活动，期待您的参与</p>
          </div>

          <div className="relative">
            <div className="absolute left-5 md:left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-gold via-gold/60 to-gold/20" />

            <div className="space-y-6 md:space-y-8">
              {upcomingActivities.map((activity, index) => {
                const { month, day } = formatDate(activity.date);
                return (
                  <div key={activity.id} className="relative flex items-start gap-4 md:gap-8 pl-12 md:pl-20">
                    <div className="absolute left-2 md:left-5 top-2 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold/30 z-10">
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white" />
                        </div>
                        {index < upcomingActivities.length - 1 && (
                          <div className="absolute top-6 md:top-7 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gold/30" />
                        )}
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center w-16 h-20 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex-shrink-0">
                      <span className="text-gold text-xs font-medium">{month}</span>
                      <span className="text-ink font-serif text-2xl font-bold">{day}</span>
                    </div>

                    <div className="flex-1 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gold/10 hover:border-gold/30">
                      <div className="md:hidden mb-2">
                        <span className="text-gold text-sm font-bold">
                          {month}{day}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg md:text-2xl font-bold text-ink mb-2 hover:text-gold transition-colors duration-300">
                        {activity.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-ink/60 mb-3 md:mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gold" />
                          {activity.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gold" />
                          {activity.location}
                        </span>
                      </div>
                      <p className="text-ink/70 text-sm md:text-base mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-ink/50">
                          已报名 {activity.registeredCount}/{activity.capacity}
                        </div>
                        <button
                          className="px-4 md:px-6 py-2 bg-gradient-gold text-ink font-bold text-sm md:text-base rounded-lg shadow-md hover:shadow-lg hover:shadow-gold/40 hover:scale-105 transition-all duration-300"
                        >
                          立即报名
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
