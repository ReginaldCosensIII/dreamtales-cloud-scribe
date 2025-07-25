import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Character } from '@/hooks/useUserData';

interface CharacterCardProps {
  character: Character;
  onUpdate: (id: string, data: Partial<Character>) => Promise<Character | null>;
  onDelete: (id: string) => Promise<boolean>;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const CharacterCard = ({ 
  character, 
  onUpdate, 
  onDelete, 
  selectable = false,
  selected = false,
  onSelect 
}: CharacterCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: character.name,
    description: character.description || '',
    age: character.age || '',
    appearance: character.appearance || '',
    traits: character.traits ? character.traits.join(', ') : ''
  });

  const handleSave = async () => {
    const traits = editData.traits.split(',').map(t => t.trim()).filter(Boolean);
    
    await onUpdate(character.id, {
      name: editData.name,
      description: editData.description,
      age: editData.age,
      appearance: editData.appearance,
      traits
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: character.name,
      description: character.description || '',
      age: character.age || '',
      appearance: character.appearance || '',
      traits: character.traits ? character.traits.join(', ') : ''
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this character?')) {
      await onDelete(character.id);
    }
  };

  // For selectable mode, show a more compact version
  if (selectable) {
    return (
      <Card 
        className={`transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02] ${
          selected ? 'ring-2 ring-primary bg-primary/5' : ''
        }`}
        onClick={onSelect ? () => onSelect(character.id) : undefined}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{character.name}</h4>
              {character.age && (
                <p className="text-xs text-muted-foreground">Age: {character.age}</p>
              )}
              {character.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{character.description}</p>
              )}
              {character.traits && character.traits.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {character.traits.slice(0, 2).map((trait, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {trait}
                    </Badge>
                  ))}
                  {character.traits.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{character.traits.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {selected && (
              <div className="flex-shrink-0">
                <Check className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full editing mode for management
  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-semibold"
              placeholder="Character name"
            />
          ) : (
            <CardTitle className="text-lg">{character.name}</CardTitle>
          )}
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {character.age && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Age: </span>
            {isEditing ? (
              <Input
                value={editData.age}
                onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Age"
                className="mt-1"
              />
            ) : (
              <span>{character.age}</span>
            )}
          </div>
        )}
        
        {character.description && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Description: </span>
            {isEditing ? (
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Character description"
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{character.description}</p>
            )}
          </div>
        )}
        
        {character.appearance && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Appearance: </span>
            {isEditing ? (
              <Textarea
                value={editData.appearance}
                onChange={(e) => setEditData(prev => ({ ...prev, appearance: e.target.value }))}
                placeholder="Physical appearance"
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="text-sm mt-1">{character.appearance}</p>
            )}
          </div>
        )}
        
        {character.traits && character.traits.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Traits: </span>
            {isEditing ? (
              <Input
                value={editData.traits}
                onChange={(e) => setEditData(prev => ({ ...prev, traits: e.target.value }))}
                placeholder="Traits (comma-separated)"
                className="mt-1"
              />
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {character.traits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};