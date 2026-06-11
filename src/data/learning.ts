export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningTask {
  id: string;
  title: string;
  description: string;
  quizzes: Quiz[];
}

export const learningTasks: LearningTask[] = [
  {
    id: 't001',
    title: '中国青铜器入门',
    description: '了解中国古代青铜器的发展历程、主要器型、铸造工艺和文化内涵。',
    quizzes: [
      {
        question: '后母戊鼎（司母戊鼎）是哪个朝代的青铜器？',
        options: ['夏朝', '商朝', '西周', '东周'],
        correctIndex: 1,
        explanation: '后母戊鼎是商代晚期王室用于祭祀的青铜方鼎，是中国现存最大最重的青铜器。',
      },
      {
        question: '下列青铜器中，以铭文长著称的是？',
        options: ['四羊方尊', '越王勾践剑', '毛公鼎', '莲鹤方壶'],
        correctIndex: 2,
        explanation: '毛公鼎内铭文长达499字，是现存青铜器中铭文最长的一件。',
      },
      {
        question: '青铜是铜与哪种金属的合金？',
        options: ['铁', '铝', '锡', '锌'],
        correctIndex: 2,
        explanation: '青铜是铜与锡的合金，具有熔点低、硬度大、易于铸造的特点，被广泛用于制作礼器、兵器等。',
      },
      {
        question: '越王勾践剑属于哪类青铜器？',
        options: ['礼器', '兵器', '乐器', '食器'],
        correctIndex: 1,
        explanation: '越王勾践剑是春秋晚期越国的青铜剑，属于兵器类，以千年不锈、锋利无比著称。',
      },
      {
        question: '四羊方尊上的四只羊位于尊的什么位置？',
        options: ['尊的底部', '尊的肩部四角', '尊的腹部中央', '尊的口沿'],
        correctIndex: 1,
        explanation: '四羊方尊的四角各有一只卷角羊伸出肩部，造型独特，是商代青铜铸造工艺的杰作。',
      },
    ],
  },
  {
    id: 't002',
    title: '中国陶瓷鉴赏基础',
    description: '学习中国古代陶瓷的发展脉络、名窑特点和鉴定基础。',
    quizzes: [
      {
        question: '宋代五大名窑之首的是？',
        options: ['官窑', '哥窑', '汝窑', '定窑'],
        correctIndex: 2,
        explanation: '汝窑位居宋代五大名窑之首，以天青色釉著称，烧制时间短，传世品稀少，极为珍贵。',
      },
      {
        question: '青花瓷在哪个朝代达到鼎盛？',
        options: ['唐代', '宋代', '元代', '明代'],
        correctIndex: 3,
        explanation: '青花瓷在明代永乐、宣德时期达到鼎盛，以"青花首推宣德"之说著称。',
      },
      {
        question: '三彩陶器主要盛行于哪个朝代？',
        options: ['汉代', '唐代', '宋代', '清代'],
        correctIndex: 1,
        explanation: '唐三彩是唐代盛行的低温铅釉陶器，以黄、绿、白等釉色为主，造型生动，色彩绚丽。',
      },
      {
        question: '斗彩鸡缸杯是哪个朝代的瓷器？',
        options: ['宋代', '元代', '明代', '清代'],
        correctIndex: 2,
        explanation: '斗彩鸡缸杯是明代成化年间的官窑瓷器，以斗彩工艺绘制子母鸡图，是明代彩瓷的巅峰之作。',
      },
      {
        question: '瓷器与陶器最主要的区别在于？',
        options: ['颜色不同', '胎质和烧成温度不同', '造型不同', '大小不同'],
        correctIndex: 1,
        explanation: '瓷器以瓷土为胎，烧成温度在1200℃以上，胎质致密坚硬，不吸水；陶器以黏土为胎，烧成温度较低，胎质疏松有吸水性。',
      },
    ],
  },
  {
    id: 't003',
    title: '中国书画艺术概览',
    description: '探索中国书画艺术的历史演变、名家流派和审美特点。',
    quizzes: [
      {
        question: '《清明上河图》的作者是？',
        options: ['张择端', '顾恺之', '吴道子', '范宽'],
        correctIndex: 0,
        explanation: '《清明上河图》是北宋画家张择端的代表作，描绘了北宋都城汴京的城市面貌和社会生活。',
      },
      {
        question: '《富春山居图》的作者黄公望是哪个朝代的画家？',
        options: ['宋代', '元代', '明代', '清代'],
        correctIndex: 1,
        explanation: '黄公望是元代著名画家，"元四家"之首，《富春山居图》是其晚年杰作。',
      },
      {
        question: '被誉为"画圣"的唐代画家是？',
        options: ['阎立本', '吴道子', '周昉', '张萱'],
        correctIndex: 1,
        explanation: '吴道子是唐代著名画家，擅长佛道、人物、山水等，被誉为"画圣"，其画风被称为"吴带当风"。',
      },
      {
        question: '中国传统绘画中的"文人画"强调什么？',
        options: ['写实逼真', '色彩艳丽', '意境和气韵', '人物众多'],
        correctIndex: 2,
        explanation: '文人画强调"以形写神"、"逸笔草草"，注重抒发作者的主观意趣和笔墨情趣，追求意境和气韵。',
      },
      {
        question: '《兰亭序》被誉为"天下第一行书"，它的作者是？',
        options: ['颜真卿', '柳公权', '欧阳询', '王羲之'],
        correctIndex: 3,
        explanation: '《兰亭序》是东晋书法家王羲之的代表作，被誉为"天下第一行书"，对后世书法影响深远。',
      },
    ],
  },
];
