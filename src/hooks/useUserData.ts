import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  subscription_tier: 'free' | 'premium' | 'dreambook';
  stories_this_month: number;
  created_at: string;
  updated_at: string;
}

interface Story {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prompt: string;
  story_type: 'structured' | 'freeform';
  length: 'short' | 'medium' | 'long';
  setting?: string;
  characters: any[];
  themes: string[];
  parental_preferences: any;
  is_complete: boolean;
  generation_status: 'draft' | 'generating' | 'paused' | 'complete';
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  traits: string[];
  age?: string;
  appearance?: string;
  created_at: string;
  updated_at: string;
}

export const useUserData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('get-user-stories');

      if (functionError) {
        throw functionError;
      }

      setProfile(data.profile);
      setStories(data.stories || []);
      setCharacters(data.characters || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (characterData: Omit<Character, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      setError('Please sign in to create characters');
      return null;
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke('manage-characters', {
        body: {
          action: 'create',
          character: characterData
        }
      });

      if (functionError) {
        throw functionError;
      }

      // Refresh the characters list
      fetchUserData();
      return data.character;
    } catch (err: any) {
      setError(err.message || 'Failed to create character');
      return null;
    }
  };

  const updateCharacter = async (characterData: Partial<Character> & { id: string }) => {
    if (!user) {
      setError('Please sign in to update characters');
      return null;
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke('manage-characters', {
        body: {
          action: 'update',
          character: characterData
        }
      });

      if (functionError) {
        throw functionError;
      }

      // Refresh the characters list
      fetchUserData();
      return data.character;
    } catch (err: any) {
      setError(err.message || 'Failed to update character');
      return null;
    }
  };

  const deleteCharacter = async (characterId: string) => {
    if (!user) {
      setError('Please sign in to delete characters');
      return false;
    }

    try {
      const { error: functionError } = await supabase.functions.invoke('manage-characters', {
        body: {
          action: 'delete',
          character: { id: characterId }
        }
      });

      if (functionError) {
        throw functionError;
      }

      // Refresh the characters list
      fetchUserData();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete character');
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return {
    profile,
    stories,
    characters,
    loading,
    error,
    refetch: fetchUserData,
    createCharacter,
    updateCharacter,
    deleteCharacter
  };
};