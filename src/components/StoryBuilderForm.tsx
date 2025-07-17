import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Heart, Wand2, MapPin, ChevronRight, Plus, X } from "lucide-react";

interface StoryBuilderData {
  childName: string;
  favoriteThings: string[];
  theme: string;
  setting: string;
  additionalDetails: string;
}

interface StoryBuilderFormProps {
  onGenerate: (data: StoryBuilderData) => void;
  isGenerating: boolean;
}

const themes = [
  { value: "friendship", label: "Friendship & Kindness", icon: "🤝" },
  { value: "bravery", label: "Courage & Bravery", icon: "🦁" },
  { value: "adventure", label: "Magical Adventures", icon: "✨" },
  { value: "bedtime", label: "Peaceful Bedtime", icon: "🌙" },
  { value: "learning", label: "Learning & Discovery", icon: "📚" },
  { value: "family", label: "Family Love", icon: "❤️" }
];

const settings = [
  { value: "forest", label: "Enchanted Forest", icon: "🌲" },
  { value: "ocean", label: "Under the Sea", icon: "🌊" },
  { value: "space", label: "Outer Space", icon: "🚀" },
  { value: "castle", label: "Magical Castle", icon: "🏰" },
  { value: "home", label: "Cozy Home", icon: "🏠" },
  { value: "playground", label: "Adventure Playground", icon: "🛝" }
];

export const StoryBuilderForm = ({ onGenerate, isGenerating }: StoryBuilderFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StoryBuilderData>({
    childName: "",
    favoriteThings: [],
    theme: "",
    setting: "",
    additionalDetails: ""
  });
  const [newFavoriteThing, setNewFavoriteThing] = useState("");

  const addFavoriteThing = () => {
    if (newFavoriteThing.trim() && formData.favoriteThings.length < 5) {
      setFormData(prev => ({
        ...prev,
        favoriteThings: [...prev.favoriteThings, newFavoriteThing.trim()]
      }));
      setNewFavoriteThing("");
    }
  };

  const removeFavoriteThing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      favoriteThings: prev.favoriteThings.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = () => {
    onGenerate(formData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.childName.trim() !== "";
      case 2: return formData.favoriteThings.length > 0;
      case 3: return formData.theme !== "";
      case 4: return formData.setting !== "";
      default: return true;
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-md border-border/50 shadow-dreamy">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Story Builder
          </CardTitle>
          <Badge variant="secondary">Step {step} of 4</Badge>
        </div>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`h-2 flex-1 rounded-full transition-colors ${
                num <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold">What's your child's name?</h3>
              <p className="text-muted-foreground text-sm">This will help personalize the story</p>
            </div>
            <div>
              <Label htmlFor="childName">Child's Name</Label>
              <Input
                id="childName"
                placeholder="Enter your child's name..."
                value={formData.childName}
                onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold">What does {formData.childName || "your child"} love?</h3>
              <p className="text-muted-foreground text-sm">Add their favorite things, animals, or hobbies</p>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="e.g., dragons, puppies, building blocks..."
                value={newFavoriteThing}
                onChange={(e) => setNewFavoriteThing(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFavoriteThing()}
              />
              <Button 
                type="button" 
                onClick={addFavoriteThing}
                disabled={!newFavoriteThing.trim() || formData.favoriteThings.length >= 5}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.favoriteThings.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.favoriteThings.map((thing, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {thing}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeFavoriteThing(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Add up to 5 favorite things ({formData.favoriteThings.length}/5)
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Choose a theme</h3>
              <p className="text-muted-foreground text-sm">What lesson or feeling should the story focus on?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <Card
                  key={theme.value}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    formData.theme === theme.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, theme: theme.value }))}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <div className="text-sm font-medium">{theme.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Where should the adventure take place?</h3>
              <p className="text-muted-foreground text-sm">Pick the perfect setting for the story</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {settings.map((setting) => (
                <Card
                  key={setting.value}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    formData.setting === setting.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, setting: setting.value }))}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{setting.icon}</div>
                    <div className="text-sm font-medium">{setting.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <Label htmlFor="additionalDetails">Any additional details? (Optional)</Label>
              <Textarea
                id="additionalDetails"
                placeholder="Any special requests, morals to include, or topics to avoid..."
                value={formData.additionalDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                className="mt-2 min-h-[80px]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button 
            variant="secondary" 
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleGenerate}
              disabled={!isStepValid() || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Story
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};