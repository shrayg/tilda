import axios from 'axios';
import { getDistance } from 'geolib';
import { RouteRequest, RouteData, RouteRatings } from '@/types/route';
import { dataService, Bounds, CrashData, CrimeData, ConstructionData, SpeedingData } from './dataService';

function sampleRoutePoints(coordinates: [number, number][], maxPoints: number = 50): [number, number][] {
  if (coordinates.length <= maxPoints) {
    return coordinates;
  }

  const step = coordinates.length / maxPoints;
  const sampled: [number, number][] = [];
  
  for (let i = 0; i < maxPoints; i++) {
    const idx = Math.floor(i * step);
    sampled.push(coordinates[idx]);
  }
  
  return sampled;
}

function rateCrime(points: [number, number][], crimes: CrimeData[]): number {
  if (!crimes.length) return 5.0;

  let crimeCount = 0;
  for (const point of points) {
    for (const crime of crimes) {
      const distance = getDistance(
        { latitude: point[1], longitude: point[0] },
        { latitude: crime.lat, longitude: crime.lng }
      );
      
      if (distance < 100) {
        const weight = crime.level === 'FELONY' ? 3.0 : crime.level === 'MISDEMEANOR' ? 1.5 : 0.5;
        crimeCount += weight;
      }
    }
  }

  return Math.min((crimeCount / points.length) * 2, 10.0);
}

function rateSpeeding(points: [number, number][], speeding: SpeedingData[]): number {
  if (!speeding.length) return 5.0;

  let speedingCount = 0;
  for (const point of points) {
    for (const speedLoc of speeding) {
      const distance = getDistance(
        { latitude: point[1], longitude: point[0] },
        { latitude: speedLoc.lat, longitude: speedLoc.lng }
      );
      
      if (distance < 200) {
        const violations = speedLoc.violations || 0;
        speedingCount += Math.min(violations / 100, 1.0);
      }
    }
  }

  return Math.min((speedingCount / points.length) * 5, 10.0);
}

function rateCrashes(points: [number, number][], crashes: CrashData[]): number {
  if (!crashes.length) return 5.0;

  let crashScore = 0;
  for (const point of points) {
    for (const crash of crashes) {
      const distance = getDistance(
        { latitude: point[1], longitude: point[0] },
        { latitude: crash.lat, longitude: crash.lng }
      );
      
      if (distance < 50) {
        const weight = 5.0 * crash.fatalities + 2.0 * crash.injuries + 0.5 * crash.vehicle_count;
        crashScore += weight;
      }
    }
  }

  return Math.min((crashScore / points.length) * 0.5, 10.0);
}

function rateConstruction(points: [number, number][], construction: ConstructionData[]): number {
  if (!construction.length) return 2.0;

  let constructionCount = 0;
  for (const point of points) {
    for (const constItem of construction) {
      const distance = getDistance(
        { latitude: point[1], longitude: point[0] },
        { latitude: constItem.lat, longitude: constItem.lng }
      );
      
      if (distance < 100) {
        constructionCount += 1;
      }
    }
  }

  return Math.min((constructionCount / points.length) * 10, 10.0);
}

function calculateRatings(
  coordinates: [number, number][],
  crashes: CrashData[],
  crimes: CrimeData[],
  construction: ConstructionData[],
  speeding: SpeedingData[]
): RouteRatings {
  if (!coordinates.length) {
    return { crime: 5.0, speeding: 5.0, crash: 5.0, construction: 5.0, floodRisk: 1.0 };
  }

  const samplePoints = sampleRoutePoints(coordinates, 50);
  
  return {
    crime: Math.round(rateCrime(samplePoints, crimes) * 10) / 10,
    speeding: Math.round(rateSpeeding(samplePoints, speeding) * 10) / 10,
    crash: Math.round(rateCrashes(samplePoints, crashes) * 10) / 10,
    construction: Math.round(rateConstruction(samplePoints, construction) * 10) / 10,
    floodRisk: 1.0, // Placeholder
  };
}

function calculateSafetyScore(ratings: RouteRatings): number {
  const weights = {
    crime: 0.25,
    speeding: 0.20,
    crash: 0.30,
    construction: 0.15,
    floodRisk: 0.10,
  };

  const overallRisk =
    weights.crime * ratings.crime +
    weights.speeding * ratings.speeding +
    weights.crash * ratings.crash +
    weights.construction * ratings.construction +
    weights.floodRisk * ratings.floodRisk;

  return Math.max(0, Math.round((10 - overallRisk) * 10) / 10);
}

export async function generateRoutes(request: RouteRequest): Promise<RouteData[]> {
  if (!request.origin || !request.destination) {
    throw new Error('Origin and destination required');
  }

  const { origin, destination, mode, safetyPreference = 50 } = request;
  const profile = mode === 'driving' ? 'driving' : 'walking';
  
  // Get Mapbox token from environment
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!mapboxToken) {
    throw new Error('Mapbox access token not configured');
  }

  // Get routes from Mapbox
  const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  
  const mapboxResponse = await axios.get(mapboxUrl, {
    params: {
      alternatives: true,
      geometries: 'geojson',
      steps: true,
      access_token: mapboxToken,
    },
    timeout: 30000,
  });

  const routeOptions = mapboxResponse.data.routes?.slice(0, 10) || [];

  // Calculate bounding box
  const minLat = Math.min(origin.lat, destination.lat) - 0.05;
  const maxLat = Math.max(origin.lat, destination.lat) + 0.05;
  const minLng = Math.min(origin.lng, destination.lng) - 0.05;
  const maxLng = Math.max(origin.lng, destination.lng) + 0.05;

  const bounds: Bounds = { min_lat: minLat, min_lng: minLng, max_lat: maxLat, max_lng: maxLng };

  // Fetch all safety data in parallel
  const [crashes, crimes, construction, speeding] = await Promise.all([
    dataService.getCrashes(bounds, 365),
    dataService.getCrime(bounds, 90),
    dataService.getConstruction(bounds),
    dataService.getSpeeding(bounds),
  ]);

  // Process routes
  const routes: RouteData[] = [];

  for (let idx = 0; idx < routeOptions.length; idx++) {
    const route = routeOptions[idx];
    const geometry = route.geometry;
    const coordinates: [number, number][] = geometry?.coordinates || [];

    if (!coordinates.length) continue;

    const ratings = calculateRatings(coordinates, crashes, crimes, construction, speeding);
    const safetyScore = calculateSafetyScore(ratings);

    const duration = route.duration ? route.duration / 60 : 0; // Convert to minutes
    const distance = route.distance ? route.distance / 1000 : 0; // Convert to km

    let preference: 'fastest' | 'balanced' | 'safest';
    if (safetyPreference >= 70) {
      preference = 'safest';
    } else if (safetyPreference <= 30) {
      preference = 'fastest';
    } else {
      preference = 'balanced';
    }

    routes.push({
      id: `route-${idx + 1}`,
      name: `Route ${idx + 1}`,
      duration: Math.round(duration * 10) / 10,
      distance: Math.round(distance * 100) / 100,
      safetyScore,
      preference,
      coordinates,
      ratings,
    });
  }

  // Sort routes based on safety preference
  if (safetyPreference >= 70) {
    routes.sort((a, b) => {
      if (b.safetyScore !== a.safetyScore) return b.safetyScore - a.safetyScore;
      return a.duration - b.duration;
    });
  } else if (safetyPreference <= 30) {
    routes.sort((a, b) => {
      if (a.duration !== b.duration) return a.duration - b.duration;
      return b.safetyScore - a.safetyScore;
    });
  } else {
    routes.sort((a, b) => {
      // Handle division by zero: if duration is 0, treat it as very large (low priority)
      const durationA = a.duration > 0 ? a.duration : Number.MAX_SAFE_INTEGER;
      const durationB = b.duration > 0 ? b.duration : Number.MAX_SAFE_INTEGER;
      
      const scoreA = a.safetyScore * 0.6 - (1 / durationA) * 0.4;
      const scoreB = b.safetyScore * 0.6 - (1 / durationB) * 0.4;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return durationA - durationB;
    });
  }

  if (!routes.length) {
    throw new Error('No routes found');
  }

  return routes.slice(0, 10);
}

