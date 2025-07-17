import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StructuredFlowRequest {
  step: 'initialize' | 'continue' | 'finalize';
  storyId?: string;
  answers?: {
    length?: 'short' | 'medium' | 'long';
    setting?: string;
    characters?: string;
    themes?: string[];
    parentalPreferences?: any;
  };
  userResponse?: string;
}

const storyQuestions = [
  {
    id: 'length',
    question: 'How long would you like the story to be?',
    options: ['Short (perfect for a quick bedtime)', 'Medium (just right for snuggling)', 'Long (for extended storytelling)']
  },
  {
    id: 'setting',
    question: 'Where should the adventure take place?',
    options: ['Magical forest', 'Under the sea', 'In outer space', 'A cozy village', 'Custom setting']
  },
  {
    id: 'characters',
    question: 'Tell me about the main character. What are they like?',
    type: 'text'
  },
  {
    id: 'themes',
    question: 'What should this story teach or celebrate?',
    options: ['Friendship', 'Bravery', 'Kindness', 'Problem-solving', 'Family love']
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const requestData: StructuredFlowRequest = await req.json();

    switch (requestData.step) {
      case 'initialize':
        // Start the structured flow
        return new Response(JSON.stringify({
          question: storyQuestions[0],
          progress: 1,
          total: storyQuestions.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'continue':
        // Process current answer and provide next question
        const currentProgress = requestData.answers ? Object.keys(requestData.answers).length : 0;
        
        if (currentProgress < storyQuestions.length) {
          return new Response(JSON.stringify({
            question: storyQuestions[currentProgress],
            progress: currentProgress + 1,
            total: storyQuestions.length,
            answers: requestData.answers
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        } else {
          // All questions answered, start story generation
          const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
          if (!openAIApiKey) {
            throw new Error('OpenAI API key not configured');
          }

          // Build structured story prompt
          const answers = requestData.answers!;
          let storyPrompt = `Create a ${answers.length} children's bedtime story`;
          
          if (answers.setting && answers.setting !== 'Custom setting') {
            storyPrompt += ` set in ${answers.setting.toLowerCase()}`;
          }
          
          if (answers.characters) {
            storyPrompt += ` featuring ${answers.characters}`;
          }
          
          if (answers.themes && answers.themes.length > 0) {
            storyPrompt += ` that teaches about ${answers.themes.join(' and ')}`;
          }

          const systemPrompt = `You are creating a structured children's bedtime story. This will be generated in parts - start with the opening and stop at an exciting moment to ask the user what should happen next. Keep each part around 150-200 words.`;

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
              max_tokens: 400,
            }),
          });

          const aiResponse = await response.json();
          const partialContent = aiResponse.choices[0].message.content;

          // Create story record
          const { data: story, error } = await supabaseClient
            .from('stories')
            .insert({
              user_id: user.id,
              title: `Interactive Story: ${answers.characters || 'Adventure'}`,
              content: partialContent,
              prompt: storyPrompt,
              story_type: 'structured',
              length: answers.length || 'medium',
              setting: answers.setting,
              characters: answers.characters ? [{ name: answers.characters }] : [],
              themes: answers.themes || [],
              parental_preferences: answers.parentalPreferences || {},
              is_complete: false,
              generation_status: 'generating'
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({
            storyId: story.id,
            content: partialContent,
            isComplete: false,
            nextPrompt: 'What should happen next in the story?'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }

      case 'finalize':
        // Continue or finalize the story
        if (!requestData.storyId || !requestData.userResponse) {
          throw new Error('Story ID and user response required');
        }

        const { data: existingStory } = await supabaseClient
          .from('stories')
          .select('*')
          .eq('id', requestData.storyId)
          .eq('user_id', user.id)
          .single();

        if (!existingStory) {
          throw new Error('Story not found');
        }

        const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
        if (!openAIApiKey) {
          throw new Error('OpenAI API key not configured');
        }

        const continuePrompt = `Continue this children's story based on the user's input. Current story: "${existingStory.content}" User wants: "${requestData.userResponse}". Continue the story for another 150-200 words and either conclude it naturally or stop at another decision point.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are continuing a children\'s bedtime story based on user input.' },
              { role: 'user', content: continuePrompt }
            ],
            temperature: 0.8,
            max_tokens: 400,
          }),
        });

        const aiResponse = await response.json();
        const newContent = aiResponse.choices[0].message.content;
        const fullContent = existingStory.content + '\n\n' + newContent;

        // Determine if story should be complete
        const isComplete = newContent.toLowerCase().includes('the end') || 
                          newContent.toLowerCase().includes('and they lived') ||
                          fullContent.length > 1500; // Auto-complete long stories

        // Update story
        const { data: updatedStory, error: updateError } = await supabaseClient
          .from('stories')
          .update({
            content: fullContent,
            is_complete: isComplete,
            generation_status: isComplete ? 'complete' : 'generating'
          })
          .eq('id', requestData.storyId)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify({
          content: fullContent,
          isComplete,
          nextPrompt: isComplete ? null : 'What happens next?'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      default:
        throw new Error('Invalid step');
    }

  } catch (error) {
    console.error('Error in structured-story-flow function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});