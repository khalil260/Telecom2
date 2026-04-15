import { NextResponse } from "next/server";
import { getClientConsumptionData } from "@/lib/data-source";

export async function GET(): Promise<NextResponse> {
  const rows = await getClientConsumptionData();

  const clients = [...new Set(rows.map((row) => row.clientId))].sort((a, b) =>
    a.localeCompare(b),
  );

  const months = [...new Set(rows.map((row) => row.month))].sort((a, b) =>
    a.localeCompare(b),
  );

  return NextResponse.json({ clients, months });
}
