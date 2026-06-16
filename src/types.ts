export type BirdType = 'budgie' | 'lovebird' | 'cockatiel' | 'ringneck' | 'africangrey' | 'macaw' | 'other';

export interface FlockInfo {
  birdTypes: BirdType[];
  count: number;
  ageGroup: string; // 'baby' | 'young' | 'adult' | 'senior'
  experienceLevel: 'beginner' | 'experienced';
  focusArea: string[]; // e.g. 'nutrition', 'lifespan', 'training', 'happiness'
}

export type MascotMood = 'happy' | 'concerned' | 'proud' | 'excited' | 'sleepy' | 'celebrating';

export interface DailyTask {
  id: string;
  label: string;
  done: boolean;
  xpReward: number;
  category: 'hydration' | 'nutrition' | 'social' | 'exercise' | 'custom';
  icon: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  triviaMessage: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'nutrition' | 'health' | 'behavior' | 'training' | 'emergency';
  locked: boolean;
  description: string;
  xpReward: number;
  completed: boolean;
  questions: QuizQuestion[];
}

export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  rating: number;
  whyRecommended: string;
  healthBenefits: string[];
  vetNotes: string;
  reviews: { user: string; text: string; rating: number }[];
  priceRange: '$$' | '$$$' | '$$$$';
  tags: string[];
  imageColor: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  imagePlaceholderType: 'lovebird' | 'budgie' | 'cockatiel' | 'seeds' | 'vet';
  birdMention: string;
  likes: number;
  likedByUser: boolean;
  commentsCount: number;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'first-flight' | 'nutrition-expert' | 'healthy-flock' | 'bird-whisperer' | 'avian-master';
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface HealthObservationsState {
  droppings: 'normal' | 'abnormal';
  energy: 'active' | 'lethargic';
  appetite: 'good' | 'poor';
  vocal: 'normal' | 'silent';
  lastUpdated: string; // YYYY-MM-DD
}

export interface UserState {
  onboardingCompleted: boolean;
  flock: FlockInfo;
  xp: number;
  level: number;
  seeds: number;
  streak: number;
  badges: Badge[];
  tasks: DailyTask[];
  completedLessons: string[];
  lastCheckedDate: string; // YYYY-MM-DD to detect streak status
  healthObservations?: HealthObservationsState;
  activeMascot?: string;
}

export interface MascotPreset {
  id: string;
  name: string;
  src: string;
  desc: string;
}

export const MASCOT_PRESETS: MascotPreset[] = [
  { id: 'budgie_wave', name: 'Yellow Budgie', src: '/images/budgie_wave_1781590939270.jpg', desc: 'Winking and waving happily' },
  { id: 'blue_budgie', name: 'Ringneck', src: '/images/budgie_blue_1781590998062.jpg', desc: 'Eating a sunflower seed' },
  { id: 'green_parrotlet', name: 'Parrot', src: '/images/parrotlet_wink_1781591014609.jpg', desc: 'Eating a sunflower seed' },
  { id: 'lovebird_fly', name: 'Flying Lovebird', src: '/images/lovebird_fly_1781590984756.jpg', desc: 'Spreading wings with joy' },
  { id: 'java_sparrow', name: 'Java Sparrow', src: '/images/java_sparrow_1781590970610.jpg', desc: 'Munching delicious seeds' },
  { id: 'cockatiel', name: 'Cockatiel', src: '/images/cockatiel_blush_1781591030021.jpg', desc: 'Blushing with crest standing tall' },
];
