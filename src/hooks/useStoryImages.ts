import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface StoryImage {
  id: string;
  story_id: string;
  image_url?: string;
  image_data?: string;
  section_index: number;
  prompt: string;
  created_at: string;
  updated_at: string;
}

export const useStoryImages = () => {
  const [images, setImages] = useState<StoryImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStoryImages = async (storyId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('story_images')
        .select('*')
        .eq('story_id', storyId)
        .order('section_index', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const generateImage = async (storyId: string, prompt: string) => {
    if (!user) {
      setError('Please sign in to generate images');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-story-image', {
        body: {
          storyId,
          prompt
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate image');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Image generation failed');
      }

      // Refresh the images for this story
      await fetchStoryImages(storyId);
      
      toast({
        title: "Image Generated",
        description: "Your story image has been created successfully!",
      });

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate image';
      setError(errorMessage);
      
      toast({
        title: "Image Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('story_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
      
      toast({
        title: "Image Deleted",
        description: "Image has been removed successfully.",
      });
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    images,
    isGenerating,
    error,
    fetchStoryImages,
    generateImage,
    deleteImage
  };
};