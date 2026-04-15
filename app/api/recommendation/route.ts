import { NextResponse } from "next/server";
import { getRecommendationForClient } from "@/lib/recommendation";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { error: "clientId query parameter is required" },
      { status: 400 },
    );
  }

  const recommendation = await getRecommendationForClient(clientId);

  if (!recommendation) {
    return NextResponse.json({ error: "client not found" }, { status: 404 });
  }

  return NextResponse.json(recommendation);
}
