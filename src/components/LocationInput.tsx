import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  icon?: "origin" | "destination";
}

const LocationInput = ({
  value,
  onChange,
  onClear,
  placeholder,
  icon = "origin",
}: LocationInputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <MapPin
          className={`w-5 h-5 ${
            icon === "origin" ? "text-primary" : "text-safe"
          }`}
        />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 pr-10 h-12 text-base"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default LocationInput;
