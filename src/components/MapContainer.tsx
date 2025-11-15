import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Location, RouteData } from "@/types/route";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapViewProps {
  origin: Location | null;
  destination: Location | null;
  routes: RouteData[];
  selectedRoute: RouteData | null;
  onMapClick: (lng: number, lat: number) => void;
  mapboxToken: string;
}

const MapView = ({
  origin,
  destination,
  routes,
  selectedRoute,
  onMapClick,
  mapboxToken,
}: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.985428, 40.758896],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add click handler
    map.current.on("click", (e) => {
      onMapClick(e.lngLat.lng, e.lngLat.lat);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    // Wait for map to be loaded before adding markers
    const updateMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add origin marker
      if (origin) {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.innerHTML = `
          <div class="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;
        
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([origin.lng, origin.lat])
          .addTo(mapInstance);
        
        markersRef.current.push(marker);
      }

      // Add destination marker
      if (destination) {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.innerHTML = `
          <div class="bg-safe text-safe-foreground p-2 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;
        
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([destination.lng, destination.lat])
          .addTo(mapInstance);
        
        markersRef.current.push(marker);
      }

      // Fit bounds if both markers exist
      if (origin && destination) {
        const bounds = new mapboxgl.LngLatBounds()
          .extend([origin.lng, origin.lat])
          .extend([destination.lng, destination.lat]);
        
        mapInstance.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
          duration: 1000,
        });
      }
    };

    if (mapInstance.isStyleLoaded()) {
      updateMarkers();
    } else {
      mapInstance.once("load", updateMarkers);
    }
  }, [origin, destination]);

  // Update routes
  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    // Wait for map to be loaded
    const updateRoutes = () => {
      // Remove existing route layers and sources
      routes.forEach((route) => {
        if (mapInstance.getLayer(`${route.id}-line`)) {
          mapInstance.removeLayer(`${route.id}-line`);
        }
        if (mapInstance.getSource(route.id)) {
          mapInstance.removeSource(route.id);
        }
      });

      // Add route layers
      routes.forEach((route) => {
        const isSelected = selectedRoute?.id === route.id;
        
        let color = "#94a3b8"; // muted gray for unselected
        if (isSelected) {
          if (route.safetyScore >= 7) color = "#10b981"; // safe green
          else if (route.safetyScore >= 4) color = "#f59e0b"; // warning yellow
          else color = "#ef4444"; // danger red
        }

        mapInstance.addSource(route.id, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route.coordinates,
            },
          },
        });

        mapInstance.addLayer({
          id: `${route.id}-line`,
          type: "line",
          source: route.id,
          paint: {
            "line-color": color,
            "line-width": isSelected ? 5 : 3,
            "line-opacity": isSelected ? 0.9 : 0.4,
          },
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
        });
      });
    };

    if (mapInstance.isStyleLoaded()) {
      updateRoutes();
    } else {
      mapInstance.on("load", updateRoutes);
    }

    return () => {
      // Cleanup will happen when routes change
    };
  }, [routes, selectedRoute]);

  return (
    <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
  );
};

export default MapView;
