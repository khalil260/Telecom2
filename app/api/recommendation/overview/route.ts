import { NextResponse } from "next/server";
import { getRecommendationModelOverview } from "@/lib/recommendation";

export async function GET(): Promise<NextResponse> {
  const overview = await getRecommendationModelOverview();
  return NextResponse.json(overview);
}
