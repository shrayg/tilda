export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface RouteRatings {
  crime: number; // 0-10 scale, lower is safer
  speeding: number; // 0-10 scale, lower is safer
  crash: number; // 0-10 scale, lower is safer
  construction: number; // 0-10 scale, lower is safer
  floodRisk: number; // 0-10 scale, lower is safer
}

export interface RouteData {
  id: string;
  name: string;
  duration: number; // in minutes
  distance: number; // in km
  safetyScore: number; // 0-10 scale, higher is safer (overall)
  coordinates: [number, number][]; // [lng, lat] pairs for Mapbox
  preference: "fastest" | "balanced" | "safest";
  ratings: RouteRatings; // Detailed ratings for each risk factor
}

export type TravelMode = "driving" | "walking";

export interface RouteRequest {
  origin: Location;
  destination: Location;
  mode: TravelMode;
  safetyPreference: number; // 0 (fastest) to 100 (safest)
}
