"use client";

import ignitionAutoCare from "@/assets/Ignition-auto-care.png";
import silverTierBadge from "@/assets/silver-tier-badge.svg";
import {
  garageDetails,
  reviews,
  ServiceUIDetails,
  serviceUIText,
} from "@/data/serviceData";
import { useBooking } from "@/lib/context/BookingContext";
import { FormattedPricingData, ServiceItem } from "@/lib/pricing-engine";
import { MotHistoryData, VehicleData } from "@/types/vehicleData";
import { Check, Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CalendarIcon,
  CustomCheckbox,
  InfoIcon,
  LocationIcon,
  RenderStars,
  StarIcon,
} from "./component";
import Image from 'next/image'


// Lazy load heavy components
const ReviewSlider = lazy(() => import("@/components/reviews/ReviewSlider"));

// Memoized Vehicle Info Component
const VehicleInfo = memo(
  ({
    vehicleData,
    motHistoryData,
  }: {
    vehicleData: VehicleData;
    motHistoryData: MotHistoryData | null;
  }) => {
    const vehicleDetails = vehicleData.Results?.VehicleDetails;
    const modelDetails = vehicleData.Results?.ModelDetails;

    if (!vehicleDetails) {
      return <span>Loading vehicle details...</span>;
    }

    return (
      <>
        <span>
          {vehicleDetails.VehicleIdentification.DvlaMake}{" "}
          {vehicleDetails.VehicleIdentification.DvlaModel}{" "}
          {modelDetails?.Powertrain.IceDetails?.EngineCapacityCc}cc
        </span>
        <br />
        <span className="text-[#0a65a3] text-xl">
          {vehicleDetails.VehicleIdentification.Vrm}
        </span>
        <br />
        <span>
          {vehicleDetails.VehicleIdentification.DvlaFuelType}{" "}
          {modelDetails?.Powertrain.Transmission.TransmissionType}
        </span>
        <div>
          MOT due on:{" "}
          {motHistoryData?.Results?.MotHistoryDetails?.MotDueDate
            ? new Date(
                motHistoryData.Results.MotHistoryDetails.MotDueDate
              ).toLocaleDateString()
            : "N/A"}
        </div>
        <span>
          Registered on:{" "}
          {new Date(
            vehicleDetails.VehicleIdentification.DateFirstRegistered ?? ""
          ).toLocaleDateString()}
        </span>
      </>
    );
  }
);
VehicleInfo.displayName = "VehicleInfo";

interface ServicePageClientProps {
  vehicleData: VehicleData | null;
  motHistoryData: MotHistoryData | null;
  pricingData: FormattedPricingData;
  registration: string;
}

// Memoized Service Accordion Section
const ServiceAccordionSection = memo(
  ({
    title,
    sectionKey,
    services,
    isOpen,
    toggleSection,
    selectedServices,
    handleServiceSelection,
    displayPrices,
  }: {
    title: string;
    sectionKey: string;
    services: ServiceItem[];
    isOpen: boolean;
    toggleSection: (section: string) => void;
    selectedServices: string[];
    handleServiceSelection: (id: string) => void;
    displayPrices: FormattedPricingData;
  }) => {
    const uiDetails = serviceUIText;

    return (
      <div className="bg-white border-t border-gray-200">
        <h2
          className="cursor-pointer relative text-xl font-bold p-4 w-full"
          onClick={() => toggleSection(sectionKey)}
        >
          {title}
          <svg
            aria-hidden="true"
            className={`w-4 h-4 absolute right-5 top-5 transform transition-transform ${
              isOpen ? "" : "rotate-180"
            }`}
            role="img"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
            ></path>
          </svg>
        </h2>
        {isOpen && (
          <div className="pb-0">
            {services.map((service) => {
              const details: ServiceUIDetails = uiDetails[service.id] || {};
              const isChecked = selectedServices.includes(service.id);

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between cursor-pointer py-3 px-4 border-b last:border-b-0"
                  onClick={() => handleServiceSelection(service.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-4 pt-0.5">
                      <CustomCheckbox checked={isChecked} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <h3 className="text-base font-bold text-brand-dark-blue">
                          {service.name}
                        </h3>
                        {details.hasIcon && <InfoIcon />}
                      </div>
                      {details.description && (
                        <p className="text-sm text-brand-gray font-normal mt-1">
                          {details.description}
                        </p>
                      )}
                      {details.subtitle && (
                        <p className="text-sm text-brand-gray font-normal mt-1">
                          {details.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center justify-end gap-2 pl-2">
                    {service.priceType === "REVEAL" ? (
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-brand-green text-white text-sm font-bold py-2 px-4 rounded-md"
                      >
                        Reveal Price
                      </button>
                    ) : service.priceType === "ESTIMATE" ? (
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-200 text-brand-dark-blue text-sm font-bold py-2 px-4 rounded-md"
                      >
                        Get an estimate
                      </button>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold text-black">
                          £{service.finalPrice?.toFixed(2)}
                        </span>
                        {service.id === "mot" && !service.discount ? (
                          <div className="text-xs text-right text-brand-gray font-normal mt-1">
                            {service.discounts
                              .filter(
                                (d) =>
                                  d.condition === "WITH_FULL_SERVICE" ||
                                  d.condition === "WITH_MAJOR_SERVICE"
                              )
                              .map((discount) => (
                                <div key={discount.condition}>
                                  Only £{discount.discountedPrice.toFixed(2)}{" "}
                                  with a{" "}
                                  {
                                    displayPrices?.motAndServicing.find(
                                      (s) =>
                                        s.id.toLowerCase() ===
                                        discount.condition
                                          .replace("WITH_", "")
                                          .replace("_SERVICE", "Service")
                                          .toLowerCase()
                                    )?.name
                                  }
                                </div>
                              ))}
                          </div>
                        ) : null}
                        {service.originalPrice &&
                        service.discount &&
                        service.discount > 0 ? (
                          <div className="text-sm text-red-500 font-bold mt-1">
                            Discounted by {service.discount}%! (from £
                            {service.originalPrice.toFixed(2)})
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
ServiceAccordionSection.displayName = "ServiceAccordionSection";

const ServicePageClient = ({
  vehicleData,
  motHistoryData,
  pricingData,
  registration,
}: ServicePageClientProps) => {
  const [openSections, setOpenSections] = useState<string[]>([
    "mot_and_servicing",
  ]);
  const router = useRouter();
  const {
    displayPrices,
    selectedServices,
    totalPrice,
    setInitialData,
    handleServiceSelection,
    setRegistration,
    isMotClass7Vehicle,
    vehicleData: contextVehicleData,
    motHistoryData: contextMotHistoryData,
  } = useBooking();

  // Initialize data immediately when component mounts
  useEffect(() => {
    if (vehicleData && pricingData) {
      setInitialData({ vehicleData, motHistoryData, pricingData });
      setRegistration(registration);
    }
  }, [
    vehicleData,
    motHistoryData,
    pricingData,
    registration,
    setInitialData,
    setRegistration,
  ]);

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(section)
        ? prevOpenSections.filter((s) => s !== section)
        : [...prevOpenSections, section]
    );
  }, []);

  const handleBooking = useCallback(() => {
    router.push("/confirm");
  }, [router]);

  // Show vehicle info immediately from props while context loads
  const currentVehicleData = contextVehicleData || vehicleData;
  const currentMotHistoryData = contextMotHistoryData || motHistoryData;
  const currentDisplayPrices = displayPrices || pricingData;

  // Memoize service sections to prevent unnecessary re-renders
  const serviceSections = useMemo(() => {
    if (!currentDisplayPrices) return null;

    return [
      {
        title: "MOT & Servicing",
        key: "mot_and_servicing",
        services: currentDisplayPrices.motAndServicing,
      },
      {
        title: "Additional Work",
        key: "additional_work",
        services: currentDisplayPrices.additionalWork,
      },
      {
        title: "Repairs",
        key: "repairs",
        services: currentDisplayPrices.repairs,
      },
      {
        title: "Addons",
        key: "addons",
        services: currentDisplayPrices.addons,
      },
    ];
  }, [currentDisplayPrices]);

  if (!currentVehicleData) {
    return <div>Loading services...</div>;
  }

  // Show MOT Class 7 Vehicle Modal
  if (isMotClass7Vehicle) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="border rounded-lg p-8 max-w-2xl mx-auto bg-red-50 border-red-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-200">
              <svg
                className="w-8 h-8 text-red-600"
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

            <h1 className="text-3xl font-bold mb-4 text-red-800">
              MOT-7 Vehicles are not supported
            </h1>

            {currentVehicleData?.Results?.VehicleDetails && (
              <div className="mb-4">
                <p className="text-base text-gray-700">
                  {
                    currentVehicleData.Results.VehicleDetails
                      .VehicleIdentification.DvlaMake
                  }{" "}
                  {
                    currentVehicleData.Results.VehicleDetails
                      .VehicleIdentification.DvlaModel
                  }
                </p>
              </div>
            )}

            <div className="mb-6 p-4 rounded-lg bg-red-100">
              <p className="text-sm text-red-700">
                We currently do not support MOT Class 7 vehicles (vehicles over
                3,000kg). Our service is designed for standard cars and light
                commercial vehicles only.
              </p>
            </div>

            <div className="text-gray-600 mb-6 space-y-2">
              <p className="font-semibold">MOT Class 7 vehicles include:</p>
              <ul className="text-sm space-y-1">
                <li>• Vehicles with a gross weight over 3,000kg</li>
                <li>• Large vans and commercial vehicles</li>
                <li>• Some motorhomes and specialist vehicles</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto pt-4 px-3.5">
        <div className="lg:grid lg:grid-cols-[65%_35%] lg:gap-4 space-y-4 lg:space-y-0">
          {/* Garage Details section - Shows first on mobile, stays in left column on desktop */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm lg:col-start-1 lg:row-start-1">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="w-full sm:w-1/4 text-center p-2">
                  <div className="relative inline-block">
                    <Image
                      alt="Ignition Auto Care"
                      loading="eager"
                      width={220}
                      height={220}
                      src='/logo.png'
                      className="mx-auto"
                      priority
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className="w-full sm:w-3/4 sm:pl-4">
                    <h1 className="text-2xl font-bold mt-0">
                      {garageDetails.name}
                    </h1>
                    <div className="flex items-center my-0.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            title={`${i + 1} star`}
                            className="text-yellow-400"
                          >
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              className="w-4 h-4"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path
                                fill="currentColor"
                                d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                              ></path>
                            </svg>
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm align-top">
                        180+ Reviews
                      </span>
                    </div>
                    
                    <div className="text-sm mb-1">
                      <span className="cursor-help font-semibold">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          className="w-4 h-4 inline-block align-[-0.125em] mr-1 text-[#0a65a3]"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                        >
                          <path
                            fill="currentColor"
                            d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64h-37.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM305 273L177 401c-9.4 9.4-24.6 9.4-33.9 0L79 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L271 239c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                          ></path>
                        </svg>
                        Trusted by 180+ customers — 5-star rated on Google and BookMyGarage!
                      </span>
                    </div>
                    <div className="text-sm mb-1">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="w-4 h-4 inline-block align-[-0.125em] mr-1 text-[#0a65a3]"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="currentColor"
                          d="M128 0c17.7 0 32 14.3 32 32v32h128V32c0-17.7 14.3-32 32-32s32 14.3 32 32v32h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64h48V32c0-17.7 14.3-32 32-32zM0 192h448v272c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16z"
                        ></path>
                      </svg>
                      <span>
                        Available
                        <span className="hidden md:inline"> from</span>:{" "}
                        {garageDetails.nextAvailable}
                      </span>
                    </div>
                    <div className="text-sm mb-1">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="w-4 h-4 inline-block align-[-0.2em] mr-1 text-[#0a65a3]"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                        ></path>
                      </svg>
                      <span>Free Pickup and Drop-off</span>
                    </div>
                    <div className="hidden sm:flex flex-col flex-wrap -ml-1">
                      {garageDetails.banners.map((banner, index) => (
                        <div
                          key={index}
                          className="flex text-sm pr-1.5 whitespace-pre-wrap"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            className="relative top-0.5 mr-1.5"
                          >
                            <path
                              d="M8.8699 0.547204C8.70932 0.212802 8.36999 0 7.99732 0C7.62466 0 7.28835 0.212802 7.12474 0.547204L5.17659 4.56916L0.825813 5.21364C0.462238 5.26836 0.159259 5.52372 0.047157 5.87333C-0.0649452 6.22293 0.0259484 6.60901 0.28651 6.86741L3.44355 10.0017L2.69822 14.431C2.63763 14.7958 2.78912 15.1667 3.08906 15.3825C3.38901 15.5984 3.78592 15.6257 4.11313 15.4524L8.00035 13.37L11.8876 15.4524C12.2148 15.6257 12.6117 15.6014 12.9116 15.3825C13.2116 15.1636 13.3631 14.7958 13.3025 14.431L12.5541 10.0017L15.7112 6.86741C15.9717 6.60901 16.0656 6.22293 15.9505 5.87333C15.8354 5.52372 15.5354 5.26836 15.1719 5.21364L10.8181 4.56916L8.8699 0.547204Z"
                              fill="url(#paint0_linear_995_940)"
                            ></path>
                            <defs>
                              <linearGradient
                                id="paint0_linear_995_940"
                                x1="7.9995"
                                y1="0"
                                x2="7.9995"
                                y2="15.5667"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#2F69A3"></stop>
                                <stop offset="1" stopColor="#41A0D0"></stop>
                              </linearGradient>
                            </defs>
                          </svg>
                          {banner}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <div className="flex flex-col h-full items-center justify-center my-auto">
                    <Image
                      src='/logo.png'
                      alt="silver tier badge"
                      className="scale-125"
                      priority
                      width={50}
                      height={50}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Shows second on mobile, right column on desktop */}
          <div className="bg-white border border-gray-200 rounded-lg lg:col-start-2 lg:row-start-1 lg:row-span-4">
            <div className="p-4">
              <VehicleInfo
                vehicleData={currentVehicleData}
                motHistoryData={currentMotHistoryData}
              />
              <button
                type="button"
                className="w-full mt-1.5 bg-brand-green text-white py-2 rounded font-bold cursor-pointer"
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div>

            {/* Service Selection UI */}
            <div className="border-t border-gray-200">
              {serviceSections?.map((section) => (
                <ServiceAccordionSection
                  key={section.key}
                  title={section.title}
                  sectionKey={section.key}
                  services={section.services}
                  isOpen={openSections.includes(section.key)}
                  toggleSection={toggleSection}
                  selectedServices={selectedServices}
                  handleServiceSelection={handleServiceSelection}
                  displayPrices={currentDisplayPrices}
                />
              ))}
            </div>

            <div className="p-4 flex w-full border-t">
              <svg
                aria-hidden="true"
                focusable="false"
                className="w-5 h-5 mr-2 text-[#2F69A3]"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24v-64h-24c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                ></path>
              </svg>
              <div>
                <strong className="text-[#2F69A3]">
                  No pre-payment required
                </strong>
                <div className="mt-0.5">
                  Select your services and pay nothing until the date of your
                  booking!
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-y-2 border-gray-200 p-4 flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold">Total price</span>
                <br />
                <span className="text-2xl font-bold">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                className="bg-brand-green text-white py-3 px-6 rounded-lg text-lg font-bold"
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg space-y-6">
             <div className="p-8 rounded-lg flex flex-col items-center space-y-6 text-center">
  {/* Header */}
  <h2 className="text-2xl font-semibold tracking-wide">
    Where to find us
  </h2>

  {/* Image Section */}
  <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg">
    <Image
      src="/location.png"
      alt="Ignition Autocare Location"
      width={800}
      height={600}
      className="object-cover"
    />
  </div>

  {/* Address Section */}
  <div className="space-y-2">
    <h3 className="text-xl font-bold">Ignition Autocare</h3>
    <p>Colorado Way,</p>
    <p>Castleford,</p>
    <p>WF10 4TA</p>
  </div>

  {/* Contact Info */}
  <div className="space-y-2">
    <div className="flex justify-center gap-4">
      <a
        href="https://instagram.com"
        className="text-white hover:text-gray-300 transition"
      >
        <i className="fab fa-instagram text-2xl"></i>
      </a>
      <a
        href="https://facebook.com"
        className="text-white hover:text-gray-300 transition"
      >
        <i className="fab fa-facebook text-2xl"></i>
      </a>
    </div>
    <p className="text-lg font-medium">01977 807050</p>
    <p className="text-lg">
      <a
        href="https://www.ignitionautocare.uk"
        className="underline hover:text-gray-300"
      >
        www.ignitionautocare.uk
      </a>
    </p>
  </div>
</div>

              <div>
               
                
              </div>
            </div>
          </div>

          {/* LEFT COLUMN CONTENT (About, Reviews, etc.) - Shows third on mobile */}
          <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
            {/* About Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <h3 className="text-2xl font-extrabold">
                  About {garageDetails.name}
                </h3>
              </div>
              <p className="whitespace-pre-line text-black font-light mb-2">
                {garageDetails.about}
              </p>
              <div className="flex flex-wrap mt-2">
                <div className="w-full sm:w-1/2 flex items-center mb-1">
                  <Check className="w-4 h-4 text-[#19659F] mr-2 flex-shrink-0" />
                  <span className="font-semibold text-black">
                    Brand-New State of the art workshop
                  </span>
                </div>
                <div className="w-full sm:w-1/2 flex items-center mb-1">
                  <Check className="w-4 h-4 text-[#19659F] stroke-2 mr-2 flex-shrink-0" />
                  <span className="font-semibold text-black">
                    Prestige dealership experience
                  </span>
                </div>
                <div className="w-full sm:w-1/2 flex items-center mb-1">
                  <Check className="w-4 h-4 text-[#19659F] stroke-2 mr-2 flex-shrink-0" />
                  <span className="font-semibold text-black">
                    Wheel Alignment Specialists
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            {/* <div className="bg-white p-6 rounded-lg">
              <h3 className="text-2xl font-extrabold">Customer Reviews</h3>
              <div className="mt-4 flex flex-col sm:flex-row gap-8">
                <div className="w-full sm:w-1/2 flex flex-col">
                  <div className="flex items-center text-gray-800">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-5 h-5 text-black" />
                      <span className="text-base font-extrabold ">
                        {garageDetails.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-0">
                      <Dot className="w-10 h-10 text-black -mr-2" />
                      <span className="text-base font-extrabold ">
                        {garageDetails.reviews} reviews
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-base font-semibold text-gray-800">
                      Reviews Summary
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">AI Generated</p>
                    <p className="text-sm text-gray-700 mt-2 pr-4 leading-relaxed">
                      {reviews.summary}
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-700">
                      Value
                    </span>
                    <RenderStars />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-700">
                      Staff helpfulness
                    </span>
                    <RenderStars />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-700">
                      Quality of work
                    </span>
                    <RenderStars />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-700">
                      Communication
                    </span>
                    <RenderStars />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Lazy load reviews slider */}
            <div className="my-8">  
              <Suspense
                fallback={
                  <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">Loading reviews...</div>
                  </div>
                }
              >
                <ReviewSlider />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePageClient;
