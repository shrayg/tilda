import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SafetyMap } from '@/components/SafetyMap';
import { RouteComparison } from '@/components/RouteComparison';
import { DangerPinForm } from '@/components/DangerPinForm';
import { DataLayerToggle } from '@/components/DataLayerToggle';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Navigation, 
  MapPin, 
  Menu,
  X,
  Search,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>(undefined);
  const [showPinForm, setShowPinForm] = useState(false);
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startAddress, setStartAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [generatedRoutes, setGeneratedRoutes] = useState<any[]>([]);
  
  const [routePolylines, setRoutePolylines] = useState<any[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w';

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  // Helper function to calculate events near a route
  const calculateRouteEvents = (routeGeometry: any, allEvents: any[]) => {
    if (!routeGeometry?.coordinates) return { crashes: 0, crime: 0, weather: 0, speeding: 0, construction: 0, total: 0 };
    
    const eventCounts = { crashes: 0, crime: 0, weather: 0, speeding: 0, construction: 0 };
    const bufferDistance = 0.003; // Approximately 300 meters in degrees
    
    // Check each event against route coordinates
    allEvents.forEach(event => {
      const isNearRoute = routeGeometry.coordinates.some((coord: number[]) => {
        const [routeLng, routeLat] = coord;
        const distance = Math.sqrt(
          Math.pow(routeLat - event.lat, 2) + Math.pow(routeLng - event.lng, 2)
        );
        return distance < bufferDistance;
      });
      
      if (isNearRoute && eventCounts.hasOwnProperty(event.layer)) {
        eventCounts[event.layer as keyof typeof eventCounts]++;
      }
    });
    
    const total = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);
    return { ...eventCounts, total };
  };
  
  // Calculate safety score based on real events
  const calculateSafetyScore = (events: any) => {
    // Weight different event types
    const weights = {
      crashes: 3.0,    // Most dangerous
      crime: 2.5,
      speeding: 1.5,
      construction: 1.0,
      weather: 0.5     // Least dangerous
    };
    
    const weightedTotal = 
      events.crashes * weights.crashes +
      events.crime * weights.crime +
      events.speeding * weights.speeding +
      events.construction * weights.construction +
      events.weather * weights.weather;
    
    // Calculate score (10 is safest, 0 is most dangerous)
    // Normalize based on expected event counts
    const maxExpectedWeighted = 50; // Adjust this threshold as needed
    const score = Math.max(0, 10 - (weightedTotal / maxExpectedWeighted) * 10);
    
    return Math.round(score * 10) / 10; // Round to 1 decimal
  };

  const [dataLayers, setDataLayers] = useState([
    { id: 'crashes', name: 'Crashes', icon: null, color: '', count: 0, enabled: true },
    { id: 'crime', name: 'Crime', icon: null, color: '', count: 0, enabled: true },
    { id: 'speeding', name: 'Speeding', icon: null, color: '', count: 0, enabled: true },
    { id: 'construction', name: 'Construction', icon: null, color: '', count: 0, enabled: true },
    { id: 'weather', name: 'Weather & Flood Risk', icon: null, color: '', count: 0, enabled: true },
  ]);

  // Fetch dynamic counts for data layers
  useEffect(() => {
    const fetchLayerCounts = async () => {
      const { data: events } = await supabase
        .from('official_events')
        .select('layer')
        .eq('is_active', true)
        .range(0, 9999); // Fetch up to 10,000 records
      
      if (events) {
        const counts = events.reduce((acc: any, event) => {
          acc[event.layer] = (acc[event.layer] || 0) + 1;
          return acc;
        }, {});
        
        setDataLayers(prev => prev.map(layer => ({
          ...layer,
          count: counts[layer.id] || 0
        })));
      }
    };
    
    fetchLayerCounts();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('layer_counts_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'official_events' 
      }, fetchLayerCounts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setPinLocation({ lat, lng });
    setShowPinForm(true);
  };

  const handlePinSubmit = (data: any) => {
    console.log('Pin submitted:', data);
    toast.success('Danger report submitted successfully!');
    setShowPinForm(false);
    setPinLocation(null);
  };

  const handleLayerToggle = (layerId: string) => {
    setDataLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const handleStartSelect = (place: { name: string; coordinates: [number, number] }) => {
    setStartCoords(place.coordinates);
    console.log('Start location selected:', place);
  };

  const handleDestSelect = (place: { name: string; coordinates: [number, number] }) => {
    setDestCoords(place.coordinates);
    console.log('Destination selected:', place);
  };

  const handleFindRoutes = async () => {
    if (!startCoords || !destCoords) {
      toast.error('Please select both start and destination locations');
      return;
    }
    
    console.log('Finding routes from:', startCoords, 'to:', destCoords);
    toast.info('Analyzing routes with safety data from Supabase...');
    
    try {
      // Fetch ALL events from Supabase (up to 10,000)
      const { data: allEvents, error: eventsError } = await supabase
        .from('official_events')
        .select('*')
        .eq('is_active', true)
        .range(0, 9999);
      
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        toast.error('Failed to fetch safety data');
        return;
      }

      console.log(`Loaded ${allEvents?.length || 0} events from Supabase`);

      // Fetch route alternatives from Mapbox (up to 3 alternatives when true)
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${destCoords[0]},${destCoords[1]}?alternatives=true&geometries=geojson&steps=true&access_token=${mapboxToken}`;
      
      console.log('Fetching routes from Mapbox (up to 4 total)...');
      const response = await fetch(directionsUrl);
      const data = await response.json();

      console.log('Mapbox response:', data);

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${data.message || response.statusText}`);
      }

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No routes found between these locations');
      }

      // Process all routes (Mapbox returns up to requested alternatives)
      const routesToUse = data.routes;
      console.log(`Processing ${routesToUse.length} routes from Mapbox`);
      
      // Calculate real safety data for each route using helper functions
      const routes = routesToUse.map((route: any, index: number) => {
        const routeEvents = calculateRouteEvents(route.geometry, allEvents || []);
        const safetyScore = calculateSafetyScore(routeEvents);
        
        return {
          id: `route${index + 1}`,
          name: `Route ${String.fromCharCode(65 + index)}`,
          duration: Math.round(route.duration / 60),
          distance: parseFloat((route.distance / 1609.34).toFixed(1)),
          safetyScore: safetyScore,
          crashes: routeEvents.crashes,
          crimes: routeEvents.crime,
          weather: routeEvents.weather,
          speeding: routeEvents.speeding,
          construction: routeEvents.construction,
          type: safetyScore >= 7 ? 'safest' : safetyScore >= 5 ? 'balanced' : 'fastest',
          geometry: route.geometry,
        };
      });

      // Sort by safety score (safest first)
      const sortedRoutes = routes.sort((a, b) => b.safetyScore - a.safetyScore);

      console.log('Generated routes with real Supabase data:', sortedRoutes);
      setGeneratedRoutes(sortedRoutes);
      setRoutePolylines(sortedRoutes.map(r => r.geometry));
      setSelectedRoute(sortedRoutes[0].id);
      
      toast.success(`Found ${sortedRoutes.length} routes analyzed with ${allEvents?.length} real events`);
    } catch (error: any) {
      console.error('Error finding routes:', error);
      toast.error(`Failed to fetch routes: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-96' : 'w-0'
        } transition-all duration-300 overflow-hidden border-r glass`}
      >
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-primary leading-none">~</div>
              <div>
                <h1 className="text-xl font-bold">tilda</h1>
                <p className="text-xs text-muted-foreground italic">Not all routes are a straight line</p>
                {user && <p className="text-xs text-muted-foreground/60">{user.email}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="p-4 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Location</label>
              <AddressAutocomplete
                value={startAddress}
                onChange={setStartAddress}
                onSelectPlace={handleStartSelect}
                placeholder="Enter start address..."
                icon={<Search className="w-4 h-4" />}
                mapboxToken={mapboxToken}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <AddressAutocomplete
                value={destinationAddress}
                onChange={setDestinationAddress}
                onSelectPlace={handleDestSelect}
                placeholder="Enter destination..."
                icon={<Navigation className="w-4 h-4" />}
                mapboxToken={mapboxToken}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleFindRoutes}
              disabled={!startCoords || !destCoords}
            >
              Find Safest Routes
            </Button>
          </Card>

          {/* Routes - Only show after generation */}
          {generatedRoutes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Available Routes</h2>
                <span className="text-xs text-muted-foreground">{generatedRoutes.length} options</span>
              </div>
              <RouteComparison
                routes={generatedRoutes}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
              />
            </div>
          )}

          {/* Data Layers */}
          <DataLayerToggle 
            layers={dataLayers} 
            onToggle={handleLayerToggle}
          />

          {/* Report Danger */}
          {showPinForm && pinLocation ? (
            <DangerPinForm
              latitude={pinLocation.lat}
              longitude={pinLocation.lng}
              onSubmit={handlePinSubmit}
              onCancel={() => {
                setShowPinForm(false);
                setPinLocation(null);
              }}
            />
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowPinForm(true);
                toast.info('Click on the map to report a danger', {
                  description: 'Your cursor will change to a pin'
                });
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Report a Danger
            </Button>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Mobile Menu Toggle */}
        {!sidebarOpen && (
          <Button
            className="absolute top-4 left-4 z-10"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Map */}
        <SafetyMap 
          onLocationSelect={handleLocationSelect}
          routePolylines={routePolylines}
          selectedRoute={selectedRoute}
          routes={generatedRoutes}
          startCoords={startCoords}
          destCoords={destCoords}
          enabledLayers={dataLayers.filter(l => l.enabled).map(l => l.id)}
          isReportMode={showPinForm && !pinLocation}
        />
      </div>
    </div>
  );
};

export default Index;
