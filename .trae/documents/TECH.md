## 1. 架构设计

```mermaid
graph TD
    A["浏览器客户端"] --> B["React 前端应用"]
    B --> C["路由层 (React Router)"]
    B --> D["状态管理 (Zustand)"]
    B --> E["UI 组件层"]
    B --> F["Mock 数据服务"]
    E --> G["页面组件 (7个页面)"]
    E --> H["通用组件 (导航、卡片、播放器等)"]
    D --> I["用户状态 Store"]
    D --> J["藏品状态 Store"]
    D --> K["活动状态 Store"]
    F --> L["LocalStorage 持久化"]
```

## 2. 技术描述
- **前端框架**：React 18 + TypeScript + Vite
- **UI 样式**：Tailwind CSS 3
- **状态管理**：Zustand
- **路由方案**：React Router DOM 6
- **图标库**：Lucide React
- **数据方案**：Mock 数据 + LocalStorage 持久化，无需后端服务
- **初始化工具**：vite-init，使用 react-ts 模板

## 3. 路由定义
| 路由路径 | 页面名称 | 用途说明 |
|----------|----------|----------|
| / | 首页 | 展示轮播、精选展览、快速导航、热门藏品、活动预告 |
| /exhibition | 云展厅 | 藏品搜索、分类筛选、年代轴浏览、藏品列表展示 |
| /exhibition/:id | 藏品详情 | 高清图、音视频讲解、虚拟漫游、收藏、评论提问 |
| /calendar | 活动日历 | 月历视图、活动列表、活动报名、预约提醒设置 |
| /learning | 学习任务 | 知识测验、学习进度展示、证书获取 |
| /profile | 个人中心 | 个人信息、我的收藏、报名记录、证书展示、浏览统计 |
| /admin | 管理后台 | 仪表盘、内容发布、留言审核、数据导出 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    USER ||--o{ COLLECTION : "收藏"
    USER ||--o{ REGISTRATION : "报名"
    USER ||--o{ COMMENT : "发表"
    USER ||--o{ CERTIFICATE : "获得"
    EXHIBITION ||--o{ COLLECTION_ITEM : "包含"
    COLLECTION_ITEM ||--o{ COMMENT : "拥有"
    ACTIVITY ||--o{ REGISTRATION : "被报名"
    LEARNING_TASK ||--o{ QUIZ : "包含"
    LEARNING_TASK ||--o{ CERTIFICATE : "颁发"

    USER {
        string id "用户ID"
        string name "昵称"
        string avatar "头像"
        string email "邮箱"
        string role "角色: user/admin"
        number points "积分"
        string level "学习等级"
    }

    EXHIBITION {
        string id "展览ID"
        string title "展览名称"
        string coverImage "封面图"
        string description "展览描述"
        string startDate "开始日期"
        string endDate "结束日期"
    }

    COLLECTION_ITEM {
        string id "藏品ID"
        string title "藏品名称"
        string category "类别"
        string dynasty "朝代/年代"
        string description "详细描述"
        string[] images "高清图片列表"
        string audioUrl "音频讲解URL"
        string videoUrl "视频讲解URL"
        number viewCount "浏览次数"
    }

    ACTIVITY {
        string id "活动ID"
        string title "活动名称"
        string date "活动日期"
        string time "活动时间"
        string location "活动地点"
        string description "活动描述"
        number capacity "名额"
        number registeredCount "已报名人数"
        string status "状态"
    }

    COMMENT {
        string id "评论ID"
        string userId "用户ID"
        string userName "用户名"
        string userAvatar "用户头像"
        string itemId "藏品ID"
        string content "评论内容"
        string type "类型: comment/question"
        string status "审核状态"
        string createdAt "创建时间"
    }

    REGISTRATION {
        string id "报名ID"
        string userId "用户ID"
        string activityId "活动ID"
        boolean remind "是否提醒"
        string createdAt "报名时间"
    }

    LEARNING_TASK {
        string id "任务ID"
        string title "任务标题"
        string description "任务描述"
        string coverImage "封面图"
        number totalQuizzes "题目总数"
    }

    QUIZ {
        string id "题目ID"
        string taskId "任务ID"
        string question "问题"
        string[] options "选项"
        number correctIndex "正确答案索引"
        string explanation "答案解析"
    }

    CERTIFICATE {
        string id "证书ID"
        string userId "用户ID"
        string taskId "任务ID"
        string taskTitle "任务名称"
        string issuedDate "颁发日期"
        string certificateNo "证书编号"
    }
```

### 4.2 Store 设计

**UserStore**
- user: 当前登录用户信息
- isLoggedIn: 登录状态
- favorites: 收藏的藏品 ID 列表
- registrations: 报名记录
- certificates: 获得的证书
- browseHistory: 浏览历史

**CollectionStore**
- items: 藏品列表
- exhibitions: 展览列表
- searchKeyword: 搜索关键词
- selectedCategory: 选中的分类
- selectedDynasty: 选中的年代
- currentItem: 当前查看的藏品
- comments: 藏品评论列表

**ActivityStore**
- activities: 活动列表
- selectedDate: 当前选中的日期
- currentActivity: 当前查看的活动

**LearningStore**
- tasks: 学习任务列表
- currentTask: 当前学习任务
- currentQuizIndex: 当前题目索引
- userAnswers: 用户答案
- taskProgress: 各任务完成进度

## 5. 项目目录结构

```
src/
├── components/           # 通用组件
│   ├── Layout/           # 布局组件 (Header, Footer, Sidebar)
│   ├── Collection/       # 藏品相关组件
│   ├── Activity/         # 活动相关组件
│   ├── Learning/         # 学习相关组件
│   ├── Admin/            # 管理后台组件
│   └── UI/               # 基础UI组件 (Button, Card, Modal等)
├── pages/                # 页面组件
│   ├── Home.tsx
│   ├── Exhibition.tsx
│   ├── CollectionDetail.tsx
│   ├── ActivityCalendar.tsx
│   ├── Learning.tsx
│   ├── Profile.tsx
│   └── Admin.tsx
├── stores/               # Zustand 状态管理
│   ├── useUserStore.ts
│   ├── useCollectionStore.ts
│   ├── useActivityStore.ts
│   └── useLearningStore.ts
├── data/                 # Mock 数据
│   ├── collections.ts
│   ├── activities.ts
│   ├── learning.ts
│   └── users.ts
├── types/                # TypeScript 类型定义
│   └── index.ts
├── utils/                # 工具函数
│   ├── date.ts
│   ├── storage.ts
│   └── certificate.ts
├── router/               # 路由配置
│   └── index.tsx
├── App.tsx
├── main.tsx
└── index.css
```
