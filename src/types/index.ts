export type Genre = 
  | '现代写景抒情散文'
  | '叙事散文/小说'
  | '文言文'
  | '古诗词'
  | '说明文/新闻/活动'
  | '议论文/思辨文本';

export type StarRating = 5 | 4 | 3;

export type StudyStatus = 'unlearned' | 'practicing' | 'mastered';

export type BookId = '7s' | '7x' | '8s' | '8x' | '9s' | '9x';

export interface PinyinNote {
  word: string;
  pinyin: string;
  meaning?: string;
}

export interface Paragraph {
  id: number;
  content: string;
  isHighlightedSlice?: boolean;
  pinyinNotes?: PinyinNote[];
}

export interface GoldenSlice {
  sliceRange: string;
  sliceTitle: string;
  oneGain: string;
  timingGuide: string;
  examinerTip: string;
}

export interface SpeedPlanStep {
  step: string;
  name: string;
  duration: string;
  coreAction: string;
}

export interface SpeedPlan {
  courseType: string;
  objectives: {
    knowledge: string;
    process: string;
    emotional: string;
  };
  keyPoints: string;
  difficulties: string;
  steps: SpeedPlanStep[];
  homework: string;
}

export interface VerbatimScript {
  importStage: {
    teacherLines: string;
    actionNotes: string;
  };
  preliminaryReadStage: {
    teacherLines: string;
    actionNotes: string;
  };
  deepDiveStage: {
    title: string;
    teacherQuestion: string;
    studentAnswer: string;
    teacherFeedback: string;
    deepenQuestion: string;
    readingGuidance: string;
  };
  summaryAndHomeworkStage: {
    summaryLines: string;
    homeworkLines: string;
  };
}

export interface BlackboardDesign {
  mainBoard: string;
  subBoard: string[];
  description: string;
}

export interface Lesson {
  id: string;
  book: BookId;
  bookName: string;
  pdfFileName: string;
  unit: number;
  unitTitle: string;
  unitTheme: string;
  unitReadingFocus: string;
  title: string;
  author: string;
  genre: Genre;
  star: StarRating;
  pdfPage: number;
  pdfPageCount: number;
  examRequirement: string[];
  goldenSlice: GoldenSlice;
  speedPlan: SpeedPlan;
  verbatimScript: VerbatimScript;
  blackboard: BlackboardDesign;
  fullText: {
    paragraphs: Paragraph[];
  };
}

export interface UserNote {
  id: string;
  lessonId: string;
  paragraphId?: number;
  content: string;
  updatedAt: string;
}

export interface DailyPracticeItem {
  id: string;
  lessonId: string;
  title: string;
  author: string;
  genre: Genre;
  bookName: string;
  completed: boolean;
  date: string;
}

export interface ExamSimulationTicket {
  ticketNumber: string;
  candidateName: string;
  lesson: Lesson;
  drawTime: string;
  prepDurationSeconds: number;
  trialDurationSeconds: number;
}
