'use client';

import ServicePageClient from '@/components/services/ServicePageClient';
import { calculatePrices } from '@/lib/pricing-engine';
import { AdminData } from '@/types/adminData';
import { MotHistoryData, VehicleData } from '@/types/vehicleData';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const ServicePage = () => {
  const params = useParams();
  const reg = params.reg as string;

  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [motHistory, setMotHistory] = useState<MotHistoryData | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    vehicle: true,
    admin: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Memoize pricing calculation
  const pricingData = useMemo(() => {
    if (!vehicleData || !adminData) return null;
    const engineCapacity = vehicleData.Results?.ModelDetails?.Powertrain?.IceDetails?.EngineCapacityCc;
    if (!engineCapacity) return null;
    return calculatePrices(engineCapacity, adminData);
  }, [vehicleData, adminData]);

  useEffect(() => {
    if (!reg) return;

    // Helper function to safely parse JSON
    const safeJsonParse = async (response: Response, context: string) => {
      const text = await response.text();

      // Check if response is HTML (error page)
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error(`${context}: Received HTML instead of JSON`);
        throw new Error(`Server error: Unable to fetch ${context.toLowerCase()}`);
      }

      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(`${context}: Invalid JSON`, text.substring(0, 100));
        throw new Error(`Invalid response format from ${context.toLowerCase()}`);
      }
    };

    const fetchAllData = async () => {
      try {
        // Start all fetches in parallel immediately
        const startTime = performance.now();

        const [adminResponse, vehicleResponse] = await Promise.all([
          fetch('/api/admin-data', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }),
          fetch(`/api/vehicle-lookup?reg=${encodeURIComponent(reg)}&type=both`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
        ]);

        const endTime = performance.now();
        console.log(`✓ All API calls completed in ${Math.round(endTime - startTime)}ms`);

        // Handle admin data
        if (!adminResponse.ok) {
          throw new Error(`Admin data fetch failed: ${adminResponse.status}`);
        }
        const adminResult = await safeJsonParse(adminResponse, 'Admin Data');
        setAdminData(adminResult);
        setLoadingStates(prev => ({ ...prev, admin: false }));

        // Handle vehicle + MOT data
        if (!vehicleResponse.ok) {
          const errorData = await safeJsonParse(vehicleResponse, 'Vehicle Data');
          if (vehicleResponse.status === 404) {
            throw new Error(errorData.message || 'Invalid registration number. Please check and try again.');
          }
          throw new Error(errorData.error || `Failed to fetch vehicle data: ${vehicleResponse.statusText}`);
        }

        const vehicleResult = await safeJsonParse(vehicleResponse, 'Vehicle Data');

        // Extract vehicle data
        const vehicle = vehicleResult.vehicle;
        const mot = vehicleResult.mot;

        // Validate vehicle data
        if (!vehicle?.ResponseInformation?.IsSuccessStatusCode) {
          const statusMessage = vehicle?.ResponseInformation?.StatusMessage || 'Unknown error';
          if (statusMessage === 'InvalidSearchTerm') {
            throw new Error('Invalid registration number format. Please enter a valid UK registration.');
          }
          throw new Error(`Vehicle lookup failed: ${statusMessage}`);
        }

        if (!vehicle.Results || Object.keys(vehicle.Results).length === 0) {
          throw new Error('No vehicle data found for this registration number');
        }

        const engineCapacity = vehicle.Results?.ModelDetails?.Powertrain?.IceDetails?.EngineCapacityCc;
        if (!engineCapacity) {
          throw new Error('Unable to retrieve engine capacity for this vehicle. This service may not be available for this vehicle type.');
        }

        // Set vehicle data
        setVehicleData(vehicle);
        setLoadingStates(prev => ({ ...prev, vehicle: false }));

        // Set MOT data if available
        if (mot?.ResponseInformation?.IsSuccessStatusCode) {
          setMotHistory(mot);
          console.log('✓ MOT history loaded successfully');
        } else {
          console.log('⚠ MOT history not available');
        }

      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoadingStates({ vehicle: false, admin: false });
      }
    };

    fetchAllData();
  }, [reg]);

  // Show loading only for critical data (vehicle + admin)
  const isLoading = loadingStates.vehicle || loadingStates.admin;

  // Progressive loading - show content as soon as vehicle + admin data is ready
  if (isLoading && !error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold">Loading vehicle information...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch your vehicle details</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || (!isLoading && !vehicleData)) {
    const isInvalidReg = error?.includes('Invalid registration') || error?.includes('InvalidSearchTerm');

    return (
      <div className="container mx-auto py-10 px-4">
        <div className={`border rounded-lg p-8 max-w-2xl mx-auto ${
          isInvalidReg ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isInvalidReg ? 'bg-yellow-200' : 'bg-red-200'
            }`}>
              <svg
                className={`w-8 h-8 ${isInvalidReg ? 'text-yellow-600' : 'text-red-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className={`text-3xl font-bold mb-4 ${
              isInvalidReg ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {isInvalidReg ? 'Invalid Registration Number' : 'Vehicle Not Found'}
            </h1>

            <div className="mb-4">
              <p className={`text-sm mb-2 ${isInvalidReg ? 'text-yellow-600' : 'text-red-600'}`}>
                Registration entered:
              </p>
              <div className="bg-white border-2 border-gray-300 rounded px-4 py-2 inline-block">
                <span className="text-2xl font-bold tracking-wider uppercase">{reg}</span>
              </div>
            </div>

            {error && (
              <div className={`mb-6 p-4 rounded-lg ${
                isInvalidReg ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <p className={`text-sm font-medium ${
                  isInvalidReg ? 'text-yellow-800' : 'text-red-700'
                }`}>
                  {error}
                </p>
              </div>
            )}

            <div className="text-gray-600 mb-6 space-y-2">
              <p className="font-semibold">Please check that:</p>
              <ul className="text-sm space-y-1">
                <li>✓ The registration number is correct</li>
                <li>✓ There are no extra spaces or special characters</li>
                <li>✓ The vehicle is registered in the UK</li>
                <li>✓ Your internet connection is stable</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold transition-colors"
              >
                ← Try Another Vehicle
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin data error
  if (!adminData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="border rounded-lg p-8 max-w-2xl mx-auto bg-orange-50 border-orange-200">
          <h1 className="text-3xl font-bold mb-6 text-orange-800">Service Temporarily Unavailable</h1>
          <p className="text-gray-700 mb-4">We're experiencing technical difficulties loading pricing data.</p>
          <p className="text-gray-600 mb-6">Please try again in a few moments.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold transition-colors"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render page with available data (MOT can still be loading)
  if (!pricingData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Service Currently Unavailable</h1>
        <p>We were unable to retrieve engine details for the vehicle with registration {reg}.</p>
        <p>This may be a temporary issue. Please try again later.</p>
      </div>
    );
  }

  return (
    <ServicePageClient
      vehicleData={vehicleData}
      motHistoryData={motHistory}
      pricingData={pricingData}
      registration={reg}
    />
  );
};

export default ServicePage;
