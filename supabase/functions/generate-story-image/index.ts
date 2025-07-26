import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageRequest {
  storyId: string;
  prompt?: string;
  generateMultiple?: boolean;
  storyContent?: string;
  storyLength?: 'short' | 'medium' | 'long';
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

    const requestData: ImageRequest = await req.json();
    
    // Verify the story belongs to the user
    const { data: story, error: storyError } = await supabaseClient
      .from('stories')
      .select('id, title, content, length')
      .eq('id', requestData.storyId)
      .eq('user_id', user.id)
      .single();

    if (storyError || !story) {
      throw new Error('Story not found or access denied');
    }

    // Determine number of images based on story length or request
    let numImages = 1;
    if (requestData.generateMultiple) {
      const storyLength = requestData.storyLength || story.length;
      switch (storyLength) {
        case 'short':
          numImages = 2;
          break;
        case 'medium':
          numImages = 3;
          break;
        case 'long':
          numImages = 4;
          break;
        default:
          numImages = 1;
      }
    }

    // Split story content into sections for multiple images
    const storyContent = requestData.storyContent || story.content;
    const sections = storyContent.split('\n\n').filter(p => p.trim());
    const sectionStep = Math.max(1, Math.floor(sections.length / numImages));

    // Generate images using OpenAI with retry logic
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const savedImages = [];
    const generatedUrls = [];

    // Generate images for each section
    for (let i = 0; i < numImages; i++) {
      let imageUrl = '';
      let retryCount = 0;
      const maxRetries = 3;

      // Create prompt based on section or provided prompt
      let prompt = '';
      if (requestData.prompt) {
        prompt = requestData.prompt;
      } else {
        const sectionIndex = i * sectionStep;
        const section = sections[sectionIndex] || sections[0];
        prompt = `Scene from this children's story: ${section.substring(0, 200)}`;
      }

      while (retryCount < maxRetries) {
        try {
          const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: `Children's storybook illustration: ${prompt}. Style: colorful, friendly, age-appropriate, digital art, vibrant colors, square composition, balanced layout`,
              size: '1024x1024',
              quality: 'hd',
              n: 1
            }),
          });

          if (response.ok) {
            const imageData = await response.json();
            imageUrl = imageData.data[0].url;
            generatedUrls.push(imageUrl);
            break;
          } else {
            const errorData = await response.json();
            
            // Handle rate limiting with exponential backoff
            if (response.status === 429) {
              retryCount++;
              if (retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000;
                console.log(`Rate limited, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
              }
            }
            
            throw new Error(`Image generation failed: ${errorData.error?.message || 'Unknown error'}`);
          }
        } catch (error) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw error;
          }
          
          const delay = 1000 * retryCount;
          console.log(`Error occurred, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // Save each image to database
      if (imageUrl) {
        const { data: savedImage, error: saveError } = await supabaseClient
          .from('story_images')
          .insert({
            story_id: requestData.storyId,
            image_url: imageUrl,
            prompt: prompt,
            section_index: i
          })
          .select()
          .single();

        if (saveError) {
          console.error('Failed to save image to database:', saveError);
        } else {
          savedImages.push(savedImage);
        }
      }

      // Add delay between requests to avoid rate limiting
      if (i < numImages - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return new Response(JSON.stringify({
      success: true,
      imageUrls: generatedUrls,
      storyId: requestData.storyId,
      imageIds: savedImages.map(img => img?.id).filter(Boolean),
      imagesGenerated: savedImages.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-story-image function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});