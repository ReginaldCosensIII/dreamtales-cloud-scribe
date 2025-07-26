import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from './useUserData';

export interface Place {
  id: string;
  user_id: string;
  name: string;
  location_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useStoryCreation = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { stories, characters, refetch } = useUserData();

  // Fetch places
  const fetchPlaces = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaces(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create a new place
  const createPlace = async (placeData: {
    name: string;
    location_type: string;
    description?: string;
  }) => {
    if (!user) {
      setError('Please sign in to create places');
      return null;
    }

    setIsCreatingPlace(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('places')
        .insert([{
          ...placeData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setPlaces(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsCreatingPlace(false);
    }
  };

  // Update a place
  const updatePlace = async (placeId: string, placeData: Partial<Place>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('places')
        .update(placeData)
        .eq('id', placeId)
        .select()
        .single();

      if (error) throw error;

      setPlaces(prev => prev.map(place => 
        place.id === placeId ? data : place
      ));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Delete a place
  const deletePlace = async (placeId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', placeId);

      if (error) throw error;

      setPlaces(prev => prev.filter(place => place.id !== placeId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Generate story with selected characters and places
  const generateStoryWithElements = async (params: {
    selectedCharacters: string[];
    selectedPlaces: string[];
    prompt: string;
    length: 'short' | 'medium' | 'long';
    themes?: string[];
    generateImages?: boolean;
  }) => {
    if (!user) {
      setError('Please sign in to generate stories');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const selectedCharacterData = characters.filter(char => 
        params.selectedCharacters.includes(char.id)
      );
      const selectedPlaceData = places.filter(place => 
        params.selectedPlaces.includes(place.id)
      );

      const { data, error: functionError } = await supabase.functions.invoke('generate-story', {
        body: {
          prompt: params.prompt,
          storyType: 'freeform',
          length: params.length,
          characters: selectedCharacterData,
          setting: selectedPlaceData.map(place => place.name).join(', '),
          themes: params.themes || []
        }
      });

      if (functionError) {
        throw functionError;
      }

      // Auto-generate an image for the story if it was successfully created and requested
      if (data?.story?.id && params.generateImages) {
        try {
          // Extract a scene from the story content for image generation
          const storyContent = data.story.content || '';
          const firstParagraph = storyContent.split('\n\n')[0] || storyContent.substring(0, 200);
          
          // Generate image in the background (don't wait for it)
          supabase.functions.invoke('generate-story-image', {
            body: {
              storyId: data.story.id,
              prompt: `Main scene from this story: ${firstParagraph}`
            }
          }).catch(err => {
            console.log('Auto-image generation failed:', err);
            // Don't throw error for image generation failure
          });
        } catch (imageError) {
          console.log('Failed to auto-generate image:', imageError);
          // Continue without image - don't fail the story generation
        }
      }

      await refetch(); // Refresh stories list
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate image for story section
  const generateStoryImage = async (storyId: string, prompt: string) => {
    if (!user) {
      setError('Please sign in to generate images');
      return null;
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-story-image', {
        body: {
          storyId,
          prompt
        }
      });

      if (functionError) {
        throw functionError;
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
      return null;
    }
  };

  return {
    places,
    stories,
    characters,
    isGenerating,
    isCreatingPlace,
    error,
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    generateStoryWithElements,
    generateStoryImage,
    refetch
  };
};