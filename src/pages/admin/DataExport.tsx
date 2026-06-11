import { Download, FileSpreadsheet, FileText, BarChart3 } from "lucide-react";

const exportOptions = [
  {
    title: "用户数据",
    description: "导出所有注册用户信息，包括基本资料、积分、等级等",
    icon: FileSpreadsheet,
    format: "Excel (.xlsx)",
  },
  {
    title: "藏品数据",
    description: "导出所有藏品信息，包括名称、朝代、类别、浏览量等",
    icon: FileText,
    format: "Excel (.xlsx)",
  },
  {
    title: "活动数据",
    description: "导出所有活动信息及报名数据统计",
    icon: BarChart3,
    format: "Excel (.xlsx)",
  },
  {
    title: "学习数据",
    description: "导出用户学习任务完成情况及测验成绩",
    icon: FileSpreadsheet,
    format: "CSV (.csv)",
  },
];

export default function DataExport() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-ink mb-6">数据导出</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {exportOptions.map((option, idx) => {
          const Icon = option.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center`}>
                  <Icon size={24} className="text-gold" />
                </div>
                <span className="text-sm text-gray-500">{option.format}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-ink mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
              <button className="w-full py-2.5 flex items-center justify-center space-x-2 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium text-sm">
                <Download size={16} />
                <span>导出数据</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-serif font-bold text-ink mb-4">最近导出记录</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">导出时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作人</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: "用户数据_20260612.xlsx", type: "用户数据", time: "2026-06-12 10:30", user: "管理员" },
                { name: "藏品数据_20260610.xlsx", type: "藏品数据", time: "2026-06-10 15:20", user: "管理员" },
                { name: "活动数据_20260608.xlsx", type: "活动数据", time: "2026-06-08 09:15", user: "管理员" },
              ].map((record, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-ink">{record.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.user}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center space-x-1 text-sm text-gold hover:text-teal transition-colors">
                      <Download size={14} />
                      <span>下载</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
