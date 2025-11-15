import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RouteData } from "@/types/route";
import { Clock, Navigation, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  route: RouteData;
  isSelected: boolean;
  onClick: () => void;
}

const RouteCard = ({ route, isSelected, onClick }: RouteCardProps) => {
  const getSafetyColor = (score: number) => {
    if (score >= 7) return "text-safe";
    if (score >= 4) return "text-warning";
    return "text-danger";
  };

  const getSafetyBgColor = (score: number) => {
    if (score >= 7) return "bg-safe/10 border-safe/20";
    if (score >= 4) return "bg-warning/10 border-warning/20";
    return "bg-danger/10 border-danger/20";
  };

  const getPreferenceLabel = (preference: string) => {
    switch (preference) {
      case "fastest":
        return "Fastest";
      case "safest":
        return "Safest";
      default:
        return "Balanced";
    }
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md border-2",
        isSelected ? "border-primary shadow-md" : "border-border"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{route.name}</h3>
          <Badge variant="secondary" className="mt-1">
            {getPreferenceLabel(route.preference)}
          </Badge>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-lg border font-bold text-lg",
            getSafetyBgColor(route.safetyScore)
          )}
        >
          <span className={getSafetyColor(route.safetyScore)}>
            {route.safetyScore.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-sm">/10</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{route.duration} min</span>
          <span className="text-muted-foreground">•</span>
          <Navigation className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{route.distance.toFixed(1)} km</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 mt-0.5" />
          <span>
            {route.safetyScore >= 7
              ? "Low risk route with minimal incidents"
              : route.safetyScore >= 4
              ? "Moderate risk, some incidents reported"
              : "Higher risk area, caution advised"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RouteCard;
