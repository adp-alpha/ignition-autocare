import { VehicleData, MotHistoryData } from '@/types/vehicleData';

const API_KEY = process.env.VEHICLE_API_KEY;
const BASE_URL = 'https://uk.api.vehicledataglobal.com/r2/lookup';

export async function getVehicleDetailsByReg(reg: string): Promise<VehicleData | null> {
  if (!API_KEY) {
    console.error('VEHICLE_API_KEY is not set in environment variables.');
    return null;
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
    
    return data;
  } catch (error) {
    console.error('Failed to fetch MOT history:', error);
    return null;
  }
}
