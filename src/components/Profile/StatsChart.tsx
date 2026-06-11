interface BrowseData {
  date: string;
  count: number;
}

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

interface StatsChartProps {
  browseData?: BrowseData[];
  categoryData?: CategoryData[];
}

const defaultBrowseData: BrowseData[] = [
  { date: '周一', count: 12 },
  { date: '周二', count: 8 },
  { date: '周三', count: 15 },
  { date: '周四', count: 20 },
  { date: '周五', count: 18 },
  { date: '周六', count: 25 },
  { date: '周日', count: 22 },
];

const defaultCategoryData: CategoryData[] = [
  { category: '青铜', value: 35, color: '#c9a227' },
  { category: '陶瓷', value: 28, color: '#2d5a5b' },
  { category: '书画', value: 20, color: '#8b6914' },
  { category: '玉器', value: 12, color: '#a8c5b5' },
  { category: '其他', value: 5, color: '#d4c5a0' },
];

export default function StatsChart({
  browseData = defaultBrowseData,
  categoryData = defaultCategoryData,
}: StatsChartProps) {
  const width = 320;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxCount = Math.max(...browseData.map((d) => d.count));
  const xStep = chartWidth / (browseData.length - 1);

  const points = browseData.map((d, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (d.count / maxCount) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const pieSize = 160;
  const pieCenter = pieSize / 2;
  const pieRadius = 60;
  const total = categoryData.reduce((sum, d) => sum + d.value, 0);

  let startAngle = -Math.PI / 2;
  const pieSlices = categoryData.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const x1 = pieCenter + pieRadius * Math.cos(startAngle);
    const y1 = pieCenter + pieRadius * Math.sin(startAngle);
    const x2 = pieCenter + pieRadius * Math.cos(endAngle);
    const y2 = pieCenter + pieRadius * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${pieCenter} ${pieCenter} L ${x1} ${y1} A ${pieRadius} ${pieRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    startAngle = endAngle;
    return { path, ...d };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-5">
        <h4 className="font-serif font-bold text-ink mb-4 text-sm">近7天浏览次数</h4>
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + chartHeight * (1 - ratio)}
              x2={width - padding.right}
              y2={padding.top + chartHeight * (1 - ratio)}
              stroke="#e5e5e5"
              strokeDasharray="3 3"
            />
          ))}
          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={linePath} fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#c9a227" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="2" fill="#c9a227" />
              <text x={p.x} y={height - 8} textAnchor="middle" className="text-[10px]" fill="#666">
                {p.date}
              </text>
              <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-medium" fill="#c9a227">
                {p.count}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <h4 className="font-serif font-bold text-ink mb-4 text-sm">藏品类别分布</h4>
        <div className="flex items-center gap-4">
          <svg width={pieSize} height={pieSize} viewBox={`0 0 ${pieSize} ${pieSize}`}>
            <circle cx={pieCenter} cy={pieCenter} r={pieRadius + 4} fill="none" stroke="#f5f0e6" strokeWidth="1" />
            {pieSlices.map((slice, i) => (
              <path key={i} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
            ))}
            <circle cx={pieCenter} cy={pieCenter} r="30" fill="#fff" />
            <text x={pieCenter} y={pieCenter - 4} textAnchor="middle" className="text-xs font-bold" fill="#1a1a2e">
              {total}
            </text>
            <text x={pieCenter} y={pieCenter + 12} textAnchor="middle" className="text-[10px]" fill="#666">
              总藏品
            </text>
          </svg>
          <div className="flex-1 space-y-2">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-ink">{item.category}</span>
                </div>
                <span className="text-gray-500 font-medium">{item.value}件</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
