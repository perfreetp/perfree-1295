import { useState } from "react";
import { Download, FileSpreadsheet, FileText, BarChart3, Calendar } from "lucide-react";
import { defaultUsers } from "@/data/users";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { useUserStore } from "@/stores/useUserStore";

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

type DateRange = '7d' | '30d' | '90d' | 'all' | 'custom';

const dateRangeLabels: { key: DateRange; label: string }[] = [
  { key: '7d', label: '近7天' },
  { key: '30d', label: '近30天' },
  { key: '90d', label: '近90天' },
  { key: 'all', label: '全部' },
  { key: 'custom', label: '自定义' },
];

function getDateFilter(range: DateRange, customStart: string, customEnd: string): ((dateStr: string) => boolean) {
  if (range === 'all') return () => true;
  const now = new Date();
  let start: Date;
  let end: Date = now;
  if (range === 'custom') {
    start = customStart ? new Date(customStart) : new Date('2020-01-01');
    end = customEnd ? new Date(customEnd) : now;
  } else {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }
  return (dateStr: string) => {
    const d = new Date(dateStr);
    return d >= start && d <= end;
  };
}

const exportOptions = [
  {
    title: "浏览数据",
    description: "导出藏品浏览量统计，包含名称、类别、朝代、浏览量等",
    icon: BarChart3,
    format: "CSV (.csv)",
    key: "browsing" as const,
  },
  {
    title: "报名数据",
    description: "导出活动报名记录，包含活动名称、报名日期、提醒状态等",
    icon: FileSpreadsheet,
    format: "CSV (.csv)",
    key: "registrations" as const,
  },
  {
    title: "证书数据",
    description: "导出学习证书记录，包含任务名称、成绩、颁发日期等",
    icon: FileText,
    format: "CSV (.csv)",
    key: "certificates" as const,
  },
  {
    title: "留言审核数据",
    description: "导出留言审核记录，包含用户、内容、审核状态、关联藏品等",
    icon: FileSpreadsheet,
    format: "CSV (.csv)",
    key: "reviews" as const,
  },
  {
    title: "藏品数据",
    description: "导出所有藏品信息，包括名称、朝代、类别、浏览量等",
    icon: FileText,
    format: "CSV (.csv)",
    key: "collections" as const,
  },
  {
    title: "用户数据",
    description: "导出所有注册用户信息，包括基本资料、积分、等级等",
    icon: FileSpreadsheet,
    format: "JSON (.json)",
    key: "users" as const,
  },
];

export default function DataExport() {
  const items = useCollectionStore((s) => s.items);
  const comments = useCollectionStore((s) => s.comments);
  const registrations = useUserStore((s) => s.registrations);
  const certificates = useUserStore((s) => s.certificates);

  const [exportRecords, setExportRecords] = useState<ExportRecord[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

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
    const dateFilter = getDateFilter(dateRange, customStart, customEnd);

    switch (key) {
      case 'browsing': {
        filename = `浏览数据_${fileTimestamp()}.csv`;
        type = '浏览数据';
        const filteredItems = items.filter(() => dateFilter(new Date().toISOString().split('T')[0]));
        const headers = ['ID', '名称', '类别', '朝代', '浏览量', '图片数', '描述'];
        const rows = filteredItems.map((item) => [
          item.id,
          item.title,
          item.category,
          item.dynasty,
          String(item.viewCount),
          String(item.images.length),
          item.description.replace(/"/g, '""'),
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'registrations': {
        filename = `报名数据_${fileTimestamp()}.csv`;
        type = '报名数据';
        const filteredRegs = registrations.filter((r) => dateFilter(r.registerDate));
        const headers = ['报名ID', '活动ID', '活动名称', '报名日期', '提醒状态'];
        const rows = filteredRegs.map((r) => [
          r.id,
          r.activityId,
          r.activityTitle,
          r.registerDate,
          r.reminded ? '已开启' : '未开启',
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'certificates': {
        filename = `证书数据_${fileTimestamp()}.csv`;
        type = '证书数据';
        const filteredCerts = certificates.filter((c) => dateFilter(c.issueDate));
        const headers = ['证书ID', '任务ID', '任务名称', '成绩', '颁发日期'];
        const rows = filteredCerts.map((c) => [
          c.id,
          c.taskId,
          c.taskTitle,
          String(c.score),
          c.issueDate,
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'reviews': {
        filename = `留言审核数据_${fileTimestamp()}.csv`;
        type = '留言审核数据';
        const filteredComments = comments.filter((c) => dateFilter(c.date));
        const getItemTitle = (collectionId: string) => {
          const item = items.find((i) => i.id === collectionId);
          return item?.title ?? '未知藏品';
        };
        const headers = ['留言ID', '用户', '类型', '内容', '审核状态', '关联藏品', '日期'];
        const rows = filteredComments.map((c) => [
          c.id,
          c.username,
          c.type === 'question' ? '提问' : '评论',
          c.content.replace(/"/g, '""'),
          c.reviewStatus === 'approved' ? '已通过' : c.reviewStatus === 'rejected' ? '已驳回' : '待审核',
          getItemTitle(c.collectionId),
          c.date,
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
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
          item.description.replace(/"/g, '""'),
          String(item.viewCount),
        ]);
        const fn = () => exportToCSV(headers, rows, filename);
        fn();
        recordExportFn = fn;
        break;
      }
      case 'users': {
        filename = `用户数据_${fileTimestamp()}.json`;
        type = '用户数据';
        const data = defaultUsers.map((u) => {
          const { password, ...rest } = u;
          void password;
          return rest;
        });
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

      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-gold" />
          <h3 className="font-serif text-lg font-bold text-ink">日期范围</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {dateRangeLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDateRange(key)}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                dateRange === key
                  ? 'border-gold bg-gold/10 text-gold font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
              />
              <span className="text-gray-400">至</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          选择日期范围后，导出的数据将按此范围过滤（浏览和藏品数据默认导出全部）
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
