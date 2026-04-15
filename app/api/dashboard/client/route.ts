import { NextResponse } from "next/server";
import { buildClientBehavior } from "@/lib/analytics";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { error: "clientId query parameter is required" },
      { status: 400 },
    );
  }

  const data = await buildClientBehavior(clientId);
  if (!data) {
    return NextResponse.json({ error: "client not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
