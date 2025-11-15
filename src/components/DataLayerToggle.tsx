import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  Car, 
  ShieldAlert, 
  Construction, 
  Droplets,
  Cloud 
} from 'lucide-react';

interface DataLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
  enabled: boolean;
}

interface DataLayerToggleProps {
  layers: DataLayer[];
  onToggle: (layerId: string) => void;
}

export const DataLayerToggle = ({ layers, onToggle }: DataLayerToggleProps) => {
  const getIcon = (id: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      crashes: <Car className="w-4 h-4" />,
      crime: <ShieldAlert className="w-4 h-4" />,
      speeding: <AlertTriangle className="w-4 h-4" />,
      construction: <Construction className="w-4 h-4" />,
      flooding: <Droplets className="w-4 h-4" />,
      weather: <Cloud className="w-4 h-4" />,
    };
    return iconMap[id] || <AlertTriangle className="w-4 h-4" />;
  };

  const getIconColor = (id: string) => {
    const colorMap: Record<string, string> = {
      crashes: 'text-red-500',
      crime: 'text-amber-500',
      speeding: 'text-orange-500',
      construction: 'text-cyan-500',
      flooding: 'text-blue-500',
      weather: 'text-blue-500',
    };
    return colorMap[id] || 'text-purple-500';
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Data Layers</h3>
      <div className="space-y-3">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={getIconColor(layer.id)}>
                {getIcon(layer.id)}
              </div>
              <Label htmlFor={layer.id} className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span>{layer.name}</span>
                  {layer.count !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {layer.count}
                    </Badge>
                  )}
                </div>
              </Label>
            </div>
            <Switch
              id={layer.id}
              checked={layer.enabled}
              onCheckedChange={() => onToggle(layer.id)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
