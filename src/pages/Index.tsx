import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cloud, 
  Sparkles, 
  Heart, 
  Moon, 
  Star, 
  BookOpen, 
  Users, 
  Printer,
  ChevronDown,
  Quote,
  Instagram,
  Twitter,
  Youtube,
  Menu,
  X,
  LogOut,
  Wand2,
  Edit3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";
import { useUserData } from "@/hooks/useUserData";
import { StoryBuilderForm } from "@/components/StoryBuilderForm";
import { FreeformPromptForm } from "@/components/FreeformPromptForm";
import { StoryOutputPreview } from "@/components/StoryOutputPreview";
import heroClouds from "@/assets/hero-clouds.jpg";
import cloudCharacter from "@/assets/cloud-character.jpg";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<"structured" | "freeform">("structured");
  const { user, signOut } = useAuth();
  const { generateStory, startStructuredFlow, continueStructuredFlow, isGenerating, error } = useStoryGeneration();
  const { profile, stories } = useUserData();
  const [currentStory, setCurrentStory] = useState<{
    title: string;
    content: string;
    isComplete: boolean;
  } | null>(null);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleStructuredGenerate = async (data: any) => {
    if (!user) {
      window.location.href = '/auth';
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
      window.location.href = '/auth';
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
  };

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
              <Link to="/" className="text-primary font-medium relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-100 after:transition-transform after:duration-300">Home</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">About</Link>
              <a href="#generator" className="text-muted-foreground hover:text-foreground transition-dreamy">Generator</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-dreamy">Pricing</a>
              {user ? (
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
              ) : (
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
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
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-dreamy">About</Link>
                <a href="#generator" className="text-muted-foreground hover:text-foreground transition-dreamy">Generator</a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-dreamy">Pricing</a>
                {user ? (
                  <Button variant="secondary" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${heroClouds})` }}
        />
        <div className="absolute inset-0 gradient-dreamy opacity-40" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-cloud bg-clip-text text-transparent">
              DreamTales AI
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto font-medium">
              Custom bedtime stories, crafted by imagination and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="accent" size="xl" onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your First Story
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/about">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Where Dreams Come to Life
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              DreamTales AI helps parents create magical bedtime experiences that strengthen bonds, 
              spark imagination, and create lasting memories one story at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="animate-on-scroll bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Healthy Sleep Routine</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Establish consistent bedtime rituals with personalized stories that help children wind down naturally.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-on-scroll bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-secondary/20 rounded-full w-fit">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Creative Bonding</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Collaborate with your child to create unique characters and adventures that reflect their interests.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-on-scroll bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-accent/20 rounded-full w-fit">
                  <Printer className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Printable Stories</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Create beautiful keepsake books that your family can treasure forever with professional formatting.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-16 animate-on-scroll">
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover how DreamTales AI is transforming bedtime stories and strengthening family bonds around the world.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/about">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn More About Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-20 bg-gradient-to-b from-secondary/20 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Create Your Perfect Story
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your adventure: Build a story step-by-step with our guided mode, or let your imagination run wild with freeform creation.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="mb-6 bg-destructive/10 border-destructive/20 animate-on-scroll">
                <CardContent className="pt-6">
                  <p className="text-destructive text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Auth Check */}
            {!user && (
              <Card className="mb-6 bg-accent/10 border-accent/20 animate-on-scroll">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Sign in to create and save your magical stories!
                  </p>
                  <Button variant="accent" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* User Stats */}
            {user && profile && (
              <Card className="mb-6 bg-secondary/10 border-secondary/20 animate-on-scroll">
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

            {user && (
              <div className="animate-on-scroll">
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
            )}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-accent/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Loved by Families Everywhere
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of parents creating magical bedtime moments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "My daughter asks for DreamTales stories every night! The personalized adventures featuring her pet hamster have become our favorite bonding time.",
                author: "Sarah M.",
                role: "Mother of 2",
                avatar: "👩‍🦰"
              },
              {
                quote: "As a busy dad, DreamTales helps me create special moments with my son. The AI generates stories about his favorite dinosaurs that keep him engaged.",
                author: "Mike T.",
                role: "Father of 1",
                avatar: "👨‍🦲"
              },
              {
                quote: "The stories are so creative and age-appropriate. My twins love hearing adventures about their favorite characters, and I love the peaceful bedtimes!",
                author: "Emily R.",
                role: "Mother of twins",
                avatar: "👩‍🦱"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="animate-on-scroll bg-card/60 backdrop-blur-sm border-border/50 shadow-gentle hover:shadow-cloud transition-cloud">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="pt-20 pb-48 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Choose Your Adventure
            </h2>
            <p className="text-lg text-muted-foreground">
              Perfect plans for every family's storytelling needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free Dreams",
                price: "$0",
                period: "forever",
                features: ["3 stories per month", "Basic characters", "Email support"],
                cta: "Start Free",
                variant: "secondary" as const
              },
              {
                name: "DreamBook",
                price: "$29",
                period: "per month",
                features: ["Everything in Premium", "Professional illustrations", "Physical book printing", "Family sharing"],
                cta: "Create Books",
                variant: "accent" as const,
                popular: true
              },
              {
                name: "Premium Tales",
                price: "$9",
                period: "per month",
                features: ["Unlimited stories", "Custom characters", "Priority support", "Printable formats"],
                cta: "Go Premium",
                variant: "secondary" as const
              }
            ].map((plan, index) => (
              <Card key={index} className={`animate-on-scroll relative h-full ${plan.popular ? 'border-primary shadow-dreamy scale-105' : 'border-border/50 shadow-gentle'} bg-card/70 backdrop-blur-md hover:shadow-dreamy hover:scale-105 transition-cloud`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-cloud">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {plan.price}
                    <span className="text-lg text-muted-foreground font-normal">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col h-full">
                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.variant} className="w-full mt-auto" size="lg">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${heroClouds})` }}
        />
        <div className="absolute inset-0 gradient-dreamy opacity-20" />
        <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Cloud className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold gradient-cloud bg-clip-text text-transparent">DreamTales AI</span>
              </div>
              <p className="text-foreground/80 mb-4">
                Creating magical bedtime moments, one story at a time.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-foreground/80">
                <li><a href="#" className="hover:text-foreground transition-dreamy">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Stories</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Characters</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-foreground/80">
                <li><a href="#" className="hover:text-foreground transition-dreamy">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Safety</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-foreground/80">
                <li><a href="#" className="hover:text-foreground transition-dreamy">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-dreamy">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-foreground/20 pt-8 text-center">
            <p className="text-foreground/60">
              © 2024 DreamTales AI. All rights reserved. Made with ❤️ for families everywhere.
            </p>
          </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal Placeholder - Removed since we have dedicated auth page */}
    </div>
  );
};

export default Index;
