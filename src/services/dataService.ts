import axios from 'axios';

const NYC_OPEN_DATA_BASE = 'https://data.cityofnewyork.us/resource';
const NWS_ALERTS_BASE = 'https://api.weather.gov/alerts/active';
const NWS_FORECAST_BASE = 'https://api.weather.gov';

export interface Bounds {
  min_lat: number;
  min_lng: number;
  max_lat: number;
  max_lng: number;
}

export interface CrashData {
  id?: string;
  lat: number;
  lng: number;
  date?: Date;
  injuries: number;
  fatalities: number;
  vehicle_count: number;
}

export interface CrimeData {
  id?: string;
  lat: number;
  lng: number;
  date?: Date;
  offense_type?: string;
  level?: string;
}

export interface ConstructionData {
  id?: string;
  lat: number;
  lng: number;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  permit_type?: string;
}

export interface SpeedingData {
  lat: number;
  lng: number;
  violations: number;
  camera_location?: string;
}

class DataService {
  private getNYCOpenDataApiKey(): string {
    return import.meta.env.VITE_NYC_OPEN_DATA_API_KEY || '';
  }

  async getCrashes(bounds: Bounds, days: number = 365): Promise<CrashData[]> {
    try {
      const params: any = {
        $limit: 5000,
        $where: 'latitude IS NOT NULL AND longitude IS NOT NULL',
        $order: 'crash_date DESC',
      };

      const apiKey = this.getNYCOpenDataApiKey();
      if (apiKey) {
        params.$$app_token = apiKey;
      }

      const response = await axios.get(
        `${NYC_OPEN_DATA_BASE}/h9gi-nx95.json`,
        { params, timeout: 30000 }
      );

      const data = response.data;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return data
        .filter((item: any) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return (
            lat &&
            lng &&
            lat >= bounds.min_lat &&
            lat <= bounds.max_lat &&
            lng >= bounds.min_lng &&
            lng <= bounds.max_lng
          );
        })
        .slice(0, 1000)
        .map((item: any) => ({
          id: item.collision_id,
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          date: item.crash_date ? new Date(item.crash_date) : undefined,
          injuries: parseInt(item.number_of_persons_injured || '0', 10),
          fatalities: parseInt(item.number_of_persons_killed || '0', 10),
          vehicle_count: parseInt(item.number_of_vehicles_involved || '1', 10),
        }))
        .filter((crash: CrashData) => !crash.date || crash.date >= cutoffDate);
    } catch (error) {
      console.error('Error fetching crashes:', error);
      return [];
    }
  }

  async getCrime(bounds: Bounds, days: number = 90): Promise<CrimeData[]> {
    try {
      const params: any = {
        $limit: 5000,
        $where: 'latitude IS NOT NULL AND longitude IS NOT NULL',
        $order: 'cmplnt_fr_dt DESC',
      };

      const apiKey = this.getNYCOpenDataApiKey();
      if (apiKey) {
        params.$$app_token = apiKey;
      }

      const response = await axios.get(
        `${NYC_OPEN_DATA_BASE}/5uac-w243.json`,
        { params, timeout: 30000 }
      );

      const data = response.data;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return data
        .filter((item: any) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return (
            lat &&
            lng &&
            lat >= bounds.min_lat &&
            lat <= bounds.max_lat &&
            lng >= bounds.min_lng &&
            lng <= bounds.max_lng
          );
        })
        .slice(0, 1000)
        .map((item: any) => ({
          id: item.cmplnt_num,
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          date: item.cmplnt_fr_dt ? new Date(item.cmplnt_fr_dt.split('T')[0]) : undefined,
          offense_type: item.ofns_desc,
          level: item.law_cat_cd,
        }))
        .filter((crime: CrimeData) => !crime.date || crime.date >= cutoffDate);
    } catch (error) {
      console.error('Error fetching crime:', error);
      return [];
    }
  }

  async getSpeeding(bounds: Bounds): Promise<SpeedingData[]> {
    try {
      const params: any = {
        $limit: 1000,
        $where: 'latitude IS NOT NULL AND longitude IS NOT NULL',
      };

      const apiKey = this.getNYCOpenDataApiKey();
      if (apiKey) {
        params.$$app_token = apiKey;
      }

      const response = await axios.get(
        `${NYC_OPEN_DATA_BASE}/hez4-dxbm.json`,
        { params, timeout: 30000 }
      );

      return response.data
        .filter((item: any) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return (
            lat &&
            lng &&
            lat >= bounds.min_lat &&
            lat <= bounds.max_lat &&
            lng >= bounds.min_lng &&
            lng <= bounds.max_lng
          );
        })
        .slice(0, 500)
        .map((item: any) => ({
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          violations: parseInt(item.violations || '0', 10),
          camera_location: item.camera_location,
        }));
    } catch (error) {
      console.error('Error fetching speeding data:', error);
      return [];
    }
  }

  async getConstruction(bounds: Bounds): Promise<ConstructionData[]> {
    try {
      const params: any = {
        $limit: 1000,
        $where: 'latitude IS NOT NULL AND longitude IS NOT NULL',
      };

      const apiKey = this.getNYCOpenDataApiKey();
      if (apiKey) {
        params.$$app_token = apiKey;
      }

      const response = await axios.get(
        `${NYC_OPEN_DATA_BASE}/3k2p-39jp.json`,
        { params, timeout: 30000 }
      );

      return response.data
        .filter((item: any) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);
          return (
            lat &&
            lng &&
            lat >= bounds.min_lat &&
            lat <= bounds.max_lat &&
            lng >= bounds.min_lng &&
            lng <= bounds.max_lng
          );
        })
        .slice(0, 500)
        .map((item: any) => ({
          id: item.permit_number,
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          description: item.worktype || item.description,
          start_date: item.issuance_date ? new Date(item.issuance_date.split('T')[0]) : undefined,
          permit_type: item.permit_type,
        }));
    } catch (error) {
      console.error('Error fetching construction:', error);
      return [];
    }
  }

  async getWeather(location: { lat: number; lng: number }): Promise<any> {
    try {
      const gridUrl = `${NWS_FORECAST_BASE}/points/${location.lat},${location.lng}`;
      const response = await axios.get(gridUrl, {
        headers: { 'User-Agent': 'SafeRoute/1.0' },
        timeout: 30000,
      });

      if (response.data?.properties?.forecast) {
        const forecastResponse = await axios.get(response.data.properties.forecast, {
          headers: { 'User-Agent': 'SafeRoute/1.0' },
          timeout: 30000,
        });

        const periods = forecastResponse.data?.properties?.periods || [];
        const current = periods[0] || {};

        return {
          location,
          temperature: current.temperature || 70,
          condition: current.shortForecast || 'Unknown',
          precipitation: current.probabilityOfPrecipitation?.value || 0,
          alerts: [],
        };
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }

    return {
      location,
      temperature: 70,
      condition: 'Unknown',
      precipitation: 0,
      alerts: [],
    };
  }

  async getAlerts(area: string = 'NY'): Promise<any[]> {
    try {
      const response = await axios.get(`${NWS_ALERTS_BASE}?area=${area}`, {
        headers: { 'User-Agent': 'SafeRoute/1.0' },
        timeout: 30000,
      });

      return (response.data?.features || []).map((feature: any) => ({
        id: feature.properties?.id || '',
        headline: feature.properties?.headline || '',
        description: feature.properties?.description || '',
        severity: feature.properties?.severity || 'unknown',
        effective: feature.properties?.effective || new Date().toISOString(),
        expires: feature.properties?.expires || null,
        area: feature.properties?.areaDesc || '',
      }));
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }
}

export const dataService = new DataService();

