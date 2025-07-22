import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CharacterCard } from "@/components/CharacterCard";
import { PlaceCard } from "@/components/PlaceCard";
import { useUserData } from "@/hooks/useUserData";
import { useStoryCreation } from "@/hooks/useStoryCreation";
import { Sparkles, Clock, Smile, Palette, Users, MapPin } from "lucide-react";

interface FreeformData {
  prompt: string;
  length: 'short' | 'medium' | 'long';
  tone: 'calm' | 'funny' | 'magical';
  selectedCharacters: string[];
  selectedPlaces: string[];
}

interface FreeformPromptFormProps {
  onGenerate: (data: FreeformData) => void;
  isGenerating: boolean;
  initialPrompt?: string;
}

const lengthOptions = [
  { value: 'short', label: 'Short (2-3 minutes)', description: 'Perfect for quick bedtime stories', icon: "⚡" },
  { value: 'medium', label: 'Medium (5-7 minutes)', description: 'Great for regular story time', icon: "📖" },
  { value: 'long', label: 'Long (10-15 minutes)', description: 'For extended adventures', icon: "📚" }
];

const toneOptions = [
  { value: 'calm', label: 'Calm & Peaceful', description: 'Soothing for bedtime', icon: "🌙" },
  { value: 'funny', label: 'Fun & Silly', description: 'Full of giggles and laughs', icon: "😄" },
  { value: 'magical', label: 'Magical & Wonder', description: 'Enchanting and mysterious', icon: "✨" }
];

export const FreeformPromptForm = ({ onGenerate, isGenerating, initialPrompt = "" }: FreeformPromptFormProps) => {
  const { characters } = useUserData();
  const { places } = useStoryCreation();
  const [formData, setFormData] = useState<FreeformData>({
    prompt: initialPrompt,
    length: 'medium',
    tone: 'magical',
    selectedCharacters: [],
    selectedPlaces: []
  });

  const handleGenerate = () => {
    if (formData.prompt.trim()) {
      onGenerate(formData);
    }
  };

  const examplePrompts = [
    "A brave little mouse who dreams of flying with the birds",
    "A magical garden where vegetables come to life at night",
    "A friendship between a shy dragon and a curious kitten",
    "An adventure in a library where books tell their own stories"
  ];

  const useExamplePrompt = (prompt: string) => {
    setFormData(prev => ({ ...prev, prompt }));
  };

  return (
    <Card className="bg-card/70 backdrop-blur-md border-border/50 shadow-dreamy">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Freeform Story Creator
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Describe your story idea and let AI bring it to life
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="prompt" className="text-base font-medium">
            What story would you like to create?
          </Label>
          <Textarea
            id="prompt"
            placeholder="Describe your story idea in detail..."
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            className="mt-3 min-h-[120px] bg-background/50 border-border/50 focus:border-primary transition-dreamy"
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Include characters, setting, and what kind of adventure they should have!
          </p>
        </div>

        {/* Example Prompts */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Need inspiration? Try these examples:
          </Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {examplePrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="justify-start text-left h-auto p-3 text-muted-foreground hover:text-foreground whitespace-normal"
                onClick={() => useExamplePrompt(prompt)}
              >
                <Palette className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Story Length */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            Story Length
          </Label>
          <div className="grid gap-3">
            {lengthOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  formData.length === option.value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-border'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, length: option.value as any }))}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                  {formData.length === option.value && (
                    <Badge variant="secondary" className="text-xs">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Tone */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Smile className="h-4 w-4" />
            Story Tone
          </Label>
          <div className="grid gap-3">
            {toneOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  formData.tone === option.value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-border'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, tone: option.value as any }))}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                  {formData.tone === option.value && (
                    <Badge variant="secondary" className="text-xs">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Saved Characters */}
        {characters && characters.length > 0 && (
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Use Saved Characters (Optional)
            </Label>
            <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  selectable
                  selected={formData.selectedCharacters.includes(character.id)}
                  onSelect={(id) => {
                    setFormData(prev => ({
                      ...prev,
                      selectedCharacters: prev.selectedCharacters.includes(id)
                        ? prev.selectedCharacters.filter(cId => cId !== id)
                        : [...prev.selectedCharacters, id]
                    }));
                  }}
                  onUpdate={async () => null}
                  onDelete={async () => false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Saved Places */}
        {places && places.length > 0 && (
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              Use Saved Places (Optional)
            </Label>
            <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  selectable
                  selected={formData.selectedPlaces.includes(place.id)}
                  onSelect={(id) => {
                    setFormData(prev => ({
                      ...prev,
                      selectedPlaces: prev.selectedPlaces.includes(id)
                        ? prev.selectedPlaces.filter(pId => pId !== id)
                        : [...prev.selectedPlaces, id]
                    }));
                  }}
                  onUpdate={async () => null}
                  onDelete={async () => false}
                />
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleGenerate}
          disabled={!formData.prompt.trim() || isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Weaving Your Story...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Story
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};