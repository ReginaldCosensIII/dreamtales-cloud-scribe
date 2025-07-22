import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoryReadingMode } from "@/components/StoryReadingMode";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Star, 
  Heart, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Edit3,
  Share2,
  Printer,
  BookOpen
} from "lucide-react";

interface StoryOutputPreviewProps {
  story: {
    id?: string;
    title: string;
    content: string;
    isComplete: boolean;
    setting?: string;
    themes?: string[];
  };
  onSave?: () => void;
  onContinue?: () => void;
  onEdit?: () => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
  canContinue?: boolean;
}

export const StoryOutputPreview = ({ 
  story, 
  onSave, 
  onContinue, 
  onEdit, 
  onRegenerate,
  isGenerating = false,
  canContinue = false
}: StoryOutputPreviewProps) => {
  const [isReading, setIsReading] = useState(false);
  const [showReadingMode, setShowReadingMode] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const toggleReading = async () => {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      setIsReading(false);
      return;
    }

    try {
      setIsGeneratingAudio(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: story.content,
          voice: 'alloy'
        }
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
        
        audio.onplay = () => setIsReading(true);
        audio.onpause = () => setIsReading(false);
        audio.onended = () => setIsReading(false);
        audio.onerror = () => {
          toast.error('Failed to play audio');
          setIsReading(false);
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

  const handleDownload = () => {
    // Create a simple text file download
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

  const openReadingMode = () => {
    setShowReadingMode(true);
  };

  return (
    <Card className="bg-background/50 border-border/30 shadow-gentle">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <CardTitle className="text-lg">{story.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={story.isComplete ? "secondary" : "outline"}>
                {story.isComplete ? "Complete Story" : "Story in Progress"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {story.content.split(' ').length} words
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={openReadingMode}
              className="h-8 w-8"
              title="Story Mode"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleReading}
              disabled={isGeneratingAudio}
              className="h-8 w-8"
              title="Play Audio"
            >
              {isGeneratingAudio ? (
                <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
              ) : isReading ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8"
              title="Share Story"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Story Content */}
        <div className="max-h-96 overflow-y-auto">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {story.content}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
          {/* Primary Actions */}
          <div className="flex gap-2 flex-1 min-w-0">
            {onSave && (
              <Button variant="primary" size="sm" onClick={onSave} className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Save Story
              </Button>
            )}
            
            {canContinue && onContinue && !story.isComplete && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onContinue}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Continuing...
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Continue Story
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            
            {onRegenerate && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onRegenerate}
                disabled={isGenerating}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        </div>

        {/* Reading Progress Indicator */}
        {isReading && (
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
              <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
              <div className="animate-pulse h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm font-medium ml-2">Reading story aloud...</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Reading Mode Modal */}
      {showReadingMode && (
        <StoryReadingMode
          story={{
            id: story.id || '',
            title: story.title,
            content: story.content,
            setting: story.setting,
            themes: story.themes || []
          }}
          onClose={() => setShowReadingMode(false)}
        />
      )}
    </Card>
  );
};