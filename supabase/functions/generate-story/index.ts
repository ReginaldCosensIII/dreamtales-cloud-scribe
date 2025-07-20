import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StoryRequest {
  prompt: string;
  storyType: 'structured' | 'freeform';
  length: 'short' | 'medium' | 'long';
  setting?: string;
  characters?: any[];
  themes?: string[];
  parentalPreferences?: any;
  existingStoryId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Check user's subscription tier and story limit
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('subscription_tier, stories_this_month')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Check story limits based on tier
    if (profile.subscription_tier === 'free' && profile.stories_this_month >= 30) {
      return new Response(JSON.stringify({ 
        error: 'Story limit reached. Upgrade to Premium for unlimited stories!' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const requestData: StoryRequest = await req.json();

    // Generate story using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build prompt based on story type and parameters
    let systemPrompt = "You are a creative children's story writer. Create engaging, age-appropriate bedtime stories.";
    
    let storyPrompt = requestData.prompt;
    if (requestData.setting) {
      storyPrompt += ` The story takes place in ${requestData.setting}.`;
    }
    if (requestData.characters && requestData.characters.length > 0) {
      storyPrompt += ` Characters include: ${requestData.characters.map(c => c.name).join(', ')}.`;
    }
    if (requestData.themes && requestData.themes.length > 0) {
      storyPrompt += ` Themes: ${requestData.themes.join(', ')}.`;
    }

    // Adjust length
    const lengthGuide = {
      short: 'Keep the story brief, around 100-200 words.',
      medium: 'Write a medium-length story, around 300-500 words.',
      long: 'Create a longer story, around 600-1000 words.'
    };
    systemPrompt += ` ${lengthGuide[requestData.length]}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: storyPrompt }
        ],
        temperature: 0.8,
        max_tokens: requestData.length === 'long' ? 1500 : requestData.length === 'medium' ? 800 : 400,
      }),
    });

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Save or update story in database
    let storyData;
    if (requestData.existingStoryId) {
      // Update existing story
      const { data, error } = await supabaseClient
        .from('stories')
        .update({
          content: generatedContent,
          updated_at: new Date().toISOString(),
          generation_status: 'complete'
        })
        .eq('id', requestData.existingStoryId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      storyData = data;
    } else {
      // Create new story
      const { data, error } = await supabaseClient
        .from('stories')
        .insert({
          user_id: user.id,
          title: `Story: ${requestData.prompt.slice(0, 50)}...`,
          content: generatedContent,
          prompt: requestData.prompt,
          story_type: requestData.storyType,
          length: requestData.length,
          setting: requestData.setting,
          characters: requestData.characters || [],
          themes: requestData.themes || [],
          parental_preferences: requestData.parentalPreferences || {},
          is_complete: true,
          generation_status: 'complete'
        })
        .select()
        .single();

      if (error) throw error;
      storyData = data;

      // Update user's story count
      await supabaseClient
        .from('profiles')
        .update({
          stories_this_month: profile.stories_this_month + 1
        })
        .eq('user_id', user.id);
    }

    return new Response(JSON.stringify({
      story: storyData,
      content: generatedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});