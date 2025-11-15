export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export type TravelMode = 'driving' | 'walking';

export interface RouteRequest {
  origin: Location;
  destination: Location;
  mode: TravelMode;
  safetyPreference: number; // 0 (fastest) to 100 (safest)
}

export interface RouteRatings {
  crime: number; // 0-10 scale, lower is safer
  speeding: number;
  crash: number;
  construction: number;
  floodRisk: number;
}

export interface RouteData {
  id: string;
  name: string;
  duration: number; // minutes
  distance: number; // km
  safetyScore: number; // 0-10 scale, higher is safer
  preference: 'fastest' | 'balanced' | 'safest';
  coordinates: [number, number][]; // [lng, lat] pairs
  ratings: RouteRatings;
}

export type PinCategory = 
  | 'Traffic Hazard'
  | 'Crime Risk'
  | 'Infrastructure Hazard'
  | 'Environmental Hazard'
  | 'Other';

export interface Bounds {
  min_lat: number;
  min_lng: number;
  max_lat: number;
  max_lng: number;
}

