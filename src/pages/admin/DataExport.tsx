import { useState } from "react";
import { Download, FileSpreadsheet, FileText, BarChart3 } from "lucide-react";
import { defaultUsers } from "@/data/users";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { useActivityStore } from "@/stores/useActivityStore";
import { useLearningStore } from "@/stores/useLearningStore";

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToCSV(headers: string[], rows: string[][], filename: string) {
  const bom = '\uFEFF';
  const header = headers.join(',');
  const csvRows = rows.map((r) => r.map((cell) => `"${cell}"`).join(','));
  const csv = bom + header + '\n' + csvRows.join('\n');
  downloadFile(csv, filename, 'text/csv;charset=utf-8');
}

function exportToJSON(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json;charset=utf-8');
}

interface ExportRecord {
  id: string;
  name: string;
  type: string;
  time: string;
  user: string;
  filename: string;
  exportFn: () => void;
}

const exportOptions = [
  {
    title: "用户数据",
    description: "导出所有注册用户信息，包括基本资料、积分、等级等",
    icon: FileSpreadsheet,
    format: "JSON (.json)",
    key: "users" as const,
  },
  {
    title: "藏品数据",
    description: "导出所有藏品信息，包括名称、朝代、类别、浏览量等",
    icon: FileText,
    format: "CSV (.csv)",
    key: "collections" as const,
  },
  {
    title: "活动数据",
    description: "导出所有活动信息及报名数据统计",
    icon: BarChart3,
    format: "CSV (.csv)",
    key: "activities" as const,
  },
  {
    title: "学习数据",
    description: "导出用户学习任务完成情况及测验成绩",
    icon: FileSpreadsheet,
    format: "JSON (.json)",
    key: "learning" as const,
  },
];

export default function DataExport() {
  const items = useCollectionStore((s) => s.items);
  const activities = useActivityStore((s) => s.activities);
  const taskProgress = useLearningStore((s) => s.taskProgress);
  const tasks = useLearningStore((s) => s.tasks);

  const [exportRecords, setExportRecords] = useState<ExportRecord[]>([]);

  const now = () => {
    const d = new Date();
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-');
  };

  const fileTimestamp = () => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  };

  const doExport = (key: string) => {
    let filename = '';
    let type = '';
    let recordExportFn: () => void;

    switch (key) {
      case 'users': {
        filename = `用户数据_${fileTimestamp()}.json`;
        type = '用户数据';
        const data = defaultUsers.map(({ password: _p, ...rest }) => rest);
        const fn = () => exportToJSON(data, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'collections': {
        filename = `藏品数据_${fileTimestamp()}.csv`;
        type = '藏品数据';
        const headers = ['ID', '名称', '类别', '朝代', '描述', '浏览量'];
        const rows = items.map((item) => [
          item.id,
          item.title,
          item.category,
          item.dynasty,
          item.description,
          String(item.viewCount),
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'activities': {
        filename = `活动数据_${fileTimestamp()}.csv`;
        type = '活动数据';
        const headers = ['ID', '标题', '日期', '时间', '地点', '描述', '名额', '已报名', '状态'];
        const rows = activities.map((a) => [
          a.id,
          a.title,
          a.date,
          a.time,
          a.location,
          a.description,
          String(a.capacity),
          String(a.registeredCount),
          a.status,
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'learning': {
        filename = `学习数据_${fileTimestamp()}.json`;
        type = '学习数据';
        const data = tasks.map((task) => ({
          taskId: task.id,
          title: task.title,
          progress: taskProgress[task.id] ?? { status: 'not_started', score: 0 },
        }));
        const fn = () => exportToJSON(data, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      default:
        return;
    }

    setExportRecords((prev) => [
      {
        id: `rec_${Date.now()}`,
        name: filename,
        type,
        time: now(),
        user: '管理员',
        filename,
        exportFn: recordExportFn,
      },
      ...prev,
    ]);
  };

  const handleRedownload = (record: ExportRecord) => {
    record.exportFn();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-ink mb-6">数据导出</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.key} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon size={24} className="text-gold" />
                </div>
                <span className="text-sm text-gray-500">{option.format}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-ink mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
              <button
                onClick={() => doExport(option.key)}
                className="w-full py-2.5 flex items-center justify-center space-x-2 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium text-sm"
              >
                <Download size={16} />
                <span>导出数据</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-serif font-bold text-ink mb-4">最近导出记录</h2>
        {exportRecords.length === 0 ? (
          <div className="py-10 text-center text-gray-400">暂无导出记录</div>
        ) : (
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
                {exportRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.user}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRedownload(record)}
                        className="inline-flex items-center space-x-1 text-sm text-gold hover:text-teal transition-colors"
                      >
                        <Download size={14} />
                        <span>下载</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
