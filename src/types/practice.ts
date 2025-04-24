export interface Option {
  id: string;
  text: string;
  correct?: boolean;
}

export interface MultipleChoiceQuestionData {
  type: string;
  question: string;
  prompt: string;
  options: Option[];
  explanation: string;
}

export interface SpeakingPracticeData {
  type: string;
  question: string;
  prompt: string;
  instruction: string;
  correctResponse: string;
  feedback: string[];
}

export type PracticeQuestion = MultipleChoiceQuestionData | SpeakingPracticeData;

export interface PracticeResult {
  score: number;
  total: number;
}
