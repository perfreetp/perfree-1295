import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  MessageSquare,
  Download,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { to: "/admin", label: "仪表盘", icon: LayoutDashboard, end: true },
  { to: "/admin/content", label: "内容管理", icon: FileText },
  { to: "/admin/activities", label: "活动管理", icon: CalendarDays },
  { to: "/admin/messages", label: "留言审核", icon: MessageSquare },
  { to: "/admin/export", label: "数据导出", icon: Download },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`bg-ink text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {sidebarOpen && (
            <span className="text-gold font-serif text-lg font-bold">管理后台</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 transition-colors ${
                        isActive
                          ? "bg-gold/20 text-gold border-r-2 border-gold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 text-sm font-medium">{item.label}</span>
                        <ChevronRight size={16} className="ml-auto opacity-50" />
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          {sidebarOpen && (
            <div className="text-xs text-gray-500">
              数字文化馆管理系统 v1.0
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-lg font-semibold text-ink">管理后台</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">管理员</div>
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-ink font-medium">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
