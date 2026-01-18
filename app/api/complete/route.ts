import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id, type } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
    }

    const updatedQuiz = await (
      prisma[type as keyof typeof prisma] as any
    ).update({
      where: { id },
      data: { complete: true },
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
