import {
  getMotHistoryByReg,
  getVehicleAndMotHistory,
  getVehicleDetailsByReg
} from '@/lib/vehicle-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reg = searchParams.get('reg');
  const type = searchParams.get('type'); // 'mot', 'vehicle', or 'both'

  if (!reg) {
    return NextResponse.json(
      { error: 'Registration number is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch both vehicle details and MOT history in parallel
    if (type === 'both' || !type) {
      const startTime = Date.now();
      const { vehicle, mot } = await getVehicleAndMotHistory(reg);
      const duration = Date.now() - startTime;

      console.log(`✓ Fetched both vehicle and MOT data in ${duration}ms`);

      if (!vehicle && !mot) {
        return NextResponse.json(
          {
            error: 'Invalid registration number or data not found',
            message: 'Please check the registration number and try again'
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        vehicle,
        mot,
        fetchTime: duration
      });
    }

    // Fetch only MOT history
    if (type === 'mot') {
      const motHistory = await getMotHistoryByReg(reg);

      if (!motHistory) {
        return NextResponse.json(
          {
            error: 'Invalid registration number or MOT history not found',
            message: 'Please check the registration number and try again'
          },
          { status: 404 }
        );
      }

      return NextResponse.json(motHistory);
    }

    // Fetch only vehicle details
    if (type === 'vehicle') {
      const vehicleData = await getVehicleDetailsByReg(reg);

      if (!vehicleData) {
        return NextResponse.json(
          {
            error: 'Invalid registration number or vehicle not found',
            message: 'Please check the registration number and try again'
          },
          { status: 404 }
        );
      }

      return NextResponse.json(vehicleData);
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in vehicle-lookup API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
