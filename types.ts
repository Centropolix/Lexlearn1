
export enum LearningLevel {
  DUMMIES = 'DUMMIES', // Level 1: Conceptual Understanding
  SMARTIES = 'SMARTIES', // Level 2: Legal Reasoning
  WISE = 'WISE' // Level 3: Strategic Mastery
}

export enum CourseUnit {
  INTRO = 'Introduction to Communication Law',
  RIGHTS = 'Fundamental Rights and Communication',
  ADVERTISING = 'Advertising Legal Regime',
  COPYRIGHT = 'Copyright and Digital Economy',
  REGULATION = 'Regulation of Radio, TV, Cinema and Internet'
}

export interface UserState {
  levelProgress: Record<CourseUnit, LearningLevel>;
  xp: number;
  badge: 'Student' | 'Analyst' | 'Strategist';
  weakAreas: string[];
}

export interface LessonContent {
  title: string;
  analogy?: string;
  scenario?: string;
  question?: string;
  type: 'concept' | 'scenario' | 'recall' | 'reflection';
}

export interface AIResponse {
  feedback: string;
  score: number;
  logicCheck?: string[];
  suggestions?: string[];
  nextStep?: string;
}
