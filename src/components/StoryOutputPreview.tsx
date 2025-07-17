import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Edit3,
  Share2,
  Printer
} from "lucide-react";

interface StoryOutputPreviewProps {
  story: {
    title: string;
    content: string;
    isComplete: boolean;
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

  const toggleReading = () => {
    setIsReading(!isReading);
    // In a real implementation, this would control text-to-speech
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
      navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
    }
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
              onClick={toggleReading}
              className="h-8 w-8"
            >
              {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8"
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
    </Card>
  );
};