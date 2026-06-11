import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, User, Menu, X, LogIn } from "lucide-react";

const navItems = [
  { to: "/", label: "首页" },
  { to: "/exhibition", label: "云展厅" },
  { to: "/calendar", label: "活动日历" },
  { to: "/learning", label: "学习任务" },
  { to: "/profile", label: "个人中心" },
  { to: "/admin", label: "管理后台" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-ink text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-gold font-serif text-xl md:text-2xl font-bold tracking-wide">
              数字文化馆
            </span>
          </NavLink>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-gold"
                      : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Search size={20} />
            </button>

            <button className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-ink rounded-md transition-all duration-200">
              <User size={18} />
              <span className="text-sm font-medium">登录</span>
            </button>

            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/10 animate-slide-down">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gold/20 text-gold border-l-2 border-gold"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button className="sm:hidden mt-2 flex items-center space-x-2 px-4 py-3 border border-gold text-gold hover:bg-gold hover:text-ink rounded-md transition-all w-full justify-center">
                <LogIn size={18} />
                <span className="text-sm font-medium">登录</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
