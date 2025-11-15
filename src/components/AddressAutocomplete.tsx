import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressResult {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  place_type: string[];
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectPlace?: (place: { name: string; coordinates: [number, number] }) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  mapboxToken?: string;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  onSelectPlace,
  placeholder = 'Enter address...',
  icon,
  mapboxToken,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value || value.length < 3 || !mapboxToken) {
      setSuggestions([]);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the API call
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?access_token=${mapboxToken}&proximity=-74.006,40.7128&bbox=-74.25909,40.477399,-73.700272,40.917577&country=US&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Geocoding error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, mapboxToken]);

  const handleSelectPlace = (place: AddressResult) => {
    onChange(place.place_name);
    setShowSuggestions(false);
    if (onSelectPlace) {
      onSelectPlace({
        name: place.place_name,
        coordinates: place.center,
      });
    }
  };

  const getPlaceIcon = (placeType: string[]) => {
    if (placeType.includes('address')) return '🏠';
    if (placeType.includes('poi')) return '📍';
    if (placeType.includes('place')) return '🏙️';
    if (placeType.includes('neighborhood')) return '🏘️';
    if (placeType.includes('locality')) return '🌆';
    return '📌';
  };

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn(icon && 'pl-9')}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandEmpty>No places found.</CommandEmpty>
              <CommandGroup>
                {suggestions.map((place) => (
                  <CommandItem
                    key={place.id}
                    onSelect={() => handleSelectPlace(place)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{getPlaceIcon(place.place_type)}</span>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate">{place.place_name}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
