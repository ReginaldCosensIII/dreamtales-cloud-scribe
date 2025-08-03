import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  voice?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request data
    let requestData: TTSRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Invalid JSON in request body:', error);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format. Please check your data and try again.',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, voice = 'alloy' } = requestData;

    // Validate required fields
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Text content is required for speech generation.',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check text length (OpenAI TTS has limits)
    if (text.length > 4096) {
      return new Response(JSON.stringify({ 
        error: 'Text is too long. Maximum 4096 characters allowed.',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        error: 'Speech service is temporarily unavailable. Please try again later.',
        success: false 
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Speech generation failed';
      try {
        const error = await response.json();
        errorMessage = error.error?.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      console.error('OpenAI TTS API error:', response.status, errorMessage);
      return new Response(JSON.stringify({ 
        error: response.status === 429 
          ? 'Speech service is busy. Please try again in a moment.'
          : 'Failed to generate speech. Please try again.',
        success: false 
      }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert audio buffer to base64 in chunks to prevent stack overflow
    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      console.error('Received empty audio response');
      return new Response(JSON.stringify({ 
        error: 'Received empty audio response. Please try again.',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uint8Array = new Uint8Array(arrayBuffer);
    let base64Audio = '';
    const chunkSize = 8192;
    
    try {
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        base64Audio += btoa(String.fromCharCode.apply(null, Array.from(chunk)));
      }
    } catch (error) {
      console.error('Failed to convert audio to base64:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to process audio response. Please try again.',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      audioContent: base64Audio
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});