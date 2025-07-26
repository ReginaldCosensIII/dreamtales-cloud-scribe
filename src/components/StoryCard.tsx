import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StoryReadingMode } from '@/components/StoryReadingMode';
import { useStoryImages } from '@/hooks/useStoryImages';
import { Edit, Trash2, Check, X, Image, Book, Calendar, BookOpen, Download } from 'lucide-react';

interface Story {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prompt: string;
  story_type: 'structured' | 'freeform';
  length: 'short' | 'medium' | 'long';
  setting?: string;
  characters: any[];
  themes: string[];
  parental_preferences: any;
  is_complete: boolean;
  generation_status: 'draft' | 'generating' | 'paused' | 'complete';
  created_at: string;
  updated_at: string;
}

interface StoryCardProps {
  story: Story;
  onUpdate?: (id: string, data: Partial<Story>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const StoryCard = ({ story, onUpdate, onDelete }: StoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(story.content);
  const [imagePrompt, setImagePrompt] = useState('');
  const [showImageForm, setShowImageForm] = useState(false);
  const [showReadingMode, setShowReadingMode] = useState(false);
  
  const { images, isGenerating, generateImage, fetchStoryImages, deleteImage } = useStoryImages();

  useEffect(() => {
    fetchStoryImages(story.id);
  }, [story.id, fetchStoryImages]);

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate(story.id, { content: editContent });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(story.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this story?')) {
      if (onDelete) {
        await onDelete(story.id);
      }
    }
  };

  const handleGenerateImage = async () => {
    if (imagePrompt.trim()) {
      await generateImage(story.id, imagePrompt);
      setShowImageForm(false);
      setImagePrompt('');
    }
  };

  const downloadImage = (imageData: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `story-image-${prompt.slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{story.title}</CardTitle>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowReadingMode(true)}
              title="Read Story"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowImageForm(!showImageForm)}
              title="Generate Image"
              disabled={isGenerating}
            >
              <Image className="h-4 w-4" />
            </Button>
            {onUpdate && (
              <>
                {isEditing ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={handleSave}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            {onDelete && (
              <Button size="sm" variant="ghost" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(story.created_at)}
          </div>
          <Badge variant="outline" className="text-xs">
            {story.length}
          </Badge>
          <Badge 
            variant={story.generation_status === 'complete' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {story.generation_status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {story.setting && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Setting: </span>
            <span className="text-sm">{story.setting}</span>
          </div>
        )}
        
        {story.themes && story.themes.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Themes: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {story.themes.map((theme, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <span className="text-sm font-medium text-muted-foreground">Story: </span>
          {isEditing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mt-2"
              rows={6}
              placeholder="Edit your story..."
            />
          ) : (
            <div className="mt-2 text-sm whitespace-pre-wrap bg-muted/50 rounded-md p-3 max-h-48 overflow-y-auto">
              {story.content}
            </div>
          )}
        </div>
        
        {/* Generated Images Display */}
        {images.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <span className="text-sm font-medium">Generated Images</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img 
                    src={image.image_data || image.image_url} 
                    alt={image.prompt}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(image.image_data || image.image_url || '', image.prompt)}
                        title="Download Image"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                        title="Delete Image"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{image.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showImageForm && (
          <div className="border-t pt-4 space-y-3">
            <div>
              <span className="text-sm font-medium">Generate Image</span>
              <Textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the scene you want to illustrate from this story..."
                className="mt-2"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleGenerateImage} 
                disabled={!imagePrompt.trim() || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Image className="h-3 w-3" />
                    Generate Image
                  </>
                )}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowImageForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Reading Mode Modal */}
      {showReadingMode && (
        <StoryReadingMode
          story={{
            id: story.id,
            title: story.title,
            content: story.content,
            setting: story.setting,
            themes: story.themes,
            images: images
          }}
          onClose={() => setShowReadingMode(false)}
        />
      )}
    </Card>
  );
};