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
      toast.info('Generating audio...', { duration: 2000 });
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate audio');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Audio generation failed');
      }

      if (data.audioContent) {
        // Stop any currently playing audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.src = '';
        }

        // Create new audio element
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        
        audio.onplay = () => {
          setIsPlaying(true);
          toast.success('Audio playback started');
        };
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => {
          setIsPlaying(false);
          toast.info('Audio playback completed');
        };
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          toast.error('Failed to play audio - the file may be corrupted');
          setIsPlaying(false);
        };

        setCurrentAudio(audio);
        await audio.play();
      } else {
        throw new Error('No audio content received');
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      const errorMessage = error.message || 'Failed to generate audio. Please try again.';
      toast.error(errorMessage);
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
    try {
      const element = document.createElement("a");
      const file = new Blob([`${story.title}\n\n${story.content}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${story.title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Story downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download story');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.content,
        });
        toast.success('Story shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
          toast.success('Story copied to clipboard!');
        } catch (clipboardError) {
          toast.error('Failed to share story');
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
        toast.success('Story copied to clipboard!');
      } catch (clipboardError) {
        toast.error('Failed to copy story to clipboard');
      }
    }
  };

  const currentText = storyPages.length > 0 ? storyPages[currentPage] : story.content;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold truncate">{story.title}</h1>
            {storyPages.length > 1 && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Page {currentPage + 1} of {storyPages.length}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            disabled={isGeneratingAudio}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            {isGeneratingAudio ? (
              <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : isPlaying ? (
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload} className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8 sm:h-10 sm:w-10">
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Story Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-4xl mx-auto bg-card/70 backdrop-blur-md shadow-dreamy">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6 md:space-y-8">
              {/* Story Image */}
              {images.length > 0 ? (
                <div className="w-full max-w-sm sm:max-w-md mx-auto">
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
                          onError={(e) => {
                            console.error('Image load error:', e);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
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
                <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm text-center">Story Illustration</p>
                </div>
              )}
              
              {/* Story Text */}
              <div className="text-center">
                <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto px-2">
                  {currentText}
                </p>
              </div>
            </div>

            {/* Navigation */}
            {storyPages.length > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-border/50 gap-4">
                <Button 
                  variant="secondary" 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                
                <div className="flex gap-2 overflow-x-auto max-w-full justify-center px-2 scrollbar-hide order-1 sm:order-2">
                  <div className="flex gap-2 flex-nowrap">
                    {storyPages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-3 h-3 rounded-full transition-colors flex-shrink-0 ${
                          index === currentPage ? 'bg-primary' : 'bg-muted'
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="secondary" 
                  onClick={nextPage}
                  disabled={currentPage === storyPages.length - 1}
                  className="flex items-center gap-2 w-full sm:w-auto order-3"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audio Status */}
      {isPlaying && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-4">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="py-2 px-4 sm:py-3 sm:px-6">
              <div className="flex items-center gap-2 text-primary">
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs sm:text-sm font-medium ml-2">Reading story aloud...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};