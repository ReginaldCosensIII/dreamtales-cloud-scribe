import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Target,
  Zap,
  Shield,
  ChevronDown,
  Quote,
  Instagram,
  Twitter,
  Youtube,
  Menu,
  X,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Link to="/about" className="text-primary hover:text-primary/80 transition-dreamy font-medium">About</Link>
              <Link to="/#generator" className="text-muted-foreground hover:text-foreground transition-dreamy">Generator</Link>
              <Link to="/#pricing" className="text-muted-foreground hover:text-foreground transition-dreamy">Pricing</Link>
              <Button variant="secondary" size="sm">
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
                <Link to="/about" className="text-primary hover:text-primary/80 transition-dreamy font-medium">About</Link>
                <Link to="/#generator" className="text-muted-foreground hover:text-foreground transition-dreamy">Generator</Link>
                <Link to="/#pricing" className="text-muted-foreground hover:text-foreground transition-dreamy">Pricing</Link>
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-dreamy opacity-20" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-cloud bg-clip-text text-transparent">
              About DreamTales AI
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto font-medium">
              We believe every child deserves personalized stories that spark imagination, 
              strengthen family bonds, and create magical bedtime moments.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                At DreamTales AI, we're passionate about transforming bedtime into a magical experience. 
                Our AI-powered platform helps parents create personalized stories that reflect their child's 
                unique interests, fostering creativity while establishing healthy sleep routines.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Parent and child reading together"
                  className="rounded-2xl shadow-dreamy w-full h-80 object-cover"
                />
              </div>
              
              <div className="animate-on-scroll space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/20 rounded-full flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Personalized Storytelling</h3>
                    <p className="text-muted-foreground">
                      Every story is uniquely crafted to include your child's favorite characters, 
                      settings, and themes, making bedtime truly special.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-secondary/20 rounded-full flex-shrink-0">
                    <Zap className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI-Powered Creativity</h3>
                    <p className="text-muted-foreground">
                      Our advanced AI technology ensures each story is creative, age-appropriate, 
                      and perfectly tailored to your family's preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent/20 rounded-full flex-shrink-0">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                    <p className="text-muted-foreground">
                      We prioritize your family's privacy and ensure all content is 
                      child-friendly and educational.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Passionate parents and technologists working together to create magical experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                bio: "Mother of two with 10+ years in AI development. Passionate about child development and technology.",
                image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Dr. Michael Chen",
                role: "Lead AI Engineer",
                bio: "Former Google researcher specializing in natural language processing and child-safe AI systems.",
                image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              },
              {
                name: "Emma Rodriguez",
                role: "Child Development Specialist",
                bio: "Licensed psychologist with expertise in early childhood development and storytelling therapy.",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              }
            ].map((member, index) => (
              <Card key={index} className="animate-on-scroll bg-card/70 backdrop-blur-sm border-border/70 shadow-gentle hover:shadow-dreamy hover:scale-105 transition-cloud">
                <CardContent className="pt-6 text-center">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-gentle"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-accent/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Family First",
                description: "Every feature is designed with family bonding and child development in mind."
              },
              {
                icon: Sparkles,
                title: "Creative Magic",
                description: "We believe in the power of imagination to shape young minds and create wonder."
              },
              {
                icon: Shield,
                title: "Safety & Trust",
                description: "Your family's privacy and security are our highest priorities."
              },
              {
                icon: Users,
                title: "Community",
                description: "Building a supportive community of parents sharing magical bedtime moments."
              }
            ].map((value, index) => (
              <Card key={index} className="animate-on-scroll bg-card/60 backdrop-blur-sm border-border/50 shadow-gentle hover:shadow-cloud transition-cloud text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Powered by Advanced AI
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our cutting-edge technology ensures every story is unique, engaging, and perfectly suited for your child's age and interests.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="AI technology visualization"
                  className="rounded-2xl shadow-dreamy w-full h-80 object-cover"
                />
              </div>
              
              <div className="animate-on-scroll space-y-6">
                <h3 className="text-2xl font-bold mb-6">How It Works</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">1</span>
                    </div>
                    <p className="text-muted-foreground">Tell us about your child's interests and preferences</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">2</span>
                    </div>
                    <p className="text-muted-foreground">Our AI crafts a unique story tailored to their personality</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">3</span>
                    </div>
                    <p className="text-muted-foreground">Enjoy a magical bedtime story that's completely one-of-a-kind</p>
                  </div>
                </div>

                <Button variant="accent" size="lg" asChild className="mt-8">
                  <Link to="/#generator">
                    Try It Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Ready to Create Magic?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of families who have already discovered the joy of personalized bedtime stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="xl" asChild>
                <Link to="/#generator">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating Stories
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/#pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold gradient-cloud bg-clip-text text-transparent">DreamTales AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Creating magical bedtime moments with AI-powered personalized stories.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/#generator" className="block hover:text-foreground transition-dreamy">Story Generator</Link>
                <Link to="/#pricing" className="block hover:text-foreground transition-dreamy">Pricing</Link>
                <div className="block hover:text-foreground transition-dreamy cursor-pointer">Features</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/about" className="block hover:text-foreground transition-dreamy">About</Link>
                <div className="block hover:text-foreground transition-dreamy cursor-pointer">Blog</div>
                <div className="block hover:text-foreground transition-dreamy cursor-pointer">Contact</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-dreamy cursor-pointer" />
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-dreamy cursor-pointer" />
                <Youtube className="h-5 w-5 text-muted-foreground hover:text-foreground transition-dreamy cursor-pointer" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 DreamTales AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;