"use client";

import { reviews as fallbackReviews, Review } from "@/data/reviews";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews?limit=30");
        const data = await response.json();

        if (data.success && data.reviews.length > 0) {
          setReviews(data.reviews);
          setError(null);
          console.log(`✅ Loaded ${data.reviews.length} Google reviews (5-star only)`);
        } else {
          console.warn("No Google reviews found, using fallback");
          setError("Using default reviews");
        }
      } catch (err) {
        console.error("Failed to fetch Google reviews:", err);
        setError("Failed to load reviews");
        // Keep using fallback reviews on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleReviews();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {error && process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 text-center">
          {error === "Using default reviews"
            ? "⚠️ Showing sample reviews (Google API not configured)"
            : "⚠️ Could not load Google reviews, showing samples"}
        </div>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 my-1">
          {reviews.map((review, index) => (
            <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 pl-4" key={`${review.author}-${index}`}>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md -ml-6 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={scrollPrev}
        aria-label="Previous review"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md -mr-6 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={scrollNext}
        aria-label="Next review"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default ReviewSlider;
