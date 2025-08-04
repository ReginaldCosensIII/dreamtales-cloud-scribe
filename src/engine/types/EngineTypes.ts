import { StoryPrompt, StoryContent, StoryProgress } from './StoryTypes';

export type EngineOperation = 
  | 'generate'    // Create new story
  | 'continue'    // Expand existing story
  | 'edit'        // Modify story content
  | 'coach'       // Get AI writing suggestions
  | 'illustrate'; // Generate images

export interface EngineRequest {
  operation: EngineOperation;
  storyId?: string;
  prompt?: StoryPrompt;
  content?: string;
  editInstructions?: string;
  coachRequest?: string;
}

export interface EngineResponse {
  success: boolean;
  story?: StoryContent;
  suggestions?: string[];
  images?: string[];
  progress?: StoryProgress;
  error?: string;
}

export interface EngineState {
  currentStory: StoryContent | null;
  isProcessing: boolean;
  progress: StoryProgress | null;
  error: string | null;
}

export interface EngineActions {
  generateStory: (prompt: StoryPrompt) => Promise<StoryContent | null>;
  continueStory: (storyId: string, prompt: string) => Promise<StoryContent | null>;
  editStory: (storyId: string, instructions: string) => Promise<StoryContent | null>;
  getCoachSuggestions: (content: string, request: string) => Promise<string[]>;
  generateImages: (storyId: string, scenes?: string[]) => Promise<string[]>;
  saveStory: (story: StoryContent) => Promise<boolean>;
  clearState: () => void;
}