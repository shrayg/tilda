# Backend Integration Guide

This document outlines how to integrate your Flask/FastAPI backend with the SafeRoute frontend.

## API Endpoint Required

### POST `/route`

**Request Body:**
```json
{
  "origin": {
    "lat": 40.758896,
    "lng": -73.985428,
    "address": "Times Square, NYC"
  },
  "destination": {
    "lat": 40.785091,
    "lng": -73.968285,
    "address": "Central Park, NYC"
  },
  "mode": "driving",  // or "walking"
  "safetyPreference": 50  // 0 (fastest) to 100 (safest)
}
```

**Response:**
Your backend should return **exactly 10 route options** as an array:

```json
[
  {
    "id": "route-1",
    "name": "Route 1",
    "duration": 12,  // minutes
    "distance": 3.2,  // km
    "safetyScore": 4.1,  // 0-10 scale, higher is safer (overall)
    "preference": "fastest",  // "fastest", "balanced", or "safest"
    "coordinates": [
      [-73.985428, 40.758896],  // [lng, lat] pairs for Mapbox
      [-73.984, 40.760],
      // ... more coordinates
      [-73.968285, 40.785091]
    ],
    "ratings": {
      "crime": 6.2,  // 0-10 scale, lower is safer
      "speeding": 7.5,  // 0-10 scale, lower is safer
      "crash": 5.8,  // 0-10 scale, lower is safer
      "construction": 2.1,  // 0-10 scale, lower is safer
      "floodRisk": 1.0  // 0-10 scale, lower is safer
    }
  },
  {
    "id": "route-2",
    "name": "Route 2",
    "duration": 14,
    "distance": 3.8,
    "safetyScore": 8.3,
    "preference": "safest",
    "coordinates": [...],
    "ratings": {
      "crime": 2.1,
      "speeding": 1.8,
      "crash": 1.5,
      "construction": 3.2,
      "floodRisk": 0.5
    }
  }
  // ... 8 more routes (total of 10)
]
```

**Important:** 
- Return **exactly 10 routes** (or fewer if less are available)
- Each route must include the `ratings` object with all 5 risk factors
- The `safetyScore` is the overall weighted score combining all risk factors
- Coordinates must be in `[lng, lat]` format for Mapbox compatibility

## Integration Steps

### 1. Update the API Service

Replace the mock implementation in `src/services/mockRoutes.ts`:

```typescript
// src/services/apiRoutes.ts
import { RouteData, RouteRequest } from "@/types/route";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchRoutes = async (request: RouteRequest): Promise<RouteData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch routes:', error);
    throw error;
  }
};
```

### 2. Update Index.tsx

Replace the mock routes call with the real API:

```typescript
// In src/pages/Index.tsx
import { fetchRoutes } from "@/services/apiRoutes";

// Replace the useEffect that generates routes
useEffect(() => {
  if (origin && destination && mapboxToken) {
    fetchRoutes({
      origin,
      destination,
      mode,
      safetyPreference,
    })
      .then((newRoutes) => {
        setRoutes(newRoutes);
        setSelectedRoute(newRoutes[0]);
      })
      .catch((error) => {
        toast({
          title: "Error fetching routes",
          description: error.message,
          variant: "destructive",
        });
      });
  }
}, [origin, destination, mode, safetyPreference, mapboxToken]);
```

### 3. Environment Variables

Create a `.env` file in the project root (this is fine since it's not a secret):

```env
VITE_API_URL=http://localhost:5000
```

For production, set this to your deployed backend URL.

## Safety Score Calculation

Your backend should compute detailed ratings and overall safety score based on:

1. **Crime Data**: Analyze crime incidents along the route (violent crimes weighted higher than property crimes)
2. **Speeding Data**: Identify high-speed corridors, speeding violations, or high-injury networks
3. **Crash Data**: Weight fatal crashes higher than injury/property damage crashes
4. **Construction Data**: Active construction zones, road work, closures
5. **Flood Risk**: Historical flood data, flood zone areas, low-lying regions

### Individual Ratings (0-10 scale, lower is safer):
Each route should have ratings for all 5 factors:
- `crime`: 0 = very safe, 10 = high crime risk
- `speeding`: 0 = low speed/safe, 10 = high speed/dangerous
- `crash`: 0 = no crashes, 10 = high crash frequency
- `construction`: 0 = no construction, 10 = heavy construction
- `floodRisk`: 0 = no flood risk, 10 = high flood risk

### Overall Safety Score (0-10 scale, higher is safer):
The `safetyScore` is a weighted combination of all factors:

Example formula:
```python
# Calculate individual risk scores (0-10, higher = more risky)
crime_rating = calculate_crime_risk(route_coordinates)
speeding_rating = calculate_speeding_risk(route_coordinates)
crash_rating = calculate_crash_risk(route_coordinates)
construction_rating = calculate_construction_risk(route_coordinates)
flood_risk_rating = calculate_flood_risk(route_coordinates)

# Weight each factor (adjust weights based on importance)
weights = {
    'crime': 0.25,
    'speeding': 0.20,
    'crash': 0.30,
    'construction': 0.15,
    'floodRisk': 0.10
}

# Calculate overall risk (0-10, higher = more risky)
overall_risk = (
    weights['crime'] * crime_rating +
    weights['speeding'] * speeding_rating +
    weights['crash'] * crash_rating +
    weights['construction'] * construction_rating +
    weights['floodRisk'] * flood_risk_rating
)

# Convert to safety score (0-10, higher = safer)
safety_score = 10 - overall_risk  # Invert: lower risk = higher safety
```

### Route Generation:
Your backend should:
1. Use Mapbox Directions API or similar to generate **10 alternative routes** between origin and destination
2. For each route, analyze the path against all 5 data sources
3. Calculate individual ratings and overall safety score
4. Sort routes based on the user's `safetyPreference` (0 = fastest, 100 = safest)
5. Return all 10 routes with their ratings

## Coordinate Format

- Mapbox expects coordinates as **[longitude, latitude]** pairs
- Make sure your backend returns coordinates in this format
- The frontend will handle the display automatically

## Testing

1. Start your backend server
2. Update `VITE_API_URL` to point to your backend
3. Test with the NYC default locations or enter custom ones
4. Verify routes display correctly on the map

## CORS Configuration

Make sure your backend allows CORS from your frontend origin:

```python
# Flask example
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080", "https://your-frontend-domain.com"])
```

## Error Handling

The frontend will show toast notifications for API errors. Make sure your backend returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid input)
- `500`: Server error

## Next Steps

1. Implement the `/route` endpoint in your Flask/FastAPI backend
2. Load crash and crime data for your chosen city
3. Implement the safety scoring algorithm
4. Test with the frontend
5. Deploy both frontend and backend
6. Update the API URL for production

Good luck with your hackathon! 🚀
