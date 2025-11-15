import { Slider } from "@/components/ui/slider";
import { Zap, Shield } from "lucide-react";

interface SafetySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const SafetySlider = ({ value, onChange }: SafetySliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span>Fastest</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Safest</span>
          <Shield className="w-4 h-4 text-safe" />
        </div>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={100}
        step={1}
        className="w-full"
      />
      
      <div className="text-center text-xs text-muted-foreground">
        {value < 33
          ? "Prioritizing speed"
          : value < 67
          ? "Balanced approach"
          : "Prioritizing safety"}
      </div>
    </div>
  );
};

export default SafetySlider;
