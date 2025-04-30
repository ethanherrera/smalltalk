// Types definition for practice components
export interface MultipleChoiceQuestionData {
  type: "multipleChoice";
  question: string;
  prompt: string;
  options: {
    id: string;
    text: string;
    correct?: boolean;
  }[];
  explanation: string;
}

export interface SpeakingPracticeData {
  type: "speaking";
  question: string;
  prompt: string;
  instruction: string;
  correctResponse: string;
  feedback: string[];
}

export type PracticeQuestionData = MultipleChoiceQuestionData | SpeakingPracticeData;