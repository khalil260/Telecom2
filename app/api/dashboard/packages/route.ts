import { NextResponse } from "next/server";
import { buildPackagesDashboard } from "@/lib/analytics";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? undefined;

  const data = await buildPackagesDashboard(month);
  return NextResponse.json(data);
}
