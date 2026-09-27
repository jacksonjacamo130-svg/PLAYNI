import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.AYET_PUBLISHER_API_KEY && process.env.AYET_ADSLOT_ID),
    provider: "ayet",
    offers: []
  });
}
