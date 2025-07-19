import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Cloud, 
  Sparkles, 
  Heart, 
  Star, 
  Menu,
  X,
  LogOut,
  Wand2,
  Edit3,
  ArrowLeft,
  Info
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";
import { useUserData } from "@/hooks/useUserData";
import { StoryBuilderForm } from "@/components/StoryBuilderForm";
import { FreeformPromptForm } from "@/components/FreeformPromptForm";
import { StoryOutputPreview } from "@/components/StoryOutputPreview";

const StoryGenerator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<"structured" | "freeform">("freeform");
  const [searchParams] = useSearchParams();
  const [showModeInfo, setShowModeInfo] = useState(false);
  const { user, signOut } = useAuth();
  const { generateStory, isGenerating, error } = useStoryGeneration();
  const { profile } = useUserData();
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState<{
    title: string;
    content: string;
    isComplete: boolean;
  } | null>(null);

  // Redirect to auth if not logged in, preserving intent to return here
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/generator' } });
    }
  }, [user, navigate]);

  // Handle pre-loaded prompt from homepage
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && user) {
      setGeneratorMode('freeform');
      setShowModeInfo(true);
      // The FreeformPromptForm will need to be updated to accept initial prompt
    }
  }, [searchParams, user]);

  const handleStructuredGenerate = async (data: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Create a structured prompt from the form data
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="pb-16 min-h-screen bg-gradient-to-b from-secondary/20 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Create Your Perfect Story
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your adventure: Build a story step-by-step with our guided mode, or let your imagination run wild with freeform creation.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="mb-6 bg-destructive/10 border-destructive/20">
                <CardContent className="pt-6">
                  <p className="text-destructive text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

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
                      <Badge variant="outline">
                        {profile.subscription_tier === 'free' 
                          ? `${profile.stories_this_month}/3` 
                          : `${profile.stories_this_month} (unlimited)`}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Story Generator Interface */}
            <Tabs value={generatorMode} onValueChange={(value: any) => setGeneratorMode(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/50 backdrop-blur-sm">
                <TabsTrigger value="structured" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Guided Story Builder
                </TabsTrigger>
                <TabsTrigger value="freeform" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Freeform Creator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="structured" className="space-y-6">
                <StoryBuilderForm 
                  onGenerate={handleStructuredGenerate}
                  isGenerating={isGenerating}
                />
              </TabsContent>

              <TabsContent value="freeform" className="space-y-6">
                {showModeInfo && (
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      You're in Freeform Creator mode! Want more guidance? Try our <button 
                        onClick={() => setGeneratorMode('structured')} 
                        className="text-primary underline hover:no-underline"
                      >
                        Guided Story Builder
                      </button> instead.
                    </AlertDescription>
                  </Alert>
                )}
                <FreeformPromptForm 
                  onGenerate={handleFreeformGenerate}
                  isGenerating={isGenerating}
                  initialPrompt={searchParams.get('prompt') || ''}
                />
              </TabsContent>
            </Tabs>

            {/* Story Output */}
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
                    if (generatorMode === 'structured') {
                      // Re-trigger structured generation
                    } else {
                      // Re-trigger freeform generation
                    }
                  }}
                  isGenerating={isGenerating}
                  canContinue={!currentStory.isComplete}
                />
              </div>
            )}

            <div className="text-center mt-8">
              <Badge variant="secondary" className="bg-muted/50">
                💡 Tip: Switch between modes to explore different ways of creating stories!
              </Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryGenerator;