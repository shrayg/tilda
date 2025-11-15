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
```json
[
  {
    "id": "route-a",
    "name": "Route A",
    "duration": 12,  // minutes
    "distance": 3.2,  // km
    "safetyScore": 4.1,  // 0-10 scale
    "preference": "fastest",  // "fastest", "balanced", or "safest"
    "coordinates": [
      [-73.985428, 40.758896],  // [lng, lat] pairs
      [-73.984, 40.760],
      // ... more coordinates
      [-73.968285, 40.785091]
    ]
  },
  {
    "id": "route-b",
    "name": "Route B",
    "duration": 14,
    "distance": 3.8,
    "safetyScore": 8.3,
    "preference": "safest",
    "coordinates": [...]
  },
  {
    "id": "route-c",
    "name": "Route C",
    "duration": 13,
    "distance": 3.5,
    "safetyScore": 6.7,
    "preference": "balanced",
    "coordinates": [...]
  }
]
```

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

Your backend should compute the safety score (0-10 scale) based on:

1. **Crash Data**: Weight fatal crashes higher than injury/property damage
2. **Crime Data**: Weight violent crimes higher than property crimes
3. **Speed Risk**: Penalize high-speed corridors or high-injury networks

Example formula:
```python
crash_risk = (w_fatal * fatal_count + w_injury * injury_count + w_property * property_count)
crime_risk = (w_violent * violent_count + w_theft * theft_count)
speed_risk = 1 if on_high_speed_corridor else 0

point_risk = a * crash_risk + b * crime_risk + c * speed_risk
route_risk = average(all_point_risks_along_route)

safety_score = 10 * exp(-k * route_risk)  # Normalize to 0-10
```

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
