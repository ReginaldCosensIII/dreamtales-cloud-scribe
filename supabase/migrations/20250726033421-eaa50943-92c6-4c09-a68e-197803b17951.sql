-- Create story_images table for storing generated images
CREATE TABLE public.story_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  image_url TEXT,
  image_data TEXT, -- Base64 encoded image data as fallback
  section_index INTEGER DEFAULT 0,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.story_images ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view images for their own stories" 
ON public.story_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE stories.id = story_images.story_id 
    AND stories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create images for their own stories" 
ON public.story_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE stories.id = story_images.story_id 
    AND stories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update images for their own stories" 
ON public.story_images 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE stories.id = story_images.story_id 
    AND stories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete images for their own stories" 
ON public.story_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.stories 
    WHERE stories.id = story_images.story_id 
    AND stories.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_story_images_updated_at
BEFORE UPDATE ON public.story_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();