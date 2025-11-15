import { Slider } from './ui/slider';
import { Zap, Shield } from 'lucide-react';

interface SafetySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const SafetySlider = ({ value, onChange }: SafetySliderProps) => {
  const getLabel = (val: number) => {
    if (val <= 20) return 'Fastest';
    if (val <= 40) return 'Fast';
    if (val <= 60) return 'Balanced';
    if (val <= 80) return 'Safer';
    return 'Safest';
  };

  return (
    <div className="space-y-3 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-info" />
          <span className="text-sm font-medium">Route Preference</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{getLabel(value)}</span>
          <Shield className="w-4 h-4 text-safe" />
        </div>
      </div>

      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={100}
          step={1}
          className="cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>Speed Priority</span>
        <span>Safety Priority</span>
      </div>
    </div>
  );
};
