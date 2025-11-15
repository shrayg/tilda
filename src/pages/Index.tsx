import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Location, RouteData, TravelMode } from "@/types/route";
import { fetchRoutes } from "@/services/apiRoutes";
import MapView from "@/components/MapContainer";
import RouteCard from "@/components/RouteCard";
import SafetySlider from "@/components/SafetySlider";
import ModeToggle from "@/components/ModeToggle";
import LocationInput from "@/components/LocationInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertCircle, Info, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";


const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // 🔑 MANUALLY SET TOKEN: Replace empty string with your token: "pk.eyJ1..."
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };
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
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch routes from backend when locations or preferences change
  useEffect(() => {
    if (origin && destination && mapboxToken) {
      setIsLoading(true);
      setRoutes([]);
      setSelectedRoute(null);

      fetchRoutes({
        origin,
        destination,
        mode,
        safetyPreference,
      })
        .then((newRoutes) => {
          setRoutes(newRoutes);
          if (newRoutes.length > 0) {
            setSelectedRoute(newRoutes[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching routes:", error);
          toast({
            title: "Error fetching routes",
            description: error.message || "Failed to fetch routes from backend. Please check your backend connection.",
            variant: "destructive",
          });
          setRoutes([]);
          setSelectedRoute(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Clear routes if locations are missing
      setRoutes([]);
      setSelectedRoute(null);
      setIsLoading(false);
    }
  }, [origin, destination, mode, safetyPreference, mapboxToken, toast]);

  const handleMapClick = (lng: number, lat: number) => {
    if (!origin) {
      setOrigin({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      setOriginInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } else if (!destination) {
      setDestination({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      setDestinationInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-96 bg-card border-r border-border overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SafeRoute</h1>
                <p className="text-sm text-muted-foreground">
                  Navigate with confidence
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
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
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Fetching routes...
              </span>
            </div>
          )}
          
          {!isLoading && routes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                Available Routes ({routes.length})
              </h2>
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

          {!isLoading && routes.length === 0 && origin && destination && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                No routes found. Check your backend connection or try different locations.
              </AlertDescription>
            </Alert>
          )}

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
