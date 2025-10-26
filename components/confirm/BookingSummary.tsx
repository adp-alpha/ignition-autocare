'use client';

import { useBooking } from '@/lib/context/BookingContext';
import { ServiceItem } from '@/lib/pricing-engine';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

const BookingSummary = () => {
  const {
    displayPrices,
    selectedServices,
    totalPrice,
    isBlueLightCardHolder,
    toggleBlueLightCard,
    registration,
  } = useBooking();
  const router = useRouter();

  const handleEditBooking = () => {
    // Navigate back to the service page with the registration
    if (registration) {
      router.push(`/service/${registration}`);
    } else {
      // Fallback to home if registration is not available
      router.push('/');
    }
  };

  if (!displayPrices) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4">Booking Summary</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const allServices = [
    ...displayPrices.motAndServicing,
    ...displayPrices.additionalWork,
    ...displayPrices.repairs,
    ...displayPrices.addons,
  ];

  const selectedServiceDetails = allServices.filter(service => selectedServices.includes(service.id));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-8 safari-booking-summary">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-bold">Booking Summary</h2>
        <button
          onClick={handleEditBooking}
          className="text-sm text-blue-600 flex items-center font-semibold"
        >
          <Pencil className="w-3 h-3 mr-1" />
          Edit Booking
        </button>
      </div>

      <div className="space-y-2 text-sm mt-4">
        <p className="text-xs text-gray-500">
          Prices include VAT where applicable.
        </p>

        {selectedServiceDetails.length > 0 ? (
          selectedServiceDetails.map((service) => (
            <div key={service.id} className="pt-2">
              {/* --- Service Name --- */}
              <div className="flex justify-between font-bold text-gray-800">
                <span>{service.name}</span>
                <span>£{service.finalPrice.toFixed(2)}</span>
              </div>

              {/* --- Discount Breakdown --- */}
              {service.originalPrice && service.discount ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Original Price</span>
                    <span>£{service.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-red-500">
                    <span>
                      Discount (
                      {service.id === "vehicle-safety-check" &&
                      service.finalPrice === 0
                        ? "Blue Light Card"
                        : `${service.discount}% off`}
                      )
                    </span>
                    <span>
                      -£
                      {(service.originalPrice - service.finalPrice).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No services selected yet.</p>
        )}
      </div>

      <div className="border-t mt-4 pt-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="blueLightCard"
            checked={isBlueLightCardHolder}
            onCheckedChange={toggleBlueLightCard}
          />
          <label
            htmlFor="blueLightCard"
            className="text-sm font-medium leading-none"
          >
            Are you a Blue Light Card Holder?
          </label>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>£{totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
