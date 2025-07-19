import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, Youtube, Star, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const partnershipSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  platform: z.string().min(2, "Platform is required").max(50, "Platform name too long"),
  followers: z.string().min(1, "Follower count is required").max(20, "Please use a shorter format"),
  message: z.string().min(10, "Please provide more details").max(1000, "Message too long")
});

const SocialPartnership = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "",
    followers: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      partnershipSchema.parse(formData);
      setErrors({});
      
      // TODO: Implement form submission
      toast.success("Partnership inquiry submitted! We'll be in touch soon.");
      setFormData({ name: "", email: "", platform: "", followers: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the form errors before submitting.");
      }
    }
  };

  const socialSlides = [
    {
      id: 1,
      platform: "Instagram",
      username: "@story_creator_1",
      followers: "125K",
      icon: Instagram,
      content: "Just discovered @dreamtales_ai and I'm obsessed! 😍 Created the most amazing bedtime story for my daughter in minutes. The AI really understands what kids love! #storytelling #parentlife",
      engagement: { likes: 2847, comments: 156, shares: 89 },
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      platform: "Twitter",
      username: "@content_king",
      followers: "89K",
      icon: Twitter,
      content: "Thread 🧵 about AI storytelling tools that actually work:\n\n1/ @dreamtales_ai just changed my content game\n2/ Perfect for creating engaging narratives\n3/ Kids stories that parents actually enjoy reading\n\nThis is the future of creative content! 🚀",
      engagement: { likes: 1234, comments: 87, shares: 156 },
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      platform: "YouTube",
      username: "Family Vlogger",
      followers: "340K",
      icon: Youtube,
      content: "I tested 5 AI story generators for kids and DreamTales was hands down the winner! Watch my full review where I create stories live with my twins. The results will surprise you! Link in bio 👆",
      engagement: { likes: 5621, comments: 234, shares: 445 },
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Carousel Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Partner With DreamTales
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our community of content creators and help families discover the magic of AI-powered storytelling
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {socialSlides.map((slide) => (
                  <CarouselItem key={slide.id}>
                    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          {/* Creator Profile */}
                          <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start mb-4">
                              <img 
                                src={slide.image} 
                                alt={slide.username}
                                className="w-16 h-16 rounded-full mr-4"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <slide.icon className="w-5 h-5 text-primary" />
                                  <span className="font-semibold text-lg">{slide.username}</span>
                                </div>
                                <p className="text-muted-foreground">{slide.followers} followers</p>
                              </div>
                            </div>
                            
                            <Badge variant="secondary" className="mb-4">
                              {slide.platform} Creator
                            </Badge>
                            
                            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {slide.engagement.likes.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {slide.engagement.comments}
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="w-4 h-4" />
                                {slide.engagement.shares}
                              </div>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="bg-background/60 rounded-lg p-6 border">
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            </div>
                            <p className="text-foreground leading-relaxed">
                              "{slide.content}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start Your Partnership Journey
            </h2>
            <p className="text-muted-foreground">
              Ready to create magical content with DreamTales? Let's discuss how we can work together.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Primary Platform *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      placeholder="Instagram, YouTube, TikTok, etc."
                      className={errors.platform ? "border-destructive" : ""}
                    />
                    {errors.platform && <p className="text-sm text-destructive mt-1">{errors.platform}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Follower Count *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.followers}
                      onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                      placeholder="e.g., 50K, 1M"
                      className={errors.followers ? "border-destructive" : ""}
                    />
                    {errors.followers && <p className="text-sm text-destructive mt-1">{errors.followers}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tell us about your content and audience *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your content style, audience demographics, and how you'd like to collaborate with DreamTales..."
                    rows={5}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full">
                  Submit Partnership Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SocialPartnership;