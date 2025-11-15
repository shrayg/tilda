import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

interface Route {
  id: string;
  name: string;
  duration: number; // minutes
  distance: number; // miles
  safetyScore: number; // 0-10
  crashes: number;
  crimes: number;
  type: 'fastest' | 'balanced' | 'safest';
}

interface RouteComparisonProps {
  routes: Route[];
  selectedRoute?: string;
  onSelectRoute?: (routeId: string) => void;
}

export const RouteComparison = ({ routes, selectedRoute, onSelectRoute }: RouteComparisonProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-safe';
    if (score >= 6) return 'text-warning';
    return 'text-danger-high';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Very Safe';
    if (score >= 6) return 'Moderately Safe';
    if (score >= 4) return 'Caution Advised';
    return 'High Risk';
  };

  const getTypeColor = (type: string) => {
    if (type === 'fastest') return 'bg-info/10 text-info border-info/20';
    if (type === 'safest') return 'bg-safe/10 text-safe border-safe/20';
    return 'bg-warning/10 text-warning border-warning/20';
  };

  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <Card
          key={route.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
            selectedRoute === route.id
              ? 'ring-2 ring-primary shadow-md'
              : 'hover:bg-accent/50'
          }`}
          onClick={() => onSelectRoute?.(route.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{route.name}</h3>
                <Badge variant="outline" className={getTypeColor(route.type)}>
                  {route.type === 'fastest' && 'Fastest'}
                  {route.type === 'safest' && 'Safest'}
                  {route.type === 'balanced' && 'Balanced'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{route.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{route.distance} mi</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(route.safetyScore)}`}>
                {route.safetyScore.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">/ 10</div>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Safety Score
                </span>
                <span className={`font-medium ${getScoreColor(route.safetyScore)}`}>
                  {getScoreLabel(route.safetyScore)}
                </span>
              </div>
              <Progress 
                value={route.safetyScore * 10} 
                className="h-2"
              />
            </div>

            <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-danger-medium" />
                <span>{route.crashes} crashes</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-warning" />
                <span>{route.crimes} incidents</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
