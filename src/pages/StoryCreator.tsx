import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  MapPin, 
  BookOpen, 
  Wand2, 
  Loader2,
  Sparkles,
  Edit3,
  Info
} from 'lucide-react';

import { CharacterCard } from '@/components/CharacterCard';
import { PlaceCard } from '@/components/PlaceCard';
import { StoryCard } from '@/components/StoryCard';
import { StoryBuilderForm } from '@/components/StoryBuilderForm';
import { FreeformPromptForm } from '@/components/FreeformPromptForm';
import { StoryOutputPreview } from '@/components/StoryOutputPreview';
import { useStoryCreation } from '@/hooks/useStoryCreation';
import { useStoryGeneration } from '@/hooks/useStoryGeneration';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/contexts/AuthContext';

export default function StoryCreator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createCharacter, profile } = useUserData();
  const { generateStory, isGenerating: isGeneratingSimple, error: generationError } = useStoryGeneration();
  const {
    places,
    stories,
    characters,
    isGenerating,
    isCreatingPlace,
    error,
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    generateStoryWithElements,
    generateStoryImage,
    refetch
  } = useStoryCreation();

  // Generator modes and states
  const [generatorMode, setGeneratorMode] = useState<"structured" | "freeform">("freeform");
  const [showModeInfo, setShowModeInfo] = useState(false);
  const [currentStory, setCurrentStory] = useState<{
    title: string;
    content: string;
    isComplete: boolean;
  } | null>(null);

  // Redirect if not signed in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/creator' } });
    }
  }, [user, navigate]);

  // Handle pre-loaded prompt from homepage
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && user) {
      setGeneratorMode('freeform');
      setShowModeInfo(true);
    }
  }, [searchParams, user]);

  // Form states
  const [characterForm, setCharacterForm] = useState({
    name: '',
    description: '',
    age: '',
    appearance: '',
    traits: ''
  });
  const [placeForm, setPlaceForm] = useState({
    name: '',
    location_type: '',
    description: ''
  });
  const [storyForm, setStoryForm] = useState({
    prompt: '',
    length: 'medium' as 'short' | 'medium' | 'long',
    themes: ''
  });

  // Selection states for story generation
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  // Dialog states
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [showPlaceDialog, setShowPlaceDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPlaces();
    }
  }, [user]);

  useEffect(() => {
    if (error || generationError) {
      toast.error(error || generationError);
    }
  }, [error, generationError]);

  // Generator handlers from original StoryGenerator
  const handleStructuredGenerate = async (data: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const structuredPrompt = `Write a ${data.theme} children's story about ${data.childName} in a ${data.setting}. 
    Include these favorite things: ${data.favoriteThings.join(', ')}. 
    ${data.additionalDetails ? `Additional details: ${data.additionalDetails}` : ''}
    Make it age-appropriate, engaging, and about 3-5 paragraphs long.`;

    const result = await generateStory({
      prompt: structuredPrompt,
      storyType: 'structured',
      length: 'medium',
      setting: data.setting,
      themes: [data.theme],
      characters: [{ name: data.childName, traits: data.favoriteThings }]
    });

    if (result) {
      setCurrentStory({
        title: result.title || `${data.childName}'s ${data.theme} Adventure`,
        content: result.content,
        isComplete: result.is_complete || false
      });
    }
  };

  const handleFreeformGenerate = async (data: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const result = await generateStory({
      prompt: data.prompt,
      storyType: 'freeform',
      length: data.length
    });

    if (result) {
      setCurrentStory({
        title: result.title || "Your Custom Story",
        content: result.content,
        isComplete: result.is_complete || true
      });
    }
  };

  const handleCreateCharacter = async () => {
    if (!characterForm.name.trim()) {
      toast.error('Character name is required');
      return;
    }

    const traits = characterForm.traits.split(',').map(t => t.trim()).filter(Boolean);
    
    const result = await createCharacter({
      name: characterForm.name,
      description: characterForm.description || undefined,
      age: characterForm.age || undefined,
      appearance: characterForm.appearance || undefined,
      traits
    });

    if (result) {
      toast.success('Character created successfully!');
      setCharacterForm({ name: '', description: '', age: '', appearance: '', traits: '' });
      setShowCharacterDialog(false);
    }
  };

  const handleCreatePlace = async () => {
    if (!placeForm.name.trim() || !placeForm.location_type.trim()) {
      toast.error('Place name and type are required');
      return;
    }

    const result = await createPlace(placeForm);

    if (result) {
      toast.success('Place created successfully!');
      setPlaceForm({ name: '', location_type: '', description: '' });
      setShowPlaceDialog(false);
    }
  };

  const handleCharacterSelection = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  const handlePlaceSelection = (placeId: string) => {
    setSelectedPlaces(prev => 
      prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleGenerateStory = async () => {
    if (!storyForm.prompt.trim()) {
      toast.error('Story prompt is required');
      return;
    }

    if (selectedCharacters.length === 0 && selectedPlaces.length === 0) {
      toast.error('Please select at least one character or place');
      return;
    }

    const themes = storyForm.themes.split(',').map(t => t.trim()).filter(Boolean);

    const result = await generateStoryWithElements({
      selectedCharacters,
      selectedPlaces,
      prompt: storyForm.prompt,
      length: storyForm.length,
      themes
    });

    if (result) {
      toast.success('Story generated successfully!');
      setStoryForm({ prompt: '', length: 'medium', themes: '' });
      setSelectedCharacters([]);
      setSelectedPlaces([]);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground">
              Please sign in to create and manage your stories, characters, and places.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Story Creator</h1>
        <p className="text-muted-foreground">
          Create characters, design places, and generate amazing stories with AI.
        </p>
      </div>

      {/* User Stats */}
      {profile && (
        <Card className="mb-6 bg-secondary/10 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Welcome back, </span>
                  <span className="font-medium">{profile.display_name || user.email}</span>
                </div>
                <Badge variant="secondary">
                  {profile.subscription_tier || 'free'} plan
                </Badge>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Stories this month: </span>
                <Badge>
                  {profile.subscription_tier === 'free' 
                    ? `${profile.stories_this_month}/30` 
                    : `${profile.stories_this_month} (unlimited)`}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="guided" className="space-y-6">
        {/* Mobile dropdown navigation */}
        <div className="block sm:hidden">
          <Select defaultValue="guided" onValueChange={(value) => {
            // Find the tab trigger and click it
            const tabTrigger = document.querySelector(`[data-value="${value}"]`) as HTMLElement;
            if (tabTrigger) {
              tabTrigger.click();
            }
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guided">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Guided Story Builder
                </div>
              </SelectItem>
              <SelectItem value="freeform">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Freeform Creator
                </div>
              </SelectItem>
              <SelectItem value="advanced">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Advanced Creator
                </div>
              </SelectItem>
              <SelectItem value="characters">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Characters
                </div>
              </SelectItem>
              <SelectItem value="places">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Manage Places
                </div>
              </SelectItem>
              <SelectItem value="stories">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  My Stories
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop/tablet tabs */}
        <TabsList className="hidden sm:grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="guided" className="flex items-center gap-2" data-value="guided">
            <Wand2 className="h-4 w-4" />
            <span className="hidden lg:inline">Guided</span>
          </TabsTrigger>
          <TabsTrigger value="freeform" className="flex items-center gap-2" data-value="freeform">
            <Edit3 className="h-4 w-4" />
            <span className="hidden lg:inline">Freeform</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2" data-value="advanced">
            <Sparkles className="h-4 w-4" />
            <span className="hidden lg:inline">Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="characters" className="flex items-center gap-2" data-value="characters">
            <Users className="h-4 w-4" />
            <span className="hidden lg:inline">Characters</span>
          </TabsTrigger>
          <TabsTrigger value="places" className="flex items-center gap-2" data-value="places">
            <MapPin className="h-4 w-4" />
            <span className="hidden lg:inline">Places</span>
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2" data-value="stories">
            <BookOpen className="h-4 w-4" />
            <span className="hidden lg:inline">Stories</span>
          </TabsTrigger>
        </TabsList>

        {/* Guided Story Builder Tab */}
        <TabsContent value="guided" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Guided Story Builder</h2>
            <p className="text-muted-foreground">
              Follow our step-by-step guide to create personalized bedtime stories.
            </p>
          </div>
          <StoryBuilderForm 
            onGenerate={handleStructuredGenerate}
            isGenerating={isGeneratingSimple}
          />
        </TabsContent>

        {/* Freeform Creator Tab */}
        <TabsContent value="freeform" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Freeform Creator</h2>
            <p className="text-muted-foreground">
              Let your imagination run wild with complete creative freedom.
            </p>
          </div>
          {showModeInfo && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You're in Freeform Creator mode! Want more guidance? Try our{' '}
                <button 
                  onClick={() => setGeneratorMode('structured')} 
                  className="text-primary underline hover:no-underline"
                >
                  Guided Story Builder
                </button>{' '}
                instead.
              </AlertDescription>
            </Alert>
          )}
          <FreeformPromptForm 
            onGenerate={handleFreeformGenerate}
            isGenerating={isGeneratingSimple}
            initialPrompt={searchParams.get('prompt') || ''}
          />
        </TabsContent>

        {/* Advanced Creator Tab (with custom characters and places) */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Advanced Story Creator
              </CardTitle>
              <p className="text-muted-foreground">
                Use your custom characters and places to create unique stories.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Story Prompt</label>
                  <Textarea
                    value={storyForm.prompt}
                    onChange={(e) => setStoryForm(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Describe the story you want to create..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Story Length</label>
                    <Select 
                      value={storyForm.length} 
                      onValueChange={(value: 'short' | 'medium' | 'long') => 
                        setStoryForm(prev => ({ ...prev, length: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (2-3 paragraphs)</SelectItem>
                        <SelectItem value="medium">Medium (4-6 paragraphs)</SelectItem>
                        <SelectItem value="long">Long (7+ paragraphs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Themes (optional)</label>
                    <Input
                      value={storyForm.themes}
                      onChange={(e) => setStoryForm(prev => ({ ...prev, themes: e.target.value }))}
                      placeholder="adventure, friendship, magic (comma-separated)"
                    />
                  </div>
                </div>
              </div>

              {/* Character Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Characters</h3>
                {characters.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No characters yet. Create some in the Characters tab!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                      <CharacterCard
                        key={character.id}
                        character={character}
                        onUpdate={() => Promise.resolve(null)}
                        onDelete={() => Promise.resolve(false)}
                        selectable
                        selected={selectedCharacters.includes(character.id)}
                        onSelect={handleCharacterSelection}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Place Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Places</h3>
                {places.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No places yet. Create some in the Places tab!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {places.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onUpdate={() => Promise.resolve(null)}
                        onDelete={() => Promise.resolve(false)}
                        selectable
                        selected={selectedPlaces.includes(place.id)}
                        onSelect={handlePlaceSelection}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Selection Summary */}
              {(selectedCharacters.length > 0 || selectedPlaces.length > 0) && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Selected Elements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacters.map((id) => {
                      const character = characters.find(c => c.id === id);
                      return character ? (
                        <Badge key={id} variant="default">
                          👤 {character.name}
                        </Badge>
                      ) : null;
                    })}
                    {selectedPlaces.map((id) => {
                      const place = places.find(p => p.id === id);
                      return place ? (
                        <Badge key={id} variant="secondary">
                          📍 {place.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleGenerateStory}
                disabled={isGenerating || !storyForm.prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Story...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Story
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Characters Tab */}
        <TabsContent value="characters" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Characters</h2>
            <Dialog open={showCharacterDialog} onOpenChange={setShowCharacterDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Character
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Character</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={characterForm.name}
                      onChange={(e) => setCharacterForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Character name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Age</label>
                    <Input
                      value={characterForm.age}
                      onChange={(e) => setCharacterForm(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Age or age range"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={characterForm.description}
                      onChange={(e) => setCharacterForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this character..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Appearance</label>
                    <Textarea
                      value={characterForm.appearance}
                      onChange={(e) => setCharacterForm(prev => ({ ...prev, appearance: e.target.value }))}
                      placeholder="Physical appearance..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Personality Traits</label>
                    <Input
                      value={characterForm.traits}
                      onChange={(e) => setCharacterForm(prev => ({ ...prev, traits: e.target.value }))}
                      placeholder="brave, kind, curious (comma-separated)"
                    />
                  </div>
                  <Button onClick={handleCreateCharacter} className="w-full">
                    Create Character
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {characters.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Characters Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first character to start building amazing stories.
                </p>
                <Button onClick={() => setShowCharacterDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Character
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onUpdate={async (id, data) => {
                    // Handle update through useUserData
                    await refetch();
                    return null;
                  }}
                  onDelete={async (id) => {
                    // Handle delete through useUserData
                    await refetch();
                    return true;
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Places Tab */}
        <TabsContent value="places" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Places</h2>
            <Dialog open={showPlaceDialog} onOpenChange={setShowPlaceDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Place
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Place</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={placeForm.name}
                      onChange={(e) => setPlaceForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Place name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location Type</label>
                    <Input
                      value={placeForm.location_type}
                      onChange={(e) => setPlaceForm(prev => ({ ...prev, location_type: e.target.value }))}
                      placeholder="forest, castle, city, spaceship, etc."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={placeForm.description}
                      onChange={(e) => setPlaceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this place..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleCreatePlace} 
                    className="w-full"
                    disabled={isCreatingPlace}
                  >
                    {isCreatingPlace ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Place'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {places.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Places Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first place to set the scene for your stories.
                </p>
                <Button onClick={() => setShowPlaceDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Place
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onUpdate={updatePlace}
                  onDelete={deletePlace}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Stories Tab */}
        <TabsContent value="stories" className="space-y-6">
          <h2 className="text-2xl font-bold">My Stories</h2>
          
          {stories.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first story using the Create Story tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onUpdate={async (id, data) => {
                    // Handle story updates
                    await refetch();
                  }}
                  onDelete={async (id) => {
                    // Handle story deletion
                    await refetch();
                  }}
                  onGenerateImage={generateStoryImage}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Story Output - shown after generation */}
      {currentStory && (
        <div className="mt-8 animate-fade-in">
          <StoryOutputPreview 
            story={currentStory}
            onSave={() => {
              // TODO: Implement save functionality
              console.log('Saving story:', currentStory);
            }}
            onContinue={() => {
              // TODO: Implement continue functionality
              console.log('Continuing story:', currentStory);
            }}
            onRegenerate={() => {
              // Clear current story to allow regeneration
              setCurrentStory(null);
            }}
            isGenerating={isGeneratingSimple}
            canContinue={!currentStory.isComplete}
          />
        </div>
      )}
    </div>
  );
}