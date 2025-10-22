import { GooglePlaceDetailsResponse, GoogleReview } from "@/types/googleReviews";
import { Review } from "@/data/reviews";

const GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/details/json";

export class GoogleReviewsService {
  private apiKey: string;
  private placeId: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
    this.placeId = process.env.PLACE_ID || "";

    if (!this.apiKey || !this.placeId) {
      throw new Error("Google Places API credentials are not configured");
    }
  }

  /**
   * Fetch reviews from Google Places API
   */
  async fetchReviews(): Promise<GoogleReview[]> {
    const url = `${GOOGLE_PLACES_API_URL}?place_id=${this.placeId}&fields=name,rating,reviews,user_ratings_total&key=${this.apiKey}`;

    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data: GooglePlaceDetailsResponse = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Google API status: ${data.status}`);
      }

      return data.result.reviews || [];
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      throw error;
    }
  }

  /**
   * Transform Google review to app Review format
   */
  private transformReview(googleReview: GoogleReview): Review {
    const date = new Date(googleReview.time * 1000);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    return {
      stars: googleReview.rating,
      rating: `${googleReview.rating}.0/5.0`,
      verified: true, // Google reviews are always verified
      title: this.generateTitle(googleReview.text),
      body: googleReview.text,
      recommend: googleReview.rating >= 4, // 4+ stars = recommend
      author: googleReview.author_name,
      date: formattedDate,
    };
  }

  /**
   * Generate a title from review text (first sentence or truncated)
   */
  private generateTitle(text: string): string {
    // Remove extra whitespace and newlines
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // Try to get first sentence
    const firstSentence = cleanText.split(/[.!?]/)[0].trim();
    const maxLength = 50;
    
    if (firstSentence.length <= maxLength) {
      return firstSentence;
    }
    
    // If first sentence is too long, truncate at word boundary
    const truncated = cleanText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "...";
  }

  /**
   * Get only 5-star reviews, transformed to app format
   */
  async getFiveStarReviews(limit: number = 6): Promise<Review[]> {
    const reviews = await this.fetchReviews();
    
    const fiveStarReviews = reviews
      .filter((review) => review.rating === 5)
      .slice(0, limit)
      .map((review) => this.transformReview(review));

    return fiveStarReviews;
  }

  /**
   * Get all reviews (any rating), transformed to app format
   */
  async getAllReviews(limit?: number): Promise<Review[]> {
    const reviews = await this.fetchReviews();
    
    const transformedReviews = reviews
      .map((review) => this.transformReview(review));

    return limit ? transformedReviews.slice(0, limit) : transformedReviews;
  }
}
