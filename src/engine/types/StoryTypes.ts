export type StoryStatus = 
  | 'prompt'      // Initial idea/prompt
  | 'generating'  // AI processing  
  | 'draft'       // First complete version
  | 'editing'     // User refinements
  | 'final'       // Ready for publication
  | 'book-ready'; // Formatted for print

export type StoryLength = 'short' | 'medium' | 'long';
export type StoryTone = 'calm' | 'funny' | 'magical' | 'adventure' | 'educational';
export type StoryType = 'guided' | 'freeform';

export interface StoryPrompt {
  text: string;
  length: StoryLength;
  tone?: StoryTone;
  type: StoryType;
  selectedCharacters?: string[];
  selectedPlaces?: string[];
  generateImages?: boolean;
  additionalContext?: string;
}

export interface StoryContent {
  id: string;
  title: string;
  content: string;
  status: StoryStatus;
  prompt: StoryPrompt;
  metadata: {
    wordCount: number;
    estimatedReadTime: number;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
  images?: StoryImage[];
}

export interface StoryImage {
  id: string;
  url: string;
  prompt: string;
  sectionIndex: number;
}

export interface StoryProgress {
  currentStep: string;
  totalSteps: number;
  estimatedTimeRemaining?: number;
  message: string;
}