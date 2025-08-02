import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDropdown from "@/components/UserDropdown";
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
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import heroClouds from "@/assets/hero-clouds.jpg";
import cloudCharacter from "@/assets/cloud-character.jpg";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState("");
  const { user } = useAuth();
  const { profile } = useUserData();

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

  const handleGetStarted = () => {
    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth';
      return;
    }
    
    if (storyPrompt.trim()) {
      // Navigate to generator page with the prompt
      window.location.href = `/generator?prompt=${encodeURIComponent(storyPrompt)}`;
    } else {
      // Navigate to generator page without prompt
      window.location.href = '/generator';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${heroClouds})` }}
        />
        
        {/* Animated cloud layers for subtle movement */}
        <div className="absolute inset-0 opacity-20 animate-cloud-drift-gentle" style={{ 
          backgroundImage: `url(${heroClouds})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
        <div className="absolute inset-0 opacity-15 animate-cloud-drift-slow-reverse" style={{ 
          backgroundImage: `url(${heroClouds})`,
          backgroundSize: '105% 105%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-cloud bg-clip-text text-transparent">
              DreamTales AI
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto font-medium">
              Custom bedtime stories, crafted by imagination and AI.
            </p>
            
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <Button variant="accent" size="xl" onClick={handleGetStarted}>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Create Magic Together
              </h2>
              <p className="text-lg text-muted-foreground">
                Tell us about your child's adventure ideas, and we'll weave them into an enchanting bedtime story.
              </p>
            </div>

            <Card className="animate-on-scroll bg-card/70 backdrop-blur-md border-border/50 shadow-dreamy">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Story Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">What should your story be about?</label>
                  <Textarea
                    placeholder="A brave little mouse who wants to become a pilot..."
                    className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary transition-dreamy"
                    value={storyPrompt}
                    onChange={(e) => setStoryPrompt(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="accent" 
                    size="lg" 
                    onClick={handleGetStarted}
                    disabled={!storyPrompt.trim()}
                    className="flex-1 sm:flex-none"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Create Story
                  </Button>
                </div>

                <div className="text-center">
                  <Badge variant="secondary" className="bg-muted/50">
                    💡 Tip: Be specific about characters, settings, or themes your child loves!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-b from-accent/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Loved by Families Everywhere
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of parents creating magical bedtime moments
            </p>
          </div>

          <div className="animate-on-scroll">
            <TestimonialCarousel usePlaceholders={true} />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-32 md:gap-8 max-w-5xl mx-auto">
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
              <Card key={index} className={`animate-on-scroll relative ${plan.popular ? 'border-primary shadow-dreamy md:scale-105 md:hover:scale-110 mt-6 md:mt-0' : 'border-border/50 shadow-gentle md:hover:scale-105'} bg-card/70 backdrop-blur-md hover:shadow-dreamy transition-cloud`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-cloud z-10">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {plan.price}
                    <span className="text-lg text-muted-foreground font-normal">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full p-6 pt-0">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.variant} className="w-full" size="lg">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
