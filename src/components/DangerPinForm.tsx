import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { MapPin, Star } from 'lucide-react';

interface DangerPinFormProps {
  latitude: number;
  longitude: number;
  onSubmit: (data: {
    lat: number;
    lng: number;
    category: string;
    score: number;
    description: string;
  }) => void;
  onCancel: () => void;
}

export const DangerPinForm = ({ latitude, longitude, onSubmit, onCancel }: DangerPinFormProps) => {
  const [category, setCategory] = useState('');
  const [score, setScore] = useState(3);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      lat: latitude,
      lng: longitude,
      category,
      score,
      description,
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-danger-high" />
          <h3 className="text-lg font-semibold">Report a Danger</h3>
        </div>

        <div className="text-sm text-muted-foreground">
          Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Danger Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="traffic">Traffic Hazard</SelectItem>
              <SelectItem value="crime">Crime Risk</SelectItem>
              <SelectItem value="infrastructure">Infrastructure Hazard</SelectItem>
              <SelectItem value="environmental">Environmental Hazard</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Danger Level (1-5)</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setScore(val)}
                className={`p-2 rounded-md transition-colors ${
                  score >= val
                    ? 'text-warning'
                    : 'text-muted-foreground'
                }`}
              >
                <Star className={`w-6 h-6 ${score >= val ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe the hazard..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1" disabled={!category}>
            Submit Report
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
