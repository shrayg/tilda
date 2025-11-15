import { useState, useEffect } from "react";
import { Location, RouteData, TravelMode } from "@/types/route";
import { getMockRoutes } from "@/services/mockRoutes";
import MapView from "@/components/MapContainer";
import RouteCard from "@/components/RouteCard";
import SafetySlider from "@/components/SafetySlider";
import ModeToggle from "@/components/ModeToggle";
import LocationInput from "@/components/LocationInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const { toast } = useToast();
  // 🔑 MANUALLY SET TOKEN: Replace empty string with your token: "pk.eyJ1..."
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(!!mapboxToken ? false : true);
  
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  
  const [mode, setMode] = useState<TravelMode>("driving");
  const [safetyPreference, setSafetyPreference] = useState(50);
  
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

  // For demo: set default NYC locations
  useEffect(() => {
    const defaultOrigin = {
      lat: 40.758896,
      lng: -73.985428,
      address: "Times Square, NYC",
    };
    const defaultDestination = {
      lat: 40.785091,
      lng: -73.968285,
      address: "Central Park, NYC",
    };

    setOrigin(defaultOrigin);
    setDestination(defaultDestination);
    setOriginInput(defaultOrigin.address);
    setDestinationInput(defaultDestination.address);
  }, []);

  // Generate routes when locations or preferences change
  useEffect(() => {
    if (origin && destination && mapboxToken) {
      const newRoutes = getMockRoutes({
        origin,
        destination,
        mode,
        safetyPreference,
      });
      setRoutes(newRoutes);
      setSelectedRoute(newRoutes[0]);
    } else {
      // Clear routes if locations are missing
      setRoutes([]);
      setSelectedRoute(null);
    }
  }, [origin, destination, mode, safetyPreference, mapboxToken]);

  const handleMapClick = (lng: number, lat: number) => {
    if (!origin) {
      setOrigin({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      setOriginInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } else if (!destination) {
      setDestination({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      setDestinationInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      toast({
        title: "Mapbox token added",
        description: "You can now use the map features",
      });
    }
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">SafeRoute</h1>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This app uses Mapbox for mapping. Get your free access token at{" "}
              <a
                href="https://www.mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                mapbox.com
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mapbox Access Token</label>
            <Input
              type="password"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1..."
              onKeyDown={(e) => e.key === "Enter" && handleTokenSubmit()}
            />
          </div>

          <Button onClick={handleTokenSubmit} className="w-full" size="lg">
            Continue
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your token is stored locally and never sent to our servers
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-96 bg-card border-r border-border overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">SafeRoute</h1>
              <p className="text-sm text-muted-foreground">
                Navigate with confidence
              </p>
            </div>
          </div>

          {/* Location Inputs */}
          <div className="space-y-3">
            <LocationInput
              value={originInput}
              onChange={setOriginInput}
              onClear={() => {
                setOriginInput("");
                setOrigin(null);
              }}
              placeholder="Enter origin (or click map)"
              icon="origin"
            />
            <LocationInput
              value={destinationInput}
              onChange={setDestinationInput}
              onClear={() => {
                setDestinationInput("");
                setDestination(null);
              }}
              placeholder="Enter destination (or click map)"
              icon="destination"
            />
          </div>

          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={setMode} />

          {/* Safety Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Route Preference</label>
            <Card className="p-4">
              <SafetySlider
                value={safetyPreference}
                onChange={setSafetyPreference}
              />
            </Card>
          </div>

          {/* Routes */}
          {routes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Available Routes</h2>
              {routes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isSelected={selectedRoute?.id === route.id}
                  onClick={() => setSelectedRoute(route)}
                />
              ))}
            </div>
          )}

          {/* Backend Integration Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Demo Mode:</strong> Currently showing mock data. Connect
              your Flask/FastAPI backend to see real routes with crash and crime
              data.
            </AlertDescription>
          </Alert>
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        <MapView
          origin={origin}
          destination={destination}
          routes={routes}
          selectedRoute={selectedRoute}
          onMapClick={handleMapClick}
          mapboxToken={mapboxToken}
        />
      </main>
    </div>
  );
};

export default Index;
