import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EngineState, EngineActions, EngineRequest } from './types/EngineTypes';
import { StoryPrompt, StoryContent, StoryProgress } from './types/StoryTypes';
import { toast } from 'sonner';

export const useStoryEngine = (): EngineState & EngineActions => {
  const { user } = useAuth();
  const [currentStory, setCurrentStory] = useState<StoryContent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callEngine = useCallback(async (request: EngineRequest) => {
    if (!user) {
      throw new Error('Authentication required');
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('story-engine', {
        body: request
      });

      if (functionError) {
        throw new Error(functionError.message || 'Engine request failed');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unknown engine error');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Story engine error';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  const generateStory = useCallback(async (prompt: StoryPrompt): Promise<StoryContent | null> => {
    try {
      setProgress({
        currentStep: 'Initializing',
        totalSteps: 4,
        message: 'Preparing to generate your story...'
      });

      const response = await callEngine({
        operation: 'generate',
        prompt
      });

      if (response.story) {
        setCurrentStory(response.story);
        toast.success('Story generated successfully!');
        return response.story;
      }

      return null;
    } catch (error) {
      return null;
    } finally {
      setProgress(null);
    }
  }, [callEngine]);

  const continueStory = useCallback(async (storyId: string, prompt: string): Promise<StoryContent | null> => {
    try {
      setProgress({
        currentStep: 'Continuing',
        totalSteps: 2,
        message: 'Expanding your story...'
      });

      const response = await callEngine({
        operation: 'continue',
        storyId,
        content: prompt
      });

      if (response.story) {
        setCurrentStory(response.story);
        toast.success('Story continued successfully!');
        return response.story;
      }

      return null;
    } catch (error) {
      return null;
    } finally {
      setProgress(null);
    }
  }, [callEngine]);

  const editStory = useCallback(async (storyId: string, instructions: string): Promise<StoryContent | null> => {
    try {
      setProgress({
        currentStep: 'Editing',
        totalSteps: 2,
        message: 'Applying your edits...'
      });

      const response = await callEngine({
        operation: 'edit',
        storyId,
        editInstructions: instructions
      });

      if (response.story) {
        setCurrentStory(response.story);
        toast.success('Story edited successfully!');
        return response.story;
      }

      return null;
    } catch (error) {
      return null;
    } finally {
      setProgress(null);
    }
  }, [callEngine]);

  const getCoachSuggestions = useCallback(async (content: string, request: string): Promise<string[]> => {
    try {
      const response = await callEngine({
        operation: 'coach',
        content,
        coachRequest: request
      });

      return response.suggestions || [];
    } catch (error) {
      return [];
    }
  }, [callEngine]);

  const generateImages = useCallback(async (storyId: string, scenes?: string[]): Promise<string[]> => {
    try {
      setProgress({
        currentStep: 'Illustrating',
        totalSteps: scenes?.length || 1,
        message: 'Creating beautiful illustrations...'
      });

      const response = await callEngine({
        operation: 'illustrate',
        storyId,
        content: scenes?.join('\n')
      });

      if (response.images) {
        toast.success('Images generated successfully!');
        return response.images;
      }

      return [];
    } catch (error) {
      return [];
    } finally {
      setProgress(null);
    }
  }, [callEngine]);

  const saveStory = useCallback(async (story: StoryContent): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('stories')
        .upsert({
          id: story.id,
          user_id: user?.id,
          title: story.title,
          content: story.content,
          prompt: story.prompt.text,
          story_type: story.prompt.type,
          length: story.prompt.length,
          generation_status: story.status,
          is_complete: story.status === 'final' || story.status === 'book-ready',
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast.success('Story saved successfully!');
      return true;
    } catch (error: any) {
      toast.error('Failed to save story: ' + error.message);
      return false;
    }
  }, [user?.id]);

  const loadStory = useCallback((story: any) => {
    // Convert saved story format to StoryContent format
    const storyContent: StoryContent = {
      id: story.id,
      title: story.title,
      content: story.content,
      status: story.generation_status as any || 'draft',
      prompt: {
        text: story.prompt,
        type: story.story_type,
        length: story.length,
        tone: 'magical', // Default tone
        selectedCharacters: [],
        selectedPlaces: [],
        generateImages: false
      },
      metadata: {
        wordCount: story.content?.split(' ').length || 0,
        estimatedReadTime: Math.max(1, Math.ceil((story.content?.split(' ').length || 0) / 200)),
        version: 1,
        createdAt: story.created_at,
        updatedAt: story.updated_at
      }
    };
    setCurrentStory(storyContent);
    toast.success('Story loaded successfully!');
  }, []);

  const clearState = useCallback(() => {
    setCurrentStory(null);
    setError(null);
    setProgress(null);
  }, []);

  return {
    currentStory,
    isProcessing,
    progress,
    error,
    generateStory,
    continueStory,
    editStory,
    getCoachSuggestions,
    generateImages,
    saveStory,
    loadStory,
    clearState
  };
};