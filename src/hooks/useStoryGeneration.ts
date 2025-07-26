import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StoryGenerationParams {
  prompt: string;
  storyType: 'structured' | 'freeform';
  length: 'short' | 'medium' | 'long';
  setting?: string;
  characters?: any[];
  themes?: string[];
  parentalPreferences?: any;
  selectedCharacters?: string[];
  selectedPlaces?: string[];
  generateImages?: boolean;
}

export const useStoryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateStory = async (params: StoryGenerationParams) => {
    if (!user) {
      setError('Please sign in to generate stories');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-story', {
        body: params
      });

      if (functionError) {
        throw functionError;
      }

      // Auto-generate multiple images for the story if it was successfully created and requested
      if (data?.story?.id && params.generateImages) {
        try {
          // Generate multiple images based on story length
          supabase.functions.invoke('generate-story-image', {
            body: {
              storyId: data.story.id,
              generateMultiple: true,
              storyContent: data.story.content,
              storyLength: params.length
            }
          }).catch(err => {
            console.log('Auto-image generation failed:', err);
            // Don't throw error for image generation failure
          });
        } catch (imageError) {
          console.log('Failed to auto-generate images:', imageError);
          // Continue without images - don't fail the story generation
        }
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const startStructuredFlow = async () => {
    if (!user) {
      setError('Please sign in to create stories');
      return null;
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke('structured-story-flow', {
        body: { step: 'initialize' }
      });

      if (functionError) {
        throw functionError;
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to start story flow');
      return null;
    }
  };

  const continueStructuredFlow = async (answers: any) => {
    if (!user) {
      setError('Please sign in to continue');
      return null;
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke('structured-story-flow', {
        body: { step: 'continue', answers }
      });

      if (functionError) {
        throw functionError;
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to continue story flow');
      return null;
    }
  };

  const continueStory = async (storyId: string, userResponse: string) => {
    if (!user) {
      setError('Please sign in to continue story');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('structured-story-flow', {
        body: { 
          step: 'finalize', 
          storyId, 
          userResponse 
        }
      });

      if (functionError) {
        throw functionError;
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to continue story');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateStory,
    startStructuredFlow,
    continueStructuredFlow,
    continueStory,
    isGenerating,
    error
  };
};