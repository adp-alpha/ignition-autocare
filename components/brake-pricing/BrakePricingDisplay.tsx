'use client';

import { useState, useEffect } from 'react';
import { 
  getBrakePricing, 
  getAllBrakePricingForMake, 
  getAvailableMakes,
  formatBrakePrice,
  getBrakeServiceDisplayName,
  getBrakeWarningSigns,
  type BrakeServiceType 
} from '@/lib/brake-pricing';

interface BrakePricingDisplayProps {
  vehicleMake?: string;
  showAllServices?: boolean;
  showWarningSigns?: boolean;
}

const BrakePricingDisplay: React.FC<BrakePricingDisplayProps> = ({
  vehicleMake,
  showAllServices = true,
  showWarningSigns = false
}) => {
  const [selectedMake, setSelectedMake] = useState(vehicleMake || '');
  const [availableMakes] = useState(getAvailableMakes());
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (selectedMake) {
      if (showAllServices) {
        const allPricing = getAllBrakePricingForMake(selectedMake);
        setPricing(allPricing);
      } else {
        // Just get front pads as example
        const frontPadsPricing = getBrakePricing(selectedMake, 'frontPads');
        setPricing({ frontPads: frontPadsPricing });
      }
    }
  }, [selectedMake, showAllServices]);

  const serviceTypes: BrakeServiceType[] = ['frontPads', 'rearPads', 'frontDiscsAndPads', 'rearDiscsAndPads'];

  return (
    <div className="brake-pricing-display p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Brake Replacement Pricing</h3>
      
      {/* Make Selection */}
      <div className="mb-6">
        <label htmlFor="make-select" className="block text-sm font-medium mb-2">
          Select Vehicle Make:
        </label>
        <select
          id="make-select"
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a make...</option>
          {availableMakes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      {/* Pricing Display */}
      {selectedMake && pricing && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Pricing for {selectedMake}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceTypes.map(serviceType => {
              const servicePricing = pricing[serviceType];
              if (!servicePricing) return null;

              return (
                <div key={serviceType} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    {getBrakeServiceDisplayName(serviceType)}
                  </h5>
                  
                  {servicePricing.found && servicePricing.price ? (
                    <div className="text-2xl font-bold text-green-600">
                      {formatBrakePrice(servicePricing.price)}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div>Price not available</div>
                      {servicePricing.fallbackPrice && (
                        <div className="text-sm text-blue-600 mt-1">
                          Estimated: {formatBrakePrice(servicePricing.fallbackPrice)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Prices are based on average costs from BookMyGarage data (July 2022 - July 2024). 
              Actual prices may vary depending on your specific vehicle model and local garage rates.
            </p>
          </div>
        </div>
      )}

      {/* Warning Signs */}
      {showWarningSigns && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-3">
            ⚠️ Signs You May Need Brake Replacement:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-yellow-700">
            {getBrakeWarningSigns().map((sign, index) => (
              <li key={index} className="text-sm">{sign}</li>
            ))}
          </ul>
          <p className="text-sm text-yellow-800 mt-3 font-medium">
            Addressing brake problems quickly can help keep additional costs down.
          </p>
        </div>
      )}
    </div>
  );
};

export default BrakePricingDisplay;