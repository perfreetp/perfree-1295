export interface Exhibition {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  startDate: string;
  endDate: string;
}

const img = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`;

export const exhibitions: Exhibition[] = [
  {
    id: 'e001',
    title: '青铜时代：商周青铜器精华展',
    coverImage: img('商周青铜器展览海报，大鼎、尊、爵，古代青铜文明，博物馆展览封面'),
    description: '汇集全国各地博物馆珍藏的商周青铜器精品，包括后母戊鼎、四羊方尊、毛公鼎等国宝级文物，全面展示中国青铜时代的辉煌成就。',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
  },
  {
    id: 'e002',
    title: '瓷韵千年：中国古代瓷器特展',
    coverImage: img('中国古代瓷器展览，宋瓷汝窑青花瓷，精美陶瓷，博物馆展览海报'),
    description: '从原始青瓷到明清官窑，系统展示中国瓷器发展的完整脉络，涵盖汝、官、哥、钧、定五大名窑及景德镇青花瓷等珍品。',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
  },
  {
    id: 'e003',
    title: '翰墨丹青：中国书画名家作品展',
    coverImage: img('中国书画展览，古代名画，水墨山水，书法作品，博物馆展览封面'),
    description: '展出从唐宋到近现代的书画名家真迹，包括清明上河图、富春山居图等传世名画，以及王羲之、颜真卿等书法大家的作品。',
    startDate: '2026-04-10',
    endDate: '2026-07-20',
  },
  {
    id: 'e004',
    title: '丝路瑰宝：敦煌艺术大展',
    coverImage: img('敦煌艺术展览海报，飞天壁画，莫高窟，佛教艺术，丝绸之路'),
    description: '通过壁画复原、彩塑造像、出土文物等形式，全方位呈现敦煌莫高窟的艺术魅力，展示丝绸之路文化交流的灿烂成果。',
    startDate: '2026-05-01',
    endDate: '2026-10-15',
  },
  {
    id: 'e005',
    title: '玉润中华：中国古代玉器展',
    coverImage: img('中国古代玉器展览，翡翠白菜，金缕玉衣，玉雕精品，博物馆展览封面'),
    description: '从红山文化玉龙到清代宫廷玉雕，展现中国八千年玉文化的发展历程，体现玉文化在中华文明中的独特地位。',
    startDate: '2026-06-01',
    endDate: '2026-12-31',
  },
  {
    id: 'e006',
    title: '千古一帝：秦始皇陵文物特展',
    coverImage: img('秦始皇陵文物展览，兵马俑，铜车马，秦代文物，历史展览海报'),
    description: '展出秦始皇陵及兵马俑坑出土的珍贵文物，包括兵马俑、铜车马、青铜兵器等，再现秦帝国的恢弘气势。',
    startDate: '2026-07-20',
    endDate: '2026-11-30',
  },
];
