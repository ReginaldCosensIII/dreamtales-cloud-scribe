import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  X
} from "lucide-react";
import heroClouds from "@/assets/hero-clouds.jpg";
import cloudCharacter from "@/assets/cloud-character.jpg";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleGenerateStory = async () => {
    if (!storyPrompt.trim()) return;
    
    setIsGenerating(true);
    // Placeholder for OpenAI integration - will need Supabase backend
    setTimeout(() => {
      setGeneratedStory(`Once upon a time, ${storyPrompt}... [This is a demo story. Connect to Supabase for AI generation!]`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating clouds animation - Behind content */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-16 h-10 bg-secondary/30 rounded-full animate-float opacity-40"></div>
        <div className="absolute top-40 right-20 w-20 h-12 bg-primary/25 rounded-full animate-float-delayed opacity-35"></div>
        <div className="absolute top-60 left-1/4 w-12 h-8 bg-accent/30 rounded-full animate-float opacity-38"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-14 bg-primary/20 rounded-full animate-float-delayed opacity-32"></div>
        <div className="absolute top-1/3 left-1/2 w-18 h-11 bg-secondary/22 rounded-full animate-float opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-cloud bg-clip-text text-transparent">DreamTales AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-dreamy">About</a>
              <a href="#generator" className="text-muted-foreground hover:text-foreground transition-dreamy">Generator</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-dreamy">Pricing</a>
              <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
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
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-dreamy">About</a>
                <a href="#generator" className="text-muted-foreground hover:text-foreground transition-dreamy">Generator</a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-dreamy">Pricing</a>
                <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
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
            <img 
              src={cloudCharacter} 
              alt="DreamTales AI Cloud Character" 
              className="w-32 h-32 mx-auto mb-8 animate-float rounded-full"
            />
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-cloud bg-clip-text text-transparent">
              DreamTales AI
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto font-medium">
              Custom bedtime stories, crafted by imagination and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="iridescent" size="xl" onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your First Story
              </Button>
              <Button variant="cloud" size="lg">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn More
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
            <Card className="animate-on-scroll cloud-shape bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud h-full">
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

            <Card className="animate-on-scroll cloud-shape bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud h-full">
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

            <Card className="animate-on-scroll cloud-shape bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud h-full">
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

            <Card className="animate-on-scroll cloud-shape bg-card/70 backdrop-blur-md border-border/50 shadow-dreamy">
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
                    variant="dreamy" 
                    size="lg" 
                    onClick={handleGenerateStory}
                    disabled={isGenerating || !storyPrompt.trim()}
                    className="flex-1 sm:flex-none"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Weaving Magic...
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Generate Story
                      </>
                    )}
                  </Button>
                  
                  {generatedStory && (
                    <Button variant="outline" size="lg">
                      <Heart className="mr-2 h-4 w-4" />
                      Save Story
                    </Button>
                  )}
                </div>

                {generatedStory && (
                  <Card className="cloud-shape bg-background/50 border-border/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 text-primary fill-primary" />
                        <span className="font-medium">Your Dream Story</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {generatedStory}
                      </p>
                    </CardContent>
                  </Card>
                )}

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
              <Card key={index} className="animate-on-scroll cloud-shape bg-card/60 backdrop-blur-sm border-border/50 shadow-gentle hover:shadow-cloud transition-cloud">
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
      <section id="pricing" className="py-20 bg-gradient-to-b from-primary/5 to-background">
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
                variant: "outline" as const
              },
              {
                name: "Premium Tales",
                price: "$9",
                period: "per month",
                features: ["Unlimited stories", "Custom characters", "Priority support", "Printable formats"],
                cta: "Go Premium",
                variant: "dreamy" as const,
                popular: true
              },
              {
                name: "DreamBook",
                price: "$29",
                period: "per month",
                features: ["Everything in Premium", "Professional illustrations", "Physical book printing", "Family sharing"],
                cta: "Create Books",
                variant: "iridescent" as const
              }
            ].map((plan, index) => (
              <Card key={index} className={`animate-on-scroll cloud-shape relative h-full ${plan.popular ? 'border-primary shadow-dreamy scale-105' : 'border-border/50 shadow-gentle'} bg-card/70 backdrop-blur-md hover:shadow-dreamy hover:scale-105 transition-cloud`}>
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
      <footer className="py-16 gradient-iridescent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Cloud className="h-8 w-8 text-foreground" />
                <span className="text-xl font-bold text-foreground">DreamTales AI</span>
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
      </footer>

      {/* Auth Modal Placeholder */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md cloud-shape bg-card shadow-dreamy">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sign In to DreamTales</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAuthModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground p-8">
                <Cloud className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="mb-4">To enable authentication and story saving, you'll need to connect this project to Supabase.</p>
                <Button variant="outline" onClick={() => setShowAuthModal(false)}>
                  Learn More About Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
