import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, X, MapPin } from 'lucide-react';
import { Place } from '@/hooks/useStoryCreation';

interface PlaceCardProps {
  place: Place;
  onUpdate: (id: string, data: Partial<Place>) => Promise<Place | null>;
  onDelete: (id: string) => Promise<boolean>;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const PlaceCard = ({ 
  place, 
  onUpdate, 
  onDelete, 
  selectable = false,
  selected = false,
  onSelect 
}: PlaceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: place.name,
    location_type: place.location_type,
    description: place.description || ''
  });

  const handleSave = async () => {
    await onUpdate(place.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: place.name,
      location_type: place.location_type,
      description: place.description || ''
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this place?')) {
      await onDelete(place.id);
    }
  };

  // For selectable mode, show a more compact version
  if (selectable) {
    return (
      <Card 
        className={`transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02] ${
          selected ? 'ring-2 ring-primary bg-primary/5' : ''
        }`}
        onClick={onSelect ? () => onSelect(place.id) : undefined}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <h4 className="font-medium text-sm truncate">{place.name}</h4>
              </div>
              <Badge variant="outline" className="text-xs mb-2">
                {place.location_type}
              </Badge>
              {place.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{place.description}</p>
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
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {isEditing ? (
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="text-lg font-semibold"
                placeholder="Place name"
              />
            ) : (
              <CardTitle className="text-lg">{place.name}</CardTitle>
            )}
          </div>
          
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
        
        <div className="mt-2">
          {isEditing ? (
            <Input
              value={editData.location_type}
              onChange={(e) => setEditData(prev => ({ ...prev, location_type: e.target.value }))}
              placeholder="Location type (e.g., forest, castle, spaceship)"
            />
          ) : (
            <Badge variant="outline" className="w-fit">
              {place.location_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {(place.description || isEditing) && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Description: </span>
            {isEditing ? (
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this place..."
                className="mt-1"
                rows={3}
              />
            ) : (
              <p className="text-sm mt-1">{place.description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};