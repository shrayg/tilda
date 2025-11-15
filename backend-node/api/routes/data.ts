import { Router, Request, Response } from 'express';
import { dataService } from '../services/dataService';
import { Location } from '../types';

const router = Router();

router.get('/crashes', async (req: Request, res: Response) => {
  try {
    const { min_lat, min_lng, max_lat, max_lng, days = '365' } = req.query;

    if (!min_lat || !min_lng || !max_lat || !max_lng) {
      return res.status(400).json({ error: 'Bounding box required' });
    }

    const bounds = {
      min_lat: parseFloat(min_lat as string),
      min_lng: parseFloat(min_lng as string),
      max_lat: parseFloat(max_lat as string),
      max_lng: parseFloat(max_lng as string),
    };

    const crashes = await dataService.getCrashes(bounds, parseInt(days as string, 10));
    res.json(crashes);
  } catch (error: any) {
    console.error('Error fetching crashes:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch crashes' });
  }
});

router.get('/crime', async (req: Request, res: Response) => {
  try {
    const { min_lat, min_lng, max_lat, max_lng, days = '90' } = req.query;

    if (!min_lat || !min_lng || !max_lat || !max_lng) {
      return res.status(400).json({ error: 'Bounding box required' });
    }

    const bounds = {
      min_lat: parseFloat(min_lat as string),
      min_lng: parseFloat(min_lng as string),
      max_lat: parseFloat(max_lat as string),
      max_lng: parseFloat(max_lng as string),
    };

    const crimes = await dataService.getCrime(bounds, parseInt(days as string, 10));
    res.json(crimes);
  } catch (error: any) {
    console.error('Error fetching crime:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch crime' });
  }
});

router.get('/speeding', async (req: Request, res: Response) => {
  try {
    const { min_lat, min_lng, max_lat, max_lng } = req.query;

    if (!min_lat || !min_lng || !max_lat || !max_lng) {
      return res.status(400).json({ error: 'Bounding box required' });
    }

    const bounds = {
      min_lat: parseFloat(min_lat as string),
      min_lng: parseFloat(min_lng as string),
      max_lat: parseFloat(max_lat as string),
      max_lng: parseFloat(max_lng as string),
    };

    const speeding = await dataService.getSpeeding(bounds);
    res.json(speeding);
  } catch (error: any) {
    console.error('Error fetching speeding data:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch speeding data' });
  }
});

router.get('/construction', async (req: Request, res: Response) => {
  try {
    const { min_lat, min_lng, max_lat, max_lng } = req.query;

    if (!min_lat || !min_lng || !max_lat || !max_lng) {
      return res.status(400).json({ error: 'Bounding box required' });
    }

    const bounds = {
      min_lat: parseFloat(min_lat as string),
      min_lng: parseFloat(min_lng as string),
      max_lat: parseFloat(max_lat as string),
      max_lng: parseFloat(max_lng as string),
    };

    const construction = await dataService.getConstruction(bounds);
    res.json(construction);
  } catch (error: any) {
    console.error('Error fetching construction:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch construction' });
  }
});

router.get('/weather', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const location: Location = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string),
    };

    const weather = await dataService.getWeather(location);
    res.json(weather);
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch weather' });
  }
});

router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const { area = 'NY' } = req.query;
    const alerts = await dataService.getAlerts(area as string);
    res.json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch alerts' });
  }
});

router.get('/floodzones', async (req: Request, res: Response) => {
  // Placeholder - flood zone data integration is complex
  res.json([]);
});

export default router;

