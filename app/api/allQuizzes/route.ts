import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const flashcards = await prisma.quiz.findMany();

    if (!flashcards) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
