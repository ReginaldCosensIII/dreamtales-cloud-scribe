import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";
import { useUserData } from "@/hooks/useUserData";
import { StoryBuilderForm } from "@/components/StoryBuilderForm";
import { FreeformPromptForm } from "@/components/FreeformPromptForm";
import { StoryOutputPreview } from "@/components/StoryOutputPreview";

const StoryGenerator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<"structured" | "freeform">("structured");
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-cloud bg-clip-text text-transparent">DreamTales AI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                <ArrowLeft className="inline mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {profile?.display_name || user.email}
                </span>
                <Badge variant="secondary">
                  {profile?.subscription_tier || 'free'}
                </Badge>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-dreamy">
                  <ArrowLeft className="inline mr-2 h-4 w-4" />
                  Back to Home
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-dreamy">About</Link>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-secondary/20 to-accent/10">
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
                <FreeformPromptForm 
                  onGenerate={handleFreeformGenerate}
                  isGenerating={isGenerating}
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