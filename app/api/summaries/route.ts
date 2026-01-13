import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id parameter", { status: 400 });
  }

  try {
    const summary = await prisma.summary.findFirst({
      where: { id },
      include: {
        slides: true,
      },
    });

    if (!summary) {
      return new NextResponse("Summary not found", { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
