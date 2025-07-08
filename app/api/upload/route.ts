import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Convert file to buffer for R2 upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Parse PDF text using LangChain
    const loader = new PDFLoader(new Blob([buffer]));
    const docs = await loader.load();
    const combinedText = docs.map((doc) => doc.pageContent).join("\n");

    return NextResponse.json({
      success: true,
      filename,
      text: combinedText, // Return the extracted text
      pageCount: docs.length, // Return number of pages
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const flashcards = await prisma.quiz.findUnique({
      where: {
        id: "cmcsweblt0000wpz6ah3nao7v",
      },
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
