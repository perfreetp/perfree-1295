export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended';

export interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  registeredCount: number;
  status: ActivityStatus;
}

export const activities: Activity[] = [
  {
    id: 'a001',
    title: '青铜器鉴赏专家讲座',
    date: '2026-06-15',
    time: '14:00-16:00',
    location: '博物馆学术报告厅',
    description: '邀请故宫博物院青铜器研究专家，深入解读商周青铜器的铸造工艺、纹饰内涵与历史价值，带你领略青铜文明的独特魅力。',
    capacity: 200,
    registeredCount: 156,
    status: 'upcoming',
  },
  {
    id: 'a002',
    title: '儿童陶艺体验工作坊',
    date: '2026-06-14',
    time: '09:30-11:30',
    location: '博物馆互动体验区',
    description: '专为6-12岁儿童设计的陶艺体验活动，在专业陶艺老师指导下，亲手制作属于自己的陶瓷作品，感受千年瓷韵。',
    capacity: 30,
    registeredCount: 28,
    status: 'upcoming',
  },
  {
    id: 'a003',
    title: '书画临摹体验活动',
    date: '2026-06-18',
    time: '10:00-12:00',
    location: '博物馆书画教室',
    description: '提供名家书画名作的临摹范本，在书画老师的指导下体验传统书画的笔墨情趣，感受中华书画艺术之美。',
    capacity: 40,
    registeredCount: 22,
    status: 'upcoming',
  },
  {
    id: 'a004',
    title: '博物馆之夜·夜游活动',
    date: '2026-06-20',
    time: '18:30-21:00',
    location: '博物馆全馆',
    description: '特别开放的夜游博物馆活动，在灯光与音乐中体验博物馆的别样风情，还有专业讲解与古装巡游。',
    capacity: 500,
    registeredCount: 423,
    status: 'upcoming',
  },
  {
    id: 'a005',
    title: '文化遗产日主题活动',
    date: '2026-06-13',
    time: '09:00-17:00',
    location: '博物馆广场及展厅',
    description: '中国文化遗产日特别活动，免费开放全馆，举办非遗展示、文物鉴定咨询、文化讲座等系列活动。',
    capacity: 2000,
    registeredCount: 1856,
    status: 'ongoing',
  },
  {
    id: 'a006',
    title: '古代服饰文化展演',
    date: '2026-06-13',
    time: '14:30-16:00',
    location: '博物馆中央大厅',
    description: '展示从先秦到明清各个朝代的传统服饰，通过专业模特的演绎，再现中华服饰文化的绚丽多彩。',
    capacity: 300,
    registeredCount: 298,
    status: 'ongoing',
  },
  {
    id: 'a007',
    title: '敦煌壁画临摹 workshop',
    date: '2026-06-10',
    time: '13:30-16:30',
    location: '博物馆特展厅活动区',
    description: '在敦煌研究院专业画师的指导下，临摹敦煌壁画经典纹样，学习古代矿物颜料的使用方法。',
    capacity: 25,
    registeredCount: 25,
    status: 'ended',
  },
  {
    id: 'a008',
    title: '古玉鉴定入门讲座',
    date: '2026-06-07',
    time: '10:00-12:00',
    location: '博物馆学术报告厅',
    description: '邀请玉器鉴定专家传授古玉鉴定的基本知识，包括玉料识别、工艺特征、断代方法等实用技能。',
    capacity: 150,
    registeredCount: 142,
    status: 'ended',
  },
  {
    id: 'a009',
    title: '小小讲解员培训营',
    date: '2026-06-22',
    time: '09:00-16:00',
    location: '博物馆各展厅',
    description: '面向8-14岁青少年的讲解员培训活动，通过专业培训让孩子们成为博物馆的小小文化传播者。',
    capacity: 50,
    registeredCount: 31,
    status: 'upcoming',
  },
  {
    id: 'a010',
    title: '茶文化体验活动',
    date: '2026-06-25',
    time: '14:00-17:00',
    location: '博物馆茶室',
    description: '品茗论道，体验中国传统茶文化，了解历代茶器与饮茶方式的演变，感受茶道之美。',
    capacity: 35,
    registeredCount: 18,
    status: 'upcoming',
  },
];
