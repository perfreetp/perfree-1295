import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gold font-serif text-xl font-bold mb-4">数字文化馆</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              传承中华文明，弘扬传统文化。打造数字化文化体验平台，让文化触手可及。
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">联系方式</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gold" />
                <span>北京市朝阳区文化路88号</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="flex-shrink-0 text-gold" />
                <span>010-8888-8888</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="flex-shrink-0 text-gold" />
                <span>contact@digitalculture.gov.cn</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/exhibition" className="hover:text-gold transition-colors">云展厅</a></li>
              <li><a href="/calendar" className="hover:text-gold transition-colors">活动日历</a></li>
              <li><a href="/learning" className="hover:text-gold transition-colors">学习任务</a></li>
              <li><a href="/profile" className="hover:text-gold transition-colors">个人中心</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">关注我们</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold hover:text-ink transition-all duration-200">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold hover:text-ink transition-all duration-200">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold hover:text-ink transition-all duration-200">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold hover:text-ink transition-all duration-200">
                <Youtube size={18} />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              开放时间：周一至周日 9:00 - 18:00
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
          <p>© 2026 数字文化馆 版权所有 | 京ICP备12345678号-1</p>
        </div>
      </div>
    </footer>
  );
}
