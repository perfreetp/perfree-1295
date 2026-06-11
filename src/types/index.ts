export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: "user" | "admin";
  points: number;
  level: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  category: string;
  dynasty: string;
  description: string;
  images: string[];
  audioUrl?: string;
  videoUrl?: string;
  viewCount: number;
}

export interface Exhibition {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  registeredCount: number;
  status: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  itemId: string;
  content: string;
  type: "comment" | "question";
  status: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  activityId: string;
  remind: boolean;
  createdAt: string;
}

export interface LearningTask {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  totalQuizzes: number;
}

export interface Quiz {
  id: string;
  taskId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Certificate {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  issuedDate: string;
  certificateNo: string;
}
