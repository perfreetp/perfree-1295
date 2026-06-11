export type Category = '书画' | '陶瓷' | '玉器' | '青铜' | '其他';
export type Dynasty = '商' | '周' | '秦' | '汉' | '唐' | '宋' | '元' | '明' | '清' | '近代';

export interface Collection {
  id: string;
  title: string;
  category: Category;
  dynasty: Dynasty;
  description: string;
  images: string[];
  audioUrl: string;
  videoUrl: string;
  viewCount: number;
}

const img = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`;

export const collections: Collection[] = [
  {
    id: 'c001',
    title: '后母戊鼎',
    category: '青铜',
    dynasty: '商',
    description: '后母戊鼎，又称司母戊鼎，是中国商代晚期王室用于祭祀的青铜方鼎，是中国现存最大最重的青铜器，现藏于中国国家博物馆。',
    images: [
      img('商代青铜器后母戊鼎，大鼎，国家博物馆，青铜纹理，古代礼器，黑色背景，专业摄影'),
      img('商代青铜鼎细节，鼎身兽面纹，饕餮纹，古代青铜工艺，特写'),
      img('后母戊鼎整体展示，博物馆展厅，灯光照射下的青铜大鼎'),
    ],
    audioUrl: '/audio/houmuwuding.mp3',
    videoUrl: '/video/houmuwuding.mp4',
    viewCount: 125680,
  },
  {
    id: 'c002',
    title: '四羊方尊',
    category: '青铜',
    dynasty: '商',
    description: '四羊方尊是中国现存商代青铜方尊中最大的一件，其造型独特，四角各有一只卷角羊，是青铜铸造工艺的巅峰之作。',
    images: [
      img('商代四羊方尊，青铜器，四角羊头造型，古代礼器，精美纹饰'),
      img('四羊方尊羊头细节，商代青铜工艺，卷角羊，特写镜头'),
      img('四羊方尊整体展示，博物馆背景，专业文物摄影'),
    ],
    audioUrl: '/audio/siyangfangzun.mp3',
    videoUrl: '/video/siyangfangzun.mp4',
    viewCount: 98765,
  },
  {
    id: 'c003',
    title: '越王勾践剑',
    category: '青铜',
    dynasty: '周',
    description: '越王勾践剑是春秋晚期越国的青铜剑，剑身千年不锈，剑刃锋利无比，被誉为"天下第一剑"，现藏于湖北省博物馆。',
    images: [
      img('越王勾践剑，春秋青铜器，古剑，菱形暗格纹，千年不锈'),
      img('越王勾践剑剑身铭文，鸟虫书，金字，特写，古代文字'),
      img('越王勾践剑整体展示，剑鞘，博物馆灯光，文物摄影'),
    ],
    audioUrl: '/audio/yuewanggoujianjian.mp3',
    videoUrl: '/video/yuewanggoujianjian.mp4',
    viewCount: 156789,
  },
  {
    id: 'c004',
    title: '秦始皇陵铜车马',
    category: '青铜',
    dynasty: '秦',
    description: '秦始皇陵铜车马是秦始皇陵陪葬坑出土的大型彩绘铜车马，被誉为"青铜之冠"，现藏于秦始皇兵马俑博物馆。',
    images: [
      img('秦始皇陵铜车马，秦代青铜器，彩绘马车，古代车马，兵马俑博物馆'),
      img('铜车马御官俑细节，秦代青铜工艺，彩绘纹饰，特写'),
      img('铜车马整体展示，博物馆展厅，古代皇家车马'),
    ],
    audioUrl: '/audio/tongchema.mp3',
    videoUrl: '/video/tongchema.mp4',
    viewCount: 234567,
  },
  {
    id: 'c005',
    title: '金缕玉衣',
    category: '玉器',
    dynasty: '汉',
    description: '金缕玉衣是汉代皇帝和高级贵族的殓服，由数千片玉片用金线编织而成，是汉代玉器工艺的杰出代表。',
    images: [
      img('汉代金缕玉衣，古代玉器，玉片金线，殓服，博物馆文物'),
      img('金缕玉衣玉片细节，金丝编缀，汉代工艺，特写'),
      img('金缕玉衣整体展示，博物馆展厅灯光，汉代丧葬文化'),
    ],
    audioUrl: '/audio/jinlvyuyi.mp3',
    videoUrl: '/video/jinlvyuyi.mp4',
    viewCount: 178934,
  },
  {
    id: 'c006',
    title: '唐三彩骆驼载乐俑',
    category: '陶瓷',
    dynasty: '唐',
    description: '唐三彩骆驼载乐俑是唐代三彩陶器的代表作，骆驼背上载有乐工和舞者，生动展现了丝绸之路的文化交流景象。',
    images: [
      img('唐三彩骆驼载乐俑，唐代陶瓷，三彩釉，骆驼乐舞，丝绸之路'),
      img('唐三彩人物细节，胡人乐工，唐代陶俑，釉色，特写'),
      img('唐三彩骆驼载乐俑整体展示，博物馆背景，唐代陶俑精品'),
    ],
    audioUrl: '/audio/tangsancai.mp3',
    videoUrl: '/video/tangsancai.mp4',
    viewCount: 145678,
  },
  {
    id: 'c007',
    title: '汝窑天青釉洗',
    category: '陶瓷',
    dynasty: '宋',
    description: '汝窑天青釉洗是北宋汝窑瓷器，釉色如雨过天青，是宋代五大名窑之首汝窑的传世珍品，现藏于台北故宫博物院。',
    images: [
      img('汝窑天青釉洗，宋代瓷器，五大名窑，天青色釉，开片纹，故宫文物'),
      img('汝窑釉面细节，天青色开片，宋代青瓷，气泡，微距特写'),
      img('汝窑天青釉洗整体展示，博物馆展柜，宋瓷精品'),
    ],
    audioUrl: '/audio/ruyao.mp3',
    videoUrl: '/video/ruyao.mp4',
    viewCount: 312456,
  },
  {
    id: 'c008',
    title: '清明上河图',
    category: '书画',
    dynasty: '宋',
    description: '《清明上河图》是北宋画家张择端的代表作，描绘了北宋都城汴京的城市面貌和各阶层人民的生活状况，是中国十大传世名画之一。',
    images: [
      img('清明上河图，北宋张择端，中国古画，长卷，汴京城，市井生活，名画'),
      img('清明上河图虹桥片段，宋代建筑，人物众多，古代商贸，局部'),
      img('清明上河图城门段，宋代城市风貌，古代风俗画，细节展示'),
    ],
    audioUrl: '/audio/qingmingshanghetu.mp3',
    videoUrl: '/video/qingmingshanghetu.mp4',
    viewCount: 567890,
  },
  {
    id: 'c009',
    title: '青花萧何月下追韩信梅瓶',
    category: '陶瓷',
    dynasty: '元',
    description: '元代青花萧何月下追韩信梅瓶是元青花中的极品，绘有历史人物故事，是景德镇青花瓷的巅峰之作。',
    images: [
      img('元青花萧何月下追韩信梅瓶，元代瓷器，青花瓷，人物故事纹，梅瓶'),
      img('元青花人物细节，萧何韩信，苏麻离青，元代青花，特写'),
      img('元青花梅瓶整体展示，博物馆展陈，元代瓷器珍品'),
    ],
    audioUrl: '/audio/yuanqinghua.mp3',
    videoUrl: '/video/yuanqinghua.mp4',
    viewCount: 267890,
  },
  {
    id: 'c010',
    title: '斗彩鸡缸杯',
    category: '陶瓷',
    dynasty: '明',
    description: '明成化斗彩鸡缸杯是明代成化年间的官窑瓷器，杯身绘有子母鸡图，是明代彩瓷的巅峰之作，极为珍稀。',
    images: [
      img('明成化斗彩鸡缸杯，明代瓷器，斗彩，鸡纹，子母鸡，酒杯，官窑'),
      img('斗彩鸡缸杯细节，鸡群纹饰，姹紫嫣红，明代彩瓷，釉上彩'),
      img('斗彩鸡缸杯整体展示，博物馆展柜，明代瓷器精品'),
    ],
    audioUrl: '/audio/doucaijigangbei.mp3',
    videoUrl: '/video/doucaijigangbei.mp4',
    viewCount: 398765,
  },
  {
    id: 'c011',
    title: '翡翠白菜',
    category: '玉器',
    dynasty: '清',
    description: '翡翠白菜是清代宫廷玉雕珍品，由一块半白半绿的翡翠雕成，菜叶上还雕有螽斯和蝗虫，寓意多子多孙，现藏于台北故宫博物院。',
    images: [
      img('清代翡翠白菜，玉雕，翡翠，白菜造型，故宫文物，清代玉器'),
      img('翡翠白菜菜叶细节，螽斯蝗虫，玉雕工艺，绿色翡翠，微距特写'),
      img('翡翠白菜整体展示，博物馆展陈，清代玉雕精品'),
    ],
    audioUrl: '/audio/feicuibaicai.mp3',
    videoUrl: '/video/feicuibaicai.mp4',
    viewCount: 423156,
  },
  {
    id: 'c012',
    title: '富春山居图',
    category: '书画',
    dynasty: '元',
    description: '《富春山居图》是元代画家黄公望的代表作，描绘富春江两岸的秀美山水，是中国十大传世名画之一，现分藏于两岸。',
    images: [
      img('富春山居图，元代黄公望，中国山水画，长卷，富春江，水墨山水'),
      img('富春山居图山水细节，元代文人画，披麻皴，水墨渲染，局部'),
      img('富春山居图剩山图卷，山峦江水，古代山水画，细节展示'),
    ],
    audioUrl: '/audio/fuchunshanjutu.mp3',
    videoUrl: '/video/fuchunshanjutu.mp4',
    viewCount: 489234,
  },
  {
    id: 'c013',
    title: '毛公鼎',
    category: '青铜',
    dynasty: '周',
    description: '毛公鼎是西周晚期的青铜器，鼎内铭文长达499字，是现存青铜器中铭文最长的一件，现藏于台北故宫博物院。',
    images: [
      img('西周毛公鼎，青铜器，铭文，西周礼器，大篆文字，故宫文物'),
      img('毛公鼎铭文细节，西周金文，大篆，499字铭文，拓片效果'),
      img('毛公鼎整体展示，博物馆背景，西周青铜重器'),
    ],
    audioUrl: '/audio/maogongding.mp3',
    videoUrl: '/video/maogongding.mp4',
    viewCount: 187654,
  },
  {
    id: 'c014',
    title: '白玉雕桐荫仕女图',
    category: '玉器',
    dynasty: '清',
    description: '清代白玉雕桐荫仕女图是乾隆时期的玉雕珍品，利用玉料的天然纹理巧雕而成，展现了江南园林的仕女生活场景。',
    images: [
      img('清代白玉雕桐荫仕女图，玉雕，和田白玉，仕女，江南园林，巧雕'),
      img('玉雕仕女细节，人物神态，清代玉工，庭院场景，特写'),
      img('白玉雕桐荫仕女图整体展示，博物馆展陈，清代玉雕精品'),
    ],
    audioUrl: '/audio/tongyinshinvtu.mp3',
    videoUrl: '/video/tongyinshinvtu.mp4',
    viewCount: 134567,
  },
  {
    id: 'c015',
    title: '敦煌壁画复原',
    category: '其他',
    dynasty: '唐',
    description: '敦煌莫高窟唐代壁画的复原展示，敦煌壁画是中国古代绘画艺术的宝库，涵盖了从十六国到元代的历代作品。',
    images: [
      img('敦煌莫高窟唐代壁画复原，飞天，菩萨，敦煌艺术，石窟壁画，唐代佛教艺术'),
      img('敦煌飞天壁画细节，飘带飞舞，唐代彩绘，矿物颜料，特写'),
      img('敦煌壁画整体展示，莫高窟洞窟内景，佛教艺术精品'),
    ],
    audioUrl: '/audio/dunhuang.mp3',
    videoUrl: '/video/dunhuang.mp4',
    viewCount: 356789,
  },
  {
    id: 'c016',
    title: '徐悲鸿奔马图',
    category: '书画',
    dynasty: '近代',
    description: '徐悲鸿《奔马图》是近代著名画家徐悲鸿的代表作，以水墨写意的方式描绘奔腾的骏马，寄托了民族精神。',
    images: [
      img('徐悲鸿奔马图，近代国画，水墨写意，骏马，奔腾，大师作品'),
      img('奔马图笔墨细节，中国水墨画，徐悲鸿笔法，马蹄鬃毛，局部'),
      img('奔马图整体展示，立轴装裱，近代中国画精品'),
    ],
    audioUrl: '/audio/xubeihongbenma.mp3',
    videoUrl: '/video/xubeihongbenma.mp4',
    viewCount: 289012,
  },
];
