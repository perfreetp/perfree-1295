import {
  Users,
  Eye,
  Calendar,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "总用户数", value: "12,580", change: "+12.5%", icon: Users, color: "bg-gold/10 text-gold" },
    { label: "总浏览量", value: "892,340", change: "+8.2%", icon: Eye, color: "bg-teal/10 text-teal" },
    { label: "活动总数", value: "156", change: "+5.3%", icon: Calendar, color: "bg-blue-100 text-blue-700" },
    { label: "藏品总数", value: "2,340", change: "+2.1%", icon: FileText, color: "bg-ink/10 text-ink" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-ink mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpRight size={16} />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-ink mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-serif font-bold text-ink mb-4">最近活动</h2>
          <div className="space-y-4">
            {[
              { title: "青铜器鉴赏专家讲座", date: "2026-06-15", participants: 156 },
              { title: "儿童陶艺体验工作坊", date: "2026-06-14", participants: 28 },
              { title: "文化遗产日主题活动", date: "2026-06-13", participants: 1856 },
              { title: "古代服饰文化展演", date: "2026-06-13", participants: 298 },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <h3 className="font-medium text-ink">{activity.title}</h3>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <span className="text-sm font-medium text-gold">{activity.participants} 人</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-serif font-bold text-ink mb-4">热门藏品</h2>
          <div className="space-y-4">
            {[
              { title: "清明上河图", views: 567890 },
              { title: "翡翠白菜", views: 423156 },
              { title: "富春山居图", views: 489234 },
              { title: "斗彩鸡缸杯", views: 398765 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-sm flex items-center justify-center mr-3 font-medium">
                    {idx + 1}
                  </span>
                  <h3 className="font-medium text-ink">{item.title}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp size={14} className="mr-1 text-green-600" />
                  {item.views.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
