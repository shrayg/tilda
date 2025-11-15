import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Car, PersonStanding } from "lucide-react";
import { TravelMode } from "@/types/route";

interface ModeToggleProps {
  mode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Travel Mode</label>
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value) onModeChange(value as TravelMode);
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="driving" aria-label="Driving" className="gap-2">
          <Car className="w-4 h-4" />
          Driving
        </ToggleGroupItem>
        <ToggleGroupItem value="walking" aria-label="Walking" className="gap-2">
          <PersonStanding className="w-4 h-4" />
          Walking
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ModeToggle;
