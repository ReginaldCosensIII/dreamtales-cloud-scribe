import React, { useState, useEffect } from 'react';
import { useStoryEngine } from '@/engine/useStoryEngine';
import { useUserData } from '@/hooks/useUserData';
import { useStoryCreation } from '@/hooks/useStoryCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Wand2, 
  Image, 
  Save, 
  MessageCircle,
  Users,
  MapPin,
  Loader2,
  Edit3,
  Expand,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { StoryLength, StoryTone } from '@/engine/types/StoryTypes';

export default function StoryBuilder() {
  const storyEngine = useStoryEngine();
  const { characters, stories, profile } = useUserData();
  const { places, fetchPlaces } = useStoryCreation();
  
  const [prompt, setPrompt] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');
  const [storyTone, setStoryTone] = useState<StoryTone>('magical');
  const [coachRequest, setCoachRequest] = useState('');
  const [editInstructions, setEditInstructions] = useState('');

  // Fetch places on component mount
  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSelectStory = (story: any) => {
    storyEngine.loadStory(story);
  };

  const handleGenerateStory = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a story prompt');
      return;
    }

    await storyEngine.generateStory({
      text: prompt,
      length: storyLength,
      tone: storyTone,
      type: 'freeform',
      selectedCharacters,
      selectedPlaces,
      generateImages: true
    });
  };

  const handleContinueStory = async () => {
    if (!storyEngine.currentStory?.id || !prompt.trim()) {
      toast.error('No story to continue or missing continuation prompt');
      return;
    }

    await storyEngine.continueStory(storyEngine.currentStory.id, prompt);
    setPrompt('');
  };

  const handleEditStory = async () => {
    if (!storyEngine.currentStory?.id || !editInstructions.trim()) {
      toast.error('No story to edit or missing edit instructions');
      return;
    }

    await storyEngine.editStory(storyEngine.currentStory.id, editInstructions);
    setEditInstructions('');
  };

  const handleCoachRequest = async () => {
    if (!storyEngine.currentStory?.content || !coachRequest.trim()) {
      toast.error('No story content or missing coach request');
      return;
    }

    const suggestions = await storyEngine.getCoachSuggestions(
      storyEngine.currentStory.content, 
      coachRequest
    );
    
    if (suggestions.length > 0) {
      toast.success(`AI Coach provided ${suggestions.length} suggestions`);
      // TODO: Display suggestions in a proper UI
      console.log('Coach suggestions:', suggestions);
    }
    setCoachRequest('');
  };

  const handleSaveStory = async () => {
    if (!storyEngine.currentStory) {
      toast.error('No story to save');
      return;
    }

    await storyEngine.saveStory(storyEngine.currentStory);
  };

  const handleGenerateImages = async () => {
    if (!storyEngine.currentStory?.id) {
      toast.error('No story to illustrate');
      return;
    }

    await storyEngine.generateImages(storyEngine.currentStory.id);
  };

  const getStatusProgress = () => {
    if (!storyEngine.currentStory) return 0;
    const statusMap = {
      'prompt': 10,
      'generating': 30,
      'draft': 60,
      'editing': 80,
      'final': 90,
      'book-ready': 100
    };
    return statusMap[storyEngine.currentStory.status] || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Story Builder</h1>
          <p className="text-muted-foreground">
            Create, edit, and refine your stories with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Characters & Places */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Characters
                </h4>
                <div className="space-y-2">
                  {characters.map((character) => (
                    <Button
                      key={character.id}
                      variant={selectedCharacters.includes(character.id) ? "primary" : "secondary"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        if (selectedCharacters.includes(character.id)) {
                          setSelectedCharacters(prev => prev.filter(id => id !== character.id));
                        } else {
                          setSelectedCharacters(prev => [...prev, character.id]);
                        }
                      }}
                    >
                      {character.name}
                    </Button>
                  ))}
                  {characters.length === 0 && (
                    <p className="text-sm text-muted-foreground">No characters yet</p>
                  )}
                </div>
              </div>

              <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Places
                  </h4>
                  <div className="space-y-2">
                    {places.map((place) => (
                      <Button
                        key={place.id}
                        variant={selectedPlaces.includes(place.id) ? "primary" : "secondary"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          if (selectedPlaces.includes(place.id)) {
                            setSelectedPlaces(prev => prev.filter(id => id !== place.id));
                          } else {
                            setSelectedPlaces(prev => [...prev, place.id]);
                          }
                        }}
                      >
                        {place.name}
                      </Button>
                    ))}
                    {places.length === 0 && (
                      <p className="text-sm text-muted-foreground">No places yet</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Saved Stories
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {stories.map((story) => (
                      <Button
                        key={story.id}
                        variant={storyEngine.currentStory?.id === story.id ? "primary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleSelectStory(story)}
                      >
                        <div className="truncate">
                          <div className="font-medium truncate">{story.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {story.content.substring(0, 50)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                    {stories.length === 0 && (
                      <p className="text-sm text-muted-foreground">No saved stories yet</p>
                    )}
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Center - Story Workspace */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Story Workspace</CardTitle>
                {storyEngine.currentStory && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {storyEngine.currentStory.status}
                    </Badge>
                    <Progress value={getStatusProgress()} className="w-20" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="coach">Coach</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Length</label>
                        <Select value={storyLength} onValueChange={(value) => setStoryLength(value as StoryLength)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tone</label>
                        <Select value={storyTone} onValueChange={(value) => setStoryTone(value as StoryTone)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="funny">Funny</SelectItem>
                            <SelectItem value="magical">Magical</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="educational">Educational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Story Prompt</label>
                      <Textarea
                        placeholder="Describe your story idea..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={handleGenerateStory}
                      disabled={storyEngine.isProcessing}
                      className="w-full"
                    >
                      {storyEngine.isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                      )}
                      Generate Story
                    </Button>

                    {storyEngine.currentStory && (
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Continue the story..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleContinueStory}
                            disabled={storyEngine.isProcessing}
                            size="icon"
                          >
                            <Expand className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  {storyEngine.currentStory ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {storyEngine.currentStory.title}
                        </h3>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">
                            {storyEngine.currentStory.content}
                          </p>
                        </div>
                      </div>
                      {storyEngine.currentStory.metadata && (
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{storyEngine.currentStory.metadata.wordCount} words</span>
                          <span>{storyEngine.currentStory.metadata.estimatedReadTime} min read</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No story generated yet. Create one in the Create tab!</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="edit" className="space-y-4">
                  {storyEngine.currentStory ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Edit Instructions</label>
                        <Textarea
                          placeholder="Describe what you'd like to change..."
                          value={editInstructions}
                          onChange={(e) => setEditInstructions(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={handleEditStory}
                        disabled={storyEngine.isProcessing}
                        className="w-full"
                      >
                        {storyEngine.isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Edit3 className="h-4 w-4 mr-2" />
                        )}
                        Apply Edits
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generate a story first to start editing</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="coach" className="space-y-4">
                  {storyEngine.currentStory ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ask the AI Coach</label>
                        <Textarea
                          placeholder="Ask for writing suggestions, feedback, or improvements..."
                          value={coachRequest}
                          onChange={(e) => setCoachRequest(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={handleCoachRequest}
                        disabled={storyEngine.isProcessing}
                        className="w-full"
                      >
                        {storyEngine.isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <MessageCircle className="h-4 w-4 mr-2" />
                        )}
                        Get AI Suggestions
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generate a story first to get coaching</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Progress Indicator */}
              {storyEngine.progress && (
                <Card className="mt-4 bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{storyEngine.progress.message}</p>
                        <p className="text-xs text-muted-foreground">
                          Step {storyEngine.progress.currentStep} of {storyEngine.progress.totalSteps}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar - Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Story Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleGenerateImages}
                disabled={!storyEngine.currentStory || storyEngine.isProcessing}
                variant="secondary"
                className="w-full justify-start"
              >
                <Image className="h-4 w-4 mr-2" />
                Add Images
              </Button>

              <Button 
                onClick={handleSaveStory}
                disabled={!storyEngine.currentStory || storyEngine.isProcessing}
                variant="secondary"
                className="w-full justify-start"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Story
              </Button>

              <Button 
                disabled={!storyEngine.currentStory}
                variant="secondary"
                className="w-full justify-start"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Add to Book
              </Button>

              <Separator />

              <div className="text-sm space-y-2">
                <h4 className="font-medium">Story Stats</h4>
                {storyEngine.currentStory ? (
                  <div className="space-y-1 text-muted-foreground">
                    <p>Status: {storyEngine.currentStory.status}</p>
                    {storyEngine.currentStory.metadata && (
                      <>
                        <p>Words: {storyEngine.currentStory.metadata.wordCount}</p>
                        <p>Version: {storyEngine.currentStory.metadata.version}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No active story</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}