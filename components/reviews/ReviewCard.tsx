"use client";

import { useState } from "react";
import { Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { Review } from "@/data/reviews";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if review text is longer than 4 lines (approximately 200 characters)
  const maxChars = 200;
  const needsReadMore = review.body.length > maxChars;
  const displayedBody = needsReadMore && !isExpanded 
    ? review.body.slice(0, maxChars).trim() + "..." 
    : review.body;

  return (
    <Card className="h-full flex flex-col p-6 rounded-lg">
      <CardContent className="flex flex-col flex-grow gap-4 p-0">
        <div>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(review.stars)].map((_, i) => (
                <Star key={i} fill="currentColor" className="w-5 h-5" />
              ))}
            </div>
            <div className="ml-2 text-sm font-bold">{review.rating}</div>
            {review.verified && (
              <div className="ml-2 flex items-center text-blue-500">
                <span className="text-sm font-semibold">Verified</span>
                <CheckCircle2 className="ml-1 w-5 h-5" />
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-4">"{review.title}"</h3>
          <div className="text-gray-600 text-sm mt-2">
            <p className={!isExpanded ? "line-clamp-4" : ""}>{displayedBody}</p>
            {needsReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 font-semibold mt-1 text-sm transition-colors"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </div>
        <div className="mt-auto">
          {review.recommend && (
            <div className="flex items-center text-green-600 mt-4">
              <ThumbsUp className="w-5 h-5" />
              <span className="ml-2 font-bold">Would recommend</span>
            </div>
          )}
          <div className="mt-4">
            <p className="font-bold text-gray-800">{review.author}</p>
            <p className="text-sm text-gray-500">Review left: {review.date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
