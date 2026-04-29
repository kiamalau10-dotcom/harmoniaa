export interface UserProgress {
  level: number;
  xp: number;
  score: number;
  badges: Badge[];
  unlockedEndings: string[];
  materiOpened: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateUnlocked?: string;
}

export type Category = 'Dasar' | 'Lanjut' | 'Tantangan' | 'Eksperimen' | 'Sosial';
export type ModuleType = 'video' | 'artikel' | 'slide' | 'quiz' | 'battle';

export interface Slide {
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Materi {
  id: string;
  title: string;
  category: Category;
  content: string;
  image?: string;
  type: ModuleType;
  duration?: string;
  slides?: Slide[];
  videoUrl?: string;
}

export interface AIQuestion {
  id: string;
  context: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserPresence {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'study' | 'battle';
  color: string;
}

export interface DiscussionRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activeNow: number;
  category: string;
}

export interface StoryNode {
  id: string;
  text: string;
  choices: Choice[];
}

export interface Choice {
  text: string;
  nextNodeId: string;
  endingType?: 'Good' | 'Bad' | 'Sad' | 'Plot Twist' | 'Secret';
}

export interface DiscussionPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
  category: string;
}

export interface DailyTip {
  title: string;
  content: string;
  icon: string;
}
