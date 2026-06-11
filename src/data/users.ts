export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  registerDate: string;
}

const avatar = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`;

export const defaultUsers: User[] = [
  {
    id: 'u001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    nickname: '博物馆管理员',
    avatar: avatar('博物馆管理员头像，中国风，戴眼镜，温文尔雅，专业形象，卡通风格'),
    email: 'admin@museum.com',
    phone: '13800138000',
    registerDate: '2024-01-01',
  },
  {
    id: 'u002',
    username: 'user',
    password: 'user123',
    role: 'user',
    nickname: '文物爱好者',
    avatar: avatar('年轻文物爱好者头像，中国风，微笑，文艺青年，卡通风格'),
    email: 'user@museum.com',
    phone: '13900139000',
    registerDate: '2025-03-15',
  },
  {
    id: 'u003',
    username: 'zhangsan',
    password: '123456',
    role: 'user',
    nickname: '张三',
    avatar: avatar('普通用户头像，中国风，中年男性，温和，卡通风格'),
    email: 'zhangsan@example.com',
    phone: '13700137000',
    registerDate: '2025-06-20',
  },
];
