export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetailsResponse {
  result: {
    name: string;
    rating: number;
    reviews: GoogleReview[];
    user_ratings_total: number;
  };
  status: string;
}
