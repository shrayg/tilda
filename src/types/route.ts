export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface RouteData {
  id: string;
  name: string;
  duration: number; // in minutes
  distance: number; // in km
  safetyScore: number; // 0-10 scale
  coordinates: [number, number][]; // [lng, lat] pairs for Mapbox
  preference: "fastest" | "balanced" | "safest";
}

export type TravelMode = "driving" | "walking";

export interface RouteRequest {
  origin: Location;
  destination: Location;
  mode: TravelMode;
  safetyPreference: number; // 0 (fastest) to 100 (safest)
}
