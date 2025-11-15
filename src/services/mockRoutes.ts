import { RouteData, RouteRequest } from "@/types/route";

// Mock data for demonstration - replace with actual API calls later
export const getMockRoutes = (request: RouteRequest): RouteData[] => {
  // These are example routes for NYC (Times Square to Central Park)
  // In production, this will call your Flask/FastAPI backend
  
  const baseRoute = {
    origin: request.origin,
    destination: request.destination,
  };

  // Generate slightly different paths for demonstration
  const routeA: RouteData = {
    id: "route-a",
    name: "Route A",
    duration: 12,
    distance: 3.2,
    safetyScore: 4.1,
    preference: "fastest",
    coordinates: generateMockPath(request.origin, request.destination, 0.98),
    ratings: {
      crime: 6.2,
      speeding: 7.5,
      crash: 5.8,
      construction: 2.1,
      floodRisk: 1.0,
    },
  };

  const routeB: RouteData = {
    id: "route-b",
    name: "Route B",
    duration: 14,
    distance: 3.8,
    safetyScore: 8.3,
    preference: "safest",
    coordinates: generateMockPath(request.origin, request.destination, 1.15),
    ratings: {
      crime: 2.1,
      speeding: 1.8,
      crash: 1.5,
      construction: 3.2,
      floodRisk: 0.5,
    },
  };

  const routeC: RouteData = {
    id: "route-c",
    name: "Route C",
    duration: 13,
    distance: 3.5,
    safetyScore: 6.7,
    preference: "balanced",
    coordinates: generateMockPath(request.origin, request.destination, 1.05),
    ratings: {
      crime: 4.2,
      speeding: 4.8,
      crash: 3.9,
      construction: 2.5,
      floodRisk: 0.8,
    },
  };

  return [routeA, routeB, routeC];
};

// Helper to generate a simple curved path between two points
function generateMockPath(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  curveFactor: number
): [number, number][] {
  const points: [number, number][] = [];
  const steps = 20;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    
    // Linear interpolation with slight curve
    const lat = origin.lat + (destination.lat - origin.lat) * t;
    const lng = origin.lng + (destination.lng - origin.lng) * t;
    
    // Add some curve variation based on curveFactor
    const curve = Math.sin(t * Math.PI) * 0.002 * curveFactor;
    
    points.push([lng, lat + curve]);
  }

  return points;
}

// TODO: Replace with actual API integration
// Example API call structure:
/*
export const fetchRoutes = async (request: RouteRequest): Promise<RouteData[]> => {
  const response = await fetch('http://your-backend-url/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch routes');
  }
  
  return response.json();
};
*/
