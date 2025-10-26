import { NextRequest, NextResponse } from 'next/server';
import { 
  getBrakePricing, 
  getAllBrakePricingForMake, 
  getAvailableMakes, 
  getPriceRange,
  getBrakeWarningSigns,
  getBrakeRecommendation,
  type BrakeServiceType 
} from '@/lib/brake-pricing';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const serviceType = searchParams.get('serviceType') as BrakeServiceType;
    const action = searchParams.get('action');

    // Handle different actions
    switch (action) {
      case 'makes':
        return NextResponse.json({
          success: true,
          makes: getAvailableMakes()
        });

      case 'price-ranges':
        const ranges = {
          frontPads: getPriceRange('frontPads'),
          rearPads: getPriceRange('rearPads'),
          frontDiscsAndPads: getPriceRange('frontDiscsAndPads'),
          rearDiscsAndPads: getPriceRange('rearDiscsAndPads')
        };
        return NextResponse.json({
          success: true,
          priceRanges: ranges
        });

      case 'warning-signs':
        return NextResponse.json({
          success: true,
          warningSigns: getBrakeWarningSigns(),
          recommendation: getBrakeRecommendation()
        });

      case 'all-pricing':
        if (!make) {
          return NextResponse.json({
            success: false,
            error: 'Make parameter is required for all-pricing action'
          }, { status: 400 });
        }
        
        const allPricing = getAllBrakePricingForMake(make);
        return NextResponse.json({
          success: true,
          make,
          pricing: allPricing
        });

      default:
        // Single service pricing
        if (!make || !serviceType) {
          return NextResponse.json({
            success: false,
            error: 'Make and serviceType parameters are required',
            availableServiceTypes: ['frontPads', 'rearPads', 'frontDiscsAndPads', 'rearDiscsAndPads']
          }, { status: 400 });
        }

        const pricing = getBrakePricing(make, serviceType);
        return NextResponse.json({
          success: true,
          ...pricing
        });
    }

  } catch (error) {
    console.error('Brake pricing API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Example usage endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { make, serviceTypes } = body;

    if (!make) {
      return NextResponse.json({
        success: false,
        error: 'Make is required'
      }, { status: 400 });
    }

    // Get pricing for specified service types or all if not specified
    const types: BrakeServiceType[] = serviceTypes || ['frontPads', 'rearPads', 'frontDiscsAndPads', 'rearDiscsAndPads'];
    
    const results = types.map(type => ({
      serviceType: type,
      ...getBrakePricing(make, type)
    }));

    return NextResponse.json({
      success: true,
      make,
      results,
      summary: {
        totalServices: results.length,
        foundPrices: results.filter(r => r.found).length,
        averagePrice: results
          .filter(r => r.price !== null)
          .reduce((sum, r, _, arr) => sum + (r.price! / arr.length), 0)
      }
    });

  } catch (error) {
    console.error('Brake pricing POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}