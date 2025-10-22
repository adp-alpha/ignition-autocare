import { MotHistoryData, VehicleData } from '@/types/vehicleData';
import NodeCache from 'node-cache';

const API_KEY = process.env.VEHICLE_API_KEY;
const BASE_URL = 'https://uk.api.vehicledataglobal.com/r2/lookup';

// Cache for 30 minutes (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });

export async function getVehicleDetailsByReg(reg: string): Promise<VehicleData | null> {
  if (!API_KEY) {
    console.error('VEHICLE_API_KEY is not set in environment variables.');
    return null;
  }

  // Normalize registration number for cache key
  const normalizedReg = reg.toUpperCase().replace(/\s/g, '');
  const cacheKey = `vehicle_${normalizedReg}`;

  // Check cache first
  const cachedData = cache.get<VehicleData>(cacheKey);
  if (cachedData) {
    console.log('✓ Cache hit for vehicle details:', normalizedReg);
    return cachedData;
  }

  const params = new URLSearchParams({
    ApiKey: API_KEY,
    PackageName: 'VehicleDetails',
    Vrm: reg,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }
    const data: VehicleData = await response.json();

    // Check if the API returned a successful status
    if (!data.ResponseInformation?.IsSuccessStatusCode) {
      console.error('Vehicle API returned unsuccessful status:', data.ResponseInformation?.StatusMessage);
      return null;
    }

    // Store in cache
    cache.set(cacheKey, data);
    console.log('✓ Cached vehicle details for:', normalizedReg);

    return data;
  } catch (error) {
    console.error('Failed to fetch vehicle details:', error);
    return null;
  }
}

export async function getMotHistoryByReg(reg: string): Promise<MotHistoryData | null> {
  if (!API_KEY) {
    console.error('VEHICLE_API_KEY is not set in environment variables.');
    return null;
  }

  // Normalize registration number for cache key
  const normalizedReg = reg.toUpperCase().replace(/\s/g, '');
  const cacheKey = `mot_${normalizedReg}`;

  // Check cache first
  const cachedData = cache.get<MotHistoryData>(cacheKey);
  if (cachedData) {
    console.log('✓ Cache hit for MOT history:', normalizedReg);
    return cachedData;
  }

  const params = new URLSearchParams({
    ApiKey: API_KEY,
    PackageName: 'MotHistoryDetails',
    Vrm: reg,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      console.error(`API request for MOT history failed with status ${response.status}: ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }
    const data: MotHistoryData = await response.json();

    // Check if the API returned a successful status
    if (!data.ResponseInformation?.IsSuccessStatusCode) {
      console.error('MOT API returned unsuccessful status:', data.ResponseInformation?.StatusMessage);
      return null;
    }

    // Store in cache
    cache.set(cacheKey, data);
    console.log('✓ Cached MOT history for:', normalizedReg);

    return data;
  } catch (error) {
    console.error('Failed to fetch MOT history:', error);
    return null;
  }
}

// New function to fetch both in parallel
export async function getVehicleAndMotHistory(reg: string): Promise<{
  vehicle: VehicleData | null;
  mot: MotHistoryData | null;
}> {
  const [vehicle, mot] = await Promise.all([
    getVehicleDetailsByReg(reg),
    getMotHistoryByReg(reg)
  ]);

  return { vehicle, mot };
}

// Utility function to clear cache for a specific registration
export function clearVehicleCache(reg: string): void {
  const normalizedReg = reg.toUpperCase().replace(/\s/g, '');
  cache.del(`vehicle_${normalizedReg}`);
  cache.del(`mot_${normalizedReg}`);
  console.log('✓ Cleared cache for:', normalizedReg);
}

// Utility function to get cache stats
export function getCacheStats() {
  return cache.getStats();
}
