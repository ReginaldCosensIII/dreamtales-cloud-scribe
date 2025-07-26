import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Play, Pause, Download, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StoryImage, useStoryImages } from '@/hooks/useStoryImages';

interface Story {
  id: string;
  title: string;
  content: string;
  setting?: string;
  themes: string[];
  images?: StoryImage[];
}

interface StoryReadingModeProps {
  story: Story;
  onClose: () => void;
}

export const StoryReadingMode = ({ story, onClose }: StoryReadingModeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [storyPages, setStoryPages] = useState<string[]>([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { images, fetchStoryImages } = useStoryImages();

  // Split story into pages and fetch images
  useEffect(() => {
    const paragraphs = story.content.split('\n\n').filter(p => p.trim());
    setStoryPages(paragraphs);
    
    // Fetch images for this story
    if (story.id) {
      fetchStoryImages(story.id);
    }
  }, [story.content, story.id, fetchStoryImages]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const generateAndPlayAudio = async (text: string) => {
    try {
      setIsGeneratingAudio(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      if (error) throw error;

      if (data.success && data.audioContent) {
        // Stop any currently playing audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.src = '';
        }

        // Create new audio element
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        
        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          toast.error('Failed to play audio');
          setIsPlaying(false);
        };

        setCurrentAudio(audio);
        await audio.play();
      } else {
        throw new Error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast.error('Failed to generate audio. Please try again.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const togglePlayback = () => {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
    } else {
      const currentText = storyPages[currentPage] || story.content;
      generateAndPlayAudio(currentText);
    }
  };

  const nextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      if (currentAudio) {
        currentAudio.pause();
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      if (currentAudio) {
        currentAudio.pause();
      }
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`${story.title}\n\n${story.content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.content,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
      toast.success('Story copied to clipboard!');
    }
  };

  const currentText = storyPages.length > 0 ? storyPages[currentPage] : story.content;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{story.title}</h1>
            {storyPages.length > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {storyPages.length}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            disabled={isGeneratingAudio}
          >
            {isGeneratingAudio ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Story Content */}
      <div className="flex-1 overflow-auto p-8">
        <Card className="w-full max-w-4xl mx-auto bg-card/70 backdrop-blur-md shadow-dreamy">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Story Image */}
              {images.length > 0 ? (
                <div className="w-full max-w-md mx-auto">
                  {(() => {
                    // Find image for current page/section
                    const pageImage = images.find(img => img.section_index === currentPage) || images[0];
                    const imageSource = pageImage.image_url || `data:image/png;base64,${pageImage.image_data}`;
                    
                    return (
                      <div className="relative">
                        <img 
                          src={imageSource}
                          alt={`Story illustration for page ${currentPage + 1}`}
                          className="w-full aspect-square object-cover rounded-lg shadow-lg"
                        />
                        {images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {pageImage.section_index + 1} of {images.length}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Story Illustration</p>
                </div>
              )}
              
              {/* Story Text */}
              <div className="text-center">
                <p className="text-lg leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto">
                  {currentText}
                </p>
              </div>
            </div>

            {/* Navigation */}
            {storyPages.length > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <Button 
                  variant="secondary" 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2 overflow-x-auto max-w-[200px] sm:max-w-none justify-center px-2 scrollbar-hide">
                  <div className="flex gap-2 flex-nowrap">
                    {storyPages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-3 h-3 rounded-full transition-colors flex-shrink-0 ${
                          index === currentPage ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="secondary" 
                  onClick={nextPage}
                  disabled={currentPage === storyPages.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audio Status */}
      {isPlaying && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="py-3 px-6">
              <div className="flex items-center gap-2 text-primary">
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm font-medium ml-2">Reading story aloud...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};