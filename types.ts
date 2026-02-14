
export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  category: 'Technical' | 'Soft' | 'Domain';
}

export interface Profile {
  name: string;
  currentTitle: string;
  experience: string[];
  skills: Skill[];
  education: string[];
  age?: number;
}

export interface MultiSourceData {
  linkedinText?: string;
  githubInfo?: string;
  resumeText?: string;
}

export interface SkillGap {
  skill: string;
  importance: number; // 1-10
  gapDescription: string;
  marketDemand: string;
}

export interface Resource {
  title: string;
  url: string;
  description?: string;
}

export interface RoadmapTask {
  day: number;
  title: string;
  description: string;
  learningSources: Resource[];
  mockTests: Resource[];
  mockInterviews: Resource[];
  checkpoint: string;
}

export interface FutureOutlook {
  summary: string;
  technologicalShifts: string[];
  emergingSkills: string[];
  riskFactor: 'Low' | 'Medium' | 'High';
  longevityScore: number; // 1-100
}

export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface Under18Result {
  recommendedPaths: {
    title: string;
    description: string;
    why: string;
    skillsToStartNow: string[];
  }[];
  generalAdvice: string;
}

export interface CareerPlan {
  dreamRole: string;
  marketAnalysis: string;
  gaps: SkillGap[];
  roadmap: RoadmapTask[];
  futureOutlook: FutureOutlook;
  under18Result?: Under18Result;
}

export enum AppStep {
  NAME_INPUT = 'NAME_INPUT',
  AGE_INPUT = 'AGE_INPUT',
  QUIZ = 'QUIZ',
  PROFILE_INPUT = 'PROFILE_INPUT',
  DREAM_ROLE = 'DREAM_ROLE',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD'
}

export interface AgentLog {
  agent: string;
  message: string;
  timestamp: Date;
}
