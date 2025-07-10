import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id parameter", { status: 400 });
  }

  try {
    const flashcards = await prisma.quiz.findFirst({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!flashcards) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
