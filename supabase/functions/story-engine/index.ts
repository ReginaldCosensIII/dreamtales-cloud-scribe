import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types aligned with frontend engine types
type EngineOperation = 'generate' | 'continue' | 'edit' | 'coach' | 'illustrate';
type StoryStatus = 'prompt' | 'generating' | 'draft' | 'editing' | 'final' | 'book-ready';
type StoryLength = 'short' | 'medium' | 'long';
type StoryTone = 'calm' | 'funny' | 'magical' | 'adventure' | 'educational';
type StoryType = 'guided' | 'freeform';

interface StoryPrompt {
  text: string;
  length: StoryLength;
  tone?: StoryTone;
  type: StoryType;
  selectedCharacters?: string[];
  selectedPlaces?: string[];
  generateImages?: boolean;
  additionalContext?: string;
}

interface StoryImage {
  id: string;
  url: string;
  prompt: string;
  sectionIndex: number;
}

interface StoryContent {
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

interface EngineRequest {
  operation: EngineOperation;
  storyId?: string;
  prompt?: StoryPrompt;
  content?: string;
  editInstructions?: string;
  coachRequest?: string;
}

interface EngineResponse {
  success: boolean;
  story?: StoryContent;
  suggestions?: string[];
  images?: string[];
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Environment validation
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Parse request
    const requestData: EngineRequest = await req.json();
    const { operation } = requestData;

    console.log(`Story engine operation: ${operation} for user: ${user.id}`);

    let result;

    switch (operation) {
      case 'generate':
        result = await handleGenerate(requestData, user.id, supabase, openAIApiKey);
        break;
      case 'continue':
        result = await handleContinue(requestData, user.id, supabase, openAIApiKey);
        break;
      case 'edit':
        result = await handleEdit(requestData, user.id, supabase, openAIApiKey);
        break;
      case 'coach':
        result = await handleCoach(requestData, openAIApiKey);
        break;
      case 'illustrate':
        result = await handleIllustrate(requestData, user.id, supabase, openAIApiKey);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Story engine error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleGenerate(request: EngineRequest, userId: string, supabase: any, openAIApiKey: string) {
  const { prompt } = request;
  if (!prompt) {
    throw new Error('Prompt is required for generation');
  }

  console.log('Generating story with prompt:', prompt.text);

  // Fetch character and place details if selected
  let characterDetails = [];
  let placeDetails = [];

  if (prompt.selectedCharacters?.length) {
    const { data: characters } = await supabase
      .from('characters')
      .select('*')
      .in('id', prompt.selectedCharacters)
      .eq('user_id', userId);
    
    characterDetails = characters || [];
  }

  if (prompt.selectedPlaces?.length) {
    const { data: places } = await supabase
      .from('places')
      .select('*')
      .in('id', prompt.selectedPlaces)
      .eq('user_id', userId);
    
    placeDetails = places || [];
  }

  // Build comprehensive prompt
  const systemPrompt = buildSystemPrompt(prompt.type, prompt.length, prompt.tone);
  const userPrompt = buildUserPrompt(prompt.text, characterDetails, placeDetails, prompt.additionalContext);

  // Generate story with OpenAI
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: getMaxTokensForLength(prompt.length),
    }),
  });

  if (!openAIResponse.ok) {
    throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
  }

  const openAIData = await openAIResponse.json();
  const generatedContent = openAIData.choices[0]?.message?.content;

  if (!generatedContent) {
    throw new Error('No content generated');
  }

  // Extract title and content
  const { title, content } = parseGeneratedStory(generatedContent);

  // Save story to database
  const storyId = crypto.randomUUID();
  const { error: insertError } = await supabase
    .from('stories')
    .insert({
      id: storyId,
      user_id: userId,
      title,
      content,
      prompt: prompt.text,
      story_type: prompt.type,
      length: prompt.length,
      generation_status: 'draft',
      is_complete: true,
      characters: characterDetails,
      setting: placeDetails.map(p => p.name).join(', '),
      themes: prompt.tone ? [prompt.tone] : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (insertError) {
    throw new Error(`Database error: ${insertError.message}`);
  }

  // Generate images if requested
  let images = [];
  if (prompt.generateImages) {
    try {
      images = await generateStoryImages(storyId, content, supabase, openAIApiKey);
    } catch (imageError) {
      console.warn('Image generation failed:', imageError);
      // Don't fail the whole operation for image errors
    }
  }

  // Build proper StoryContent response
  const story: StoryContent = {
    id: storyId,
    title,
    content,
    status: 'draft' as StoryStatus,
    prompt,
    metadata: {
      wordCount: content.split(' ').length,
      estimatedReadTime: Math.ceil(content.split(' ').length / 200),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    },
    images: images.map((url: string, index: number) => ({
      id: crypto.randomUUID(),
      url,
      prompt: `Illustration for ${title}`,
      sectionIndex: index
    }))
  };

  return {
    success: true,
    story
  };
}

async function handleContinue(request: EngineRequest, userId: string, supabase: any, openAIApiKey: string) {
  const { storyId, content } = request;
  if (!storyId || !content) {
    throw new Error('Story ID and continuation prompt required');
  }

  // Fetch existing story
  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', storyId)
    .eq('user_id', userId)
    .single();

  if (error || !story) {
    throw new Error('Story not found');
  }

  // Generate continuation
  const systemPrompt = "You are a skilled children's story writer. Continue the given story naturally and engagingly based on the user's direction.";
  const userPrompt = `Current story:\n${story.content}\n\nContinue the story with: ${content}`;

  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    }),
  });

  if (!openAIResponse.ok) {
    throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
  }

  const openAIData = await openAIResponse.json();
  const continuation = openAIData.choices[0]?.message?.content;

  if (!continuation) {
    throw new Error('No continuation generated');
  }

  const updatedContent = story.content + '\n\n' + continuation;

  // Update story
  const { error: updateError } = await supabase
    .from('stories')
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString()
    })
    .eq('id', storyId);

  if (updateError) {
    throw new Error(`Database error: ${updateError.message}`);
  }

  // Build proper StoryContent response
  const updatedStory: StoryContent = {
    id: story.id,
    title: story.title,
    content: updatedContent,
    status: 'draft' as StoryStatus,
    prompt: {
      text: story.prompt,
      length: story.length as StoryLength,
      tone: story.themes?.[0] as StoryTone,
      type: story.story_type as StoryType,
      generateImages: false,
    },
    metadata: {
      wordCount: updatedContent.split(' ').length,
      estimatedReadTime: Math.ceil(updatedContent.split(' ').length / 200),
      createdAt: story.created_at,
      updatedAt: new Date().toISOString(),
      version: (story.version || 1) + 1
    }
  };

  return {
    success: true,
    story: updatedStory
  };
}

async function handleEdit(request: EngineRequest, userId: string, supabase: any, openAIApiKey: string) {
  const { storyId, editInstructions } = request;
  if (!storyId || !editInstructions) {
    throw new Error('Story ID and edit instructions required');
  }

  // Fetch existing story
  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', storyId)
    .eq('user_id', userId)
    .single();

  if (error || !story) {
    throw new Error('Story not found');
  }

  // Generate edited version
  const systemPrompt = "You are a skilled children's story writer. Edit the given story according to the user's instructions while maintaining the story's essence and flow.";
  const userPrompt = `Current story:\n${story.content}\n\nEdit instructions: ${editInstructions}\n\nProvide the complete edited story.`;

  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!openAIResponse.ok) {
    throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
  }

  const openAIData = await openAIResponse.json();
  const editedContent = openAIData.choices[0]?.message?.content;

  if (!editedContent) {
    throw new Error('No edited content generated');
  }

  // Update story
  const { error: updateError } = await supabase
    .from('stories')
    .update({
      content: editedContent,
      generation_status: 'editing',
      updated_at: new Date().toISOString()
    })
    .eq('id', storyId);

  if (updateError) {
    throw new Error(`Database error: ${updateError.message}`);
  }

  // Build proper StoryContent response
  const updatedStory: StoryContent = {
    id: story.id,
    title: story.title,
    content: editedContent,
    status: 'editing' as StoryStatus,
    prompt: {
      text: story.prompt,
      length: story.length as StoryLength,
      tone: story.themes?.[0] as StoryTone,
      type: story.story_type as StoryType,
      generateImages: false,
    },
    metadata: {
      wordCount: editedContent.split(' ').length,
      estimatedReadTime: Math.ceil(editedContent.split(' ').length / 200),
      createdAt: story.created_at,
      updatedAt: new Date().toISOString(),
      version: (story.version || 1) + 1
    }
  };

  return {
    success: true,
    story: updatedStory
  };
}

async function handleCoach(request: EngineRequest, openAIApiKey: string) {
  const { content, coachRequest } = request;
  if (!content || !coachRequest) {
    throw new Error('Content and coach request required');
  }

  // Generate coaching suggestions
  const systemPrompt = "You are a helpful writing coach for children's stories. Provide constructive, encouraging feedback and suggestions.";
  const userPrompt = `Story content:\n${content}\n\nUser request: ${coachRequest}`;

  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!openAIResponse.ok) {
    throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
  }

  const openAIData = await openAIResponse.json();
  const suggestions = openAIData.choices[0]?.message?.content?.split('\n').filter(s => s.trim()) || [];

  return {
    success: true,
    suggestions
  };
}

async function handleIllustrate(request: EngineRequest, userId: string, supabase: any, openAIApiKey: string) {
  const { storyId, content } = request;
  if (!storyId) {
    throw new Error('Story ID required for illustration');
  }

  const images = await generateStoryImages(storyId, content || '', supabase, openAIApiKey);

  return {
    success: true,
    images
  };
}

// Helper functions
function buildSystemPrompt(type: string, length: string, tone?: string) {
  let basePrompt = "You are a skilled children's story writer. Create engaging, age-appropriate stories.";
  
  if (type === 'guided') {
    basePrompt += " Focus on clear moral lessons and educational value.";
  }
  
  if (tone) {
    basePrompt += ` The story should have a ${tone} tone.`;
  }

  return basePrompt + " Always start with a clear title on the first line, followed by the story content.";
}

function buildUserPrompt(text: string, characters: any[], places: any[], additionalContext?: string) {
  let prompt = `Create a story based on: ${text}`;
  
  if (characters.length > 0) {
    prompt += `\n\nInclude these characters:\n${characters.map(c => 
      `- ${c.name}: ${c.description || ''} ${c.traits?.join(', ') || ''}`
    ).join('\n')}`;
  }
  
  if (places.length > 0) {
    prompt += `\n\nSet in these locations:\n${places.map(p => 
      `- ${p.name} (${p.location_type}): ${p.description || ''}`
    ).join('\n')}`;
  }
  
  if (additionalContext) {
    prompt += `\n\nAdditional context: ${additionalContext}`;
  }
  
  return prompt;
}

function getMaxTokensForLength(length: string) {
  switch (length) {
    case 'short': return 800;
    case 'medium': return 1500;
    case 'long': return 2500;
    default: return 1500;
  }
}

function parseGeneratedStory(content: string) {
  const lines = content.split('\n');
  const title = lines[0].replace(/^#+\s*/, '').trim();
  const storyContent = lines.slice(1).join('\n').trim();
  
  return {
    title: title || 'Untitled Story',
    content: storyContent
  };
}

async function generateStoryImages(storyId: string, content: string, supabase: any, openAIApiKey: string) {
  // This is a simplified implementation
  // Full implementation would split content into scenes and generate multiple images
  const prompt = `Create a beautiful children's book illustration for this story scene: ${content.substring(0, 500)}`;
  
  try {
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'high'
      }),
    });

    if (!imageResponse.ok) {
      throw new Error(`Image generation failed: ${imageResponse.statusText}`);
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data[0]?.url;

    if (imageUrl) {
      // Save to database
      await supabase
        .from('story_images')
        .insert({
          story_id: storyId,
          image_url: imageUrl,
          prompt,
          section_index: 0
        });

      return [imageUrl];
    }
  } catch (error) {
    console.error('Image generation error:', error);
  }
  
  return [];
}