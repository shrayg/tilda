import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SafetyMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  routePolylines?: any[];
  selectedRoute?: string;
  routes?: any[];
  startCoords?: [number, number] | null;
  destCoords?: [number, number] | null;
  enabledLayers?: string[];
  isReportMode?: boolean;
}

export const SafetyMap = ({ 
  onLocationSelect, 
  routePolylines = [], 
  selectedRoute,
  routes = [],
  startCoords,
  destCoords,
  enabledLayers = [],
  isReportMode = false
}: SafetyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const startMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w';
  
  const routeColors = [
    '#FF6B9D', // coral pink
    '#FFA07A', // light salmon
    '#FFB6C1', // light pink
    '#FF9AA2', // peachy pink
    '#FFB3BA', // soft coral
    '#C9A0DC', // light purple
    '#87CEEB'  // sky blue
  ];

  // Fetch real events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      // Fetch all events - use range to override default 1000 record limit
      const { data, error } = await supabase
        .from('official_events')
        .select('*')
        .eq('is_active', true)
        .range(0, 9999); // Fetch up to 10,000 records
      
      if (error) {
        console.error('Error fetching events:', error);
        return;
      }
      
      if (data) {
        console.log(`Loaded ${data.length} total events from database`);
        const layerCounts = data.reduce((acc: any, e) => {
          acc[e.layer] = (acc[e.layer] || 0) + 1;
          return acc;
        }, {});
        console.log('Events by layer:', layerCounts);
        setEvents(data);
      }
    };

    fetchEvents();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('official_events_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'official_events' 
      }, fetchEvents)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-73.9712, 40.7831], // Manhattan center coordinates
      zoom: 12,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add click handler
    map.current.on('click', (e) => {
      if (onLocationSelect) {
        onLocationSelect(e.lngLat.lat, e.lngLat.lng);
      }
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add clustered source for events
      map.current.addSource('events-clustered', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster circles
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'events-clustered',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#FFA07A',
            10,
            '#FF6B6B',
            30,
            '#EE5A6F'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10,
            20,
            30,
            25
          ],
          'circle-opacity': 0.5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-stroke-opacity': 0.5
        }
      });

      // Cluster count labels
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'events-clustered',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [MAPBOX_TOKEN, onLocationSelect]);

  // Update event markers - only after map is loaded with viewport culling
  useEffect(() => {
    if (!map.current || !mapLoaded || events.length === 0) return;

    // Filter events based on enabled layers
    const filteredEvents = events.filter(event => enabledLayers.includes(event.layer));
    
    // Update clustered source with all filtered events
    const geojsonData = {
      type: 'FeatureCollection',
      features: filteredEvents.map(event => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.lng, event.lat]
        },
        properties: {
          severity: event.severity || 1,
          title: event.title,
          description: event.description,
          layer: event.layer
        }
      }))
    };

    const clusterSource = map.current?.getSource('events-clustered') as mapboxgl.GeoJSONSource;
    if (clusterSource) {
      clusterSource.setData(geojsonData as any);
    }
    
    // Function to update markers based on viewport
    let updateTimeout: NodeJS.Timeout;
    const updateMarkersInViewport = () => {
      if (!map.current) return;
      
      // Clear existing timeout
      if (updateTimeout) clearTimeout(updateTimeout);
      
      // Debounce updates
      updateTimeout = setTimeout(() => {
        if (!map.current) return;
        
        // Get current map bounds
        const bounds = map.current.getBounds();
        const zoom = map.current.getZoom();
        
        // Remove all existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Only render markers when zoomed in enough (zoom > 14)
        if (zoom <= 14) return;
        
        // Filter events within viewport bounds with padding
        const padding = 0.1; // 10% padding
        const swLng = bounds.getWest() - padding;
        const swLat = bounds.getSouth() - padding;
        const neLng = bounds.getEast() + padding;
        const neLat = bounds.getNorth() + padding;
        
        const visibleEvents = filteredEvents.filter(event => {
          return event.lng >= swLng && 
                 event.lng <= neLng && 
                 event.lat >= swLat && 
                 event.lat <= neLat;
        });
        
        // Limit number of markers for performance
        const maxMarkers = 200;
        const eventsToRender = visibleEvents.slice(0, maxMarkers);
        
        // Render markers in batches using requestAnimationFrame
        const batchSize = 20;
        let currentIndex = 0;
        
        const renderBatch = () => {
          const endIndex = Math.min(currentIndex + batchSize, eventsToRender.length);
          
          for (let i = currentIndex; i < endIndex; i++) {
            const event = eventsToRender[i];
            if (!map.current) return;

            // Create icon element based on layer type with liquid glass effect
            const el = document.createElement('div');
            el.className = 'event-marker-icon';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.width = '28px';
            el.style.height = '28px';
            el.style.borderRadius = '50%';
            el.style.cursor = 'default';
            el.style.pointerEvents = 'none'; // Make icons non-clickable
            el.style.backdropFilter = 'blur(8px)';
            el.style.border = '1px solid rgba(255, 255, 255, 0.18)';
            el.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            el.style.transition = 'all 0.3s ease';
            
            // Color and icon based on layer type with transparency
            let iconSvg = '';
            if (event.layer === 'crashes') {
              el.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(239, 68, 68, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';
            } else if (event.layer === 'crime') {
              el.style.backgroundColor = 'rgba(245, 158, 11, 0.25)';
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(245, 158, 11, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>';
            } else if (event.layer === 'weather') {
              el.style.backgroundColor = 'rgba(59, 130, 246, 0.25)';
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(59, 130, 246, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
            } else if (event.layer === 'speeding') {
              el.style.backgroundColor = 'rgba(251, 146, 60, 0.25)';
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(251, 146, 60, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
            } else if (event.layer === 'construction') {
              el.style.backgroundColor = 'rgba(6, 182, 212, 0.25)';
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(6, 182, 212, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M7 2v20"/></svg>';
            } else {
              el.style.backgroundColor = 'rgba(139, 92, 246, 0.25)';
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 92, 246, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
            }
            
            el.innerHTML = iconSvg;
            
            // Markers are non-interactive, no hover effects or popups

            // Create marker without popup and non-interactive
            // pointer-events: none makes it completely non-clickable
            const marker = new mapboxgl.Marker(el)
              .setLngLat([event.lng, event.lat])
              .addTo(map.current);

            markersRef.current.push(marker);
          }
          
          currentIndex = endIndex;
          
          // Continue rendering if there are more events
          if (currentIndex < eventsToRender.length) {
            requestAnimationFrame(renderBatch);
          }
        };
        
        // Start rendering batches
        requestAnimationFrame(renderBatch);
      }, 150); // 150ms debounce
    };
    
    // Initial update
    updateMarkersInViewport();
    
    // Listen to map move and zoom events with debouncing
    map.current.on('moveend', updateMarkersInViewport);
    map.current.on('zoomend', updateMarkersInViewport);
    
    return () => {
      if (updateTimeout) clearTimeout(updateTimeout);
      map.current?.off('moveend', updateMarkersInViewport);
      map.current?.off('zoomend', updateMarkersInViewport);
    };
  }, [events, mapLoaded, enabledLayers]);

  // Update route polylines - SIMPLIFIED APPROACH
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    console.log('🗺️ Route rendering:', { 
      routeCount: routePolylines.length, 
      selectedRoute,
      mapReady: map.current.isStyleLoaded()
    });
    
    // Clear existing routes
    for (let i = 0; i < 10; i++) {
      try {
        if (map.current.getLayer(`route-line-${i}`)) map.current.removeLayer(`route-line-${i}`);
        if (map.current.getSource(`route-source-${i}`)) map.current.removeSource(`route-source-${i}`);
      } catch (e) {}
    }

    if (routePolylines.length === 0) return;

    // Add routes directly with simple approach
    routePolylines.forEach((geometry, index) => {
      try {
        const routeId = `route${index + 1}`;
        const isSelected = selectedRoute === routeId;
        const color = routeColors[index % routeColors.length];
        
        // Create GeoJSON for the route
        const geojson = {
          type: 'Feature' as const,
          properties: {},
          geometry: geometry
        };

        console.log(`📍 Adding route ${index}:`, { 
          routeId, 
          isSelected, 
          color,
          coords: geometry?.coordinates?.length || 0
        });

        // Add source
        map.current!.addSource(`route-source-${index}`, {
          type: 'geojson',
          data: geojson as any
        });

        // Add layer - placed below marker layers
        map.current!.addLayer({
          id: `route-line-${index}`,
          type: 'line',
          source: `route-source-${index}`,
          paint: {
            'line-color': color,
            'line-width': isSelected ? 8 : 5,
            'line-opacity': isSelected ? 1 : 0.7,
            'line-blur': 0.5
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          }
        }, 'waterway-label'); // Add at a lower z-index
        
        console.log(`✅ Route ${index} added successfully`);
      } catch (error) {
        console.error(`❌ Failed to add route ${index}:`, error);
      }
    });

    // Fit bounds to show routes
    if (startCoords && destCoords) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(startCoords);
        bounds.extend(destCoords);
        
        // Add padding for better view
        routePolylines.forEach(geometry => {
          if (geometry?.coordinates) {
            geometry.coordinates.slice(0, 10).forEach((coord: number[]) => {
              bounds.extend(coord as [number, number]);
            });
          }
        });
        
        map.current!.fitBounds(bounds, { 
          padding: 100,
          duration: 1000,
          maxZoom: 14
        });
      } catch (e) {
        console.warn('Bounds fitting failed:', e);
      }
    }
  }, [routePolylines, selectedRoute, startCoords, destCoords, mapLoaded]);

  // Add start/destination markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }

    if (startCoords) {
      startMarkerRef.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(startCoords)
        .addTo(map.current);
    }

    if (destCoords) {
      destMarkerRef.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(destCoords)
        .addTo(map.current);
    }
  }, [startCoords, destCoords, mapLoaded]);


  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg overflow-hidden" 
        style={{ cursor: isReportMode ? 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOUM1IDEzLjE3IDEyIDIyIDEyIDIyQzEyIDIyIDE5IDEzLjE3IDE5IDlDMTkgNS4xMyAxNS44NyAyIDEyIDJaTTEyIDExLjVDMTAuNjIgMTEuNSA5LjUgMTAuMzggOS41IDlDOS41IDcuNjIgMTAuNjIgNi41IDEyIDYuNUMxMy4zOCA2LjUgMTQuNSA3LjYyIDE0LjUgOUMxNC41IDEwLjM4IDEzLjM4IDExLjUgMTIgMTEuNVoiIGZpbGw9IiNlZjQ0NDQiLz48L3N2Zz4=") 12 24, crosshair' : 'default' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};
