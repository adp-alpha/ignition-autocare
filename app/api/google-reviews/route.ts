import { GoogleReviewsService } from "@/lib/google-reviews";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30");
    const onlyFiveStar = searchParams.get("fiveStarOnly") !== "true";

    const service = new GoogleReviewsService();
    const reviews = onlyFiveStar
      ? await service.getFiveStarReviews(limit)
      : await service.getAllReviews(limit);

    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in google-reviews API:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Google reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
