import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CharacterRequest {
  action: 'create' | 'update' | 'delete' | 'list';
  character?: {
    id?: string;
    name: string;
    description?: string;
    traits?: string[];
    age?: string;
    appearance?: string;
  };
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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const requestData: CharacterRequest = await req.json();

    switch (requestData.action) {
      case 'list':
        const { data: characters, error: listError } = await supabaseClient
          .from('characters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (listError) throw listError;

        return new Response(JSON.stringify({ characters }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'create':
        if (!requestData.character) {
          throw new Error('Character data required');
        }

        const { data: newCharacter, error: createError } = await supabaseClient
          .from('characters')
          .insert({
            user_id: user.id,
            name: requestData.character.name,
            description: requestData.character.description,
            traits: requestData.character.traits || [],
            age: requestData.character.age,
            appearance: requestData.character.appearance
          })
          .select()
          .single();

        if (createError) throw createError;

        return new Response(JSON.stringify({ character: newCharacter }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'update':
        if (!requestData.character?.id) {
          throw new Error('Character ID required for update');
        }

        const { data: updatedCharacter, error: updateError } = await supabaseClient
          .from('characters')
          .update({
            name: requestData.character.name,
            description: requestData.character.description,
            traits: requestData.character.traits || [],
            age: requestData.character.age,
            appearance: requestData.character.appearance
          })
          .eq('id', requestData.character.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ character: updatedCharacter }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'delete':
        if (!requestData.character?.id) {
          throw new Error('Character ID required for deletion');
        }

        const { error: deleteError } = await supabaseClient
          .from('characters')
          .delete()
          .eq('id', requestData.character.id)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in manage-characters function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});