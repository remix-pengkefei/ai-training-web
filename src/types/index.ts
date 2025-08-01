export type Event = {
  id: string;
  title: string;
  startTime: string;   // ISO 字符串
  endTime?: string;    // ISO 字符串
  location: string;
  signupDeadline: string; // ISO 字符串
  highlights: string[];
  prizes: { rank: 'gold' | 'silver' | 'bronze'; text: string }[];
  registeredCount: number;
  maxParticipants?: number;
  bannerUrl?: string;
  description?: string;
  replayUrl?: string;
  agenda?: { time: string; title: string; description: string }[];
  targetAudience?: string[];
  requirements?: string[];
  speakers?: { name: string; title: string; avatar: string }[];
  organizer?: {
    name: string;
    description: string;
    contact: string;
  };
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  benefits?: string[];
  surveyQuestions?: SurveyQuestion[];
};

export type SurveyQuestion = {
  id: number;
  question: string;
  options: string[];
  stats?: number[];
};

export type Registration = {
  eventId: string;
  name: string;
  department: string;
};