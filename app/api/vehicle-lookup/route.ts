import { NextRequest, NextResponse } from 'next/server';
import { getVehicleDetailsByReg, getMotHistoryByReg } from '@/lib/vehicle-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reg = searchParams.get('reg');
  const type = searchParams.get('type'); // 'mot' or undefined for vehicle details

  if (!reg) {
    return NextResponse.json(
      { error: 'Registration number is required' },
      { status: 400 }
    );
  }

  try {
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
    } else {
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
  } catch (error) {
    console.error('Error in vehicle-lookup API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
