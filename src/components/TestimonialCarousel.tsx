import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, Facebook, Heart, MessageCircle, Share } from "lucide-react";

// Mock testimonial data (fallback content)
const mockTestimonials = [
  {
    id: "1",
    name: "The Harris Family",
    handle: "@harris_adventures",
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face",
    quote: "DreamTales has become a nightly ritual for our kids — they can't get enough! 🌙✨",
    platform: "Instagram",
    tag: "#DreamTalesMoment",
    timestamp: "2h",
    likes: 42,
    comments: 8,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop"
  },
  {
    id: "2",
    name: "Samantha R.",
    handle: "@samantha_reads",
    avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3078d1?w=100&h=100&fit=crop&crop=face",
    quote: "Such a magical, interactive way to read with my daughter. Thank you @DreamTalesAI! 💫",
    platform: "Twitter",
    tag: "#FamilyStorytime",
    timestamp: "4h",
    likes: 38,
    comments: 12,
    image: null
  },
  {
    id: "3",
    name: "Mike & Emma's Dad",
    handle: "@dadlife_adventures",
    avatar: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&h=100&fit=crop&crop=face",
    quote: "Best bedtime stories ever! The kids love creating characters based on our pets 🐕🐱",
    platform: "Facebook",
    tag: "#DreamTalesAI",
    timestamp: "1d",
    likes: 73,
    comments: 15,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop"
  },
  {
    id: "4",
    name: "Jessica M.",
    handle: "@jessica_momlife",
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face",
    quote: "Finally, a way to make bedtime peaceful AND fun! My twins are obsessed with their dragon adventures 🐉",
    platform: "Instagram",
    tag: "#BedtimeStories",
    timestamp: "6h",
    likes: 56,
    comments: 9,
    image: null
  },
  {
    id: "5",
    name: "Carlos & Family",
    handle: "@carlos_papa",
    avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3078d1?w=100&h=100&fit=crop&crop=face",
    quote: "Incredible AI storytelling! Our daughter now asks for 'robot princess' stories every night 🤖👸",
    platform: "Twitter",
    tag: "#DreamTalesMoment",
    timestamp: "12h",
    likes: 91,
    comments: 23,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop"
  }
];

const platformIcons = {
  Instagram: Instagram,
  Twitter: Twitter,
  Facebook: Facebook
};

const platformColors = {
  Instagram: "text-pink-500",
  Twitter: "text-blue-400",
  Facebook: "text-blue-600"
};

interface TestimonialCarouselProps {
  usePlaceholders?: boolean;
}

export const TestimonialCarousel = ({ usePlaceholders = true }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(mockTestimonials);

  // Auto-rotate the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Future: Fetch social media posts
  const fetchSocialPosts = async () => {
    // TODO: Implement social media API integration
    // For now, return mock data
    return mockTestimonials;
  };

  useEffect(() => {
    if (!usePlaceholders) {
      fetchSocialPosts().then(setTestimonials);
    }
  }, [usePlaceholders]);

  const getVisibleTestimonials = () => {
    return testimonials.map((testimonial, index) => {
      const totalItems = testimonials.length;
      const angleStep = (2 * Math.PI) / totalItems;
      const currentAngle = (index - currentIndex) * angleStep;
      
      // Circular positioning
      const radius = 250;
      const x = Math.cos(currentAngle) * radius;
      const z = Math.sin(currentAngle) * radius;
      
      // Calculate which cards should be visible (front 3)
      const normalizedIndex = ((index - currentIndex) % totalItems + totalItems) % totalItems;
      
      let scale = 0.6;
      let opacity = 0;
      let y = 0;
      
      // Center card
      if (normalizedIndex === 0) {
        scale = 1;
        opacity = 1;
        y = 0;
      }
      // Left and right cards
      else if (normalizedIndex === 1 || normalizedIndex === totalItems - 1) {
        scale = 0.8;
        opacity = 0.8;
        y = 20;
      }
      // Semi-visible side cards
      else if (normalizedIndex === 2 || normalizedIndex === totalItems - 2) {
        scale = 0.6;
        opacity = 0.4;
        y = 40;
      }
      
      return {
        ...testimonial,
        x,
        y,
        z,
        scale,
        opacity,
        index: normalizedIndex
      };
    });
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
        {visibleTestimonials.map((testimonial) => {
          const PlatformIcon = platformIcons[testimonial.platform as keyof typeof platformIcons];
          const platformColor = platformColors[testimonial.platform as keyof typeof platformColors];
          
          return (
            <motion.div
              key={testimonial.id}
              initial={{ 
                x: testimonial.x,
                y: testimonial.y,
                z: testimonial.z,
                scale: 0.5,
                opacity: 0
              }}
              animate={{ 
                x: testimonial.x,
                y: testimonial.y,
                z: testimonial.z,
                scale: testimonial.scale,
                opacity: testimonial.opacity
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeInOut"
              }}
              className="absolute w-80 h-auto"
              style={{
                transform: `translate(-50%, -50%) translate3d(${testimonial.x}px, ${testimonial.y}px, ${testimonial.z}px)`,
                left: "50%",
                top: "50%",
                zIndex: testimonial.index === 0 ? 10 : 5 - testimonial.index
              }}
            >
              <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-dreamy hover:shadow-cloud transition-cloud overflow-hidden">
                <CardContent className="p-4">
                  {/* Header with profile info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground">{testimonial.name}</h3>
                        <PlatformIcon className={`h-4 w-4 ${platformColor}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{testimonial.timestamp}</span>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-foreground mb-3 leading-relaxed">
                    {testimonial.quote}
                  </p>

                  {/* Image if available */}
                  {testimonial.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={testimonial.image} 
                        alt="Post content"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {/* Hashtag */}
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {testimonial.tag}
                    </Badge>
                  </div>

                  {/* Engagement stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{testimonial.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{testimonial.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-primary scale-125" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};