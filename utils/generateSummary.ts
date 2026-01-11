"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import getGroqSummaryCreation from "@/utils/groqapi";

type SlideData = {
  heading: string;
  content: string;
};

type ParsedSummary = {
  title: string | null;
  overview: string | null;
  slides: SlideData[];
  keyTakeaway: string | null;
  minuteRead: number | null;
};

function parseSummaryText(summaryText: string): ParsedSummary {
  const lines = summaryText.split("\n").filter((line) => line.trim());
  const slides: SlideData[] = [];

  let title: string | null = null;
  let overview: string | null = null;
  let keyTakeaway: string | null = null;
  let minuteRead: number | null = null;
  let currentSlideHeading = "";
  let currentSlideContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("Title:")) {
      const titleMatch = line.match(/Title:\s*(.+)/);
      if (titleMatch) {
        title = titleMatch[1];
      }
    } else if (line.startsWith("Minute Read:")) {
      const minuteReadMatch = line.match(/Minute Read:\s*(\d+)/);
      if (minuteReadMatch) {
        minuteRead = parseInt(minuteReadMatch[1], 10);
      }
    } else if (line.startsWith("Overview:")) {
      const overviewMatch = line.match(/Overview:\s*(.+)/);
      if (overviewMatch) {
        overview = overviewMatch[1];
      }
    } else if (line.startsWith("Slide")) {
      // Save previous slide if exists
      if (currentSlideHeading && currentSlideContent.length > 0) {
        slides.push({
          heading: currentSlideHeading,
          content: currentSlideContent.join("\n"),
        });
        currentSlideContent = [];
      }

      // Extract new slide heading
      const slideMatch = line.match(/Slide \d+:\s*(.+)/);
      if (slideMatch) {
        currentSlideHeading = slideMatch[1];
      }
    } else if (line.startsWith("Key Takeaway:")) {
      // Save last slide before key takeaway
      if (currentSlideHeading && currentSlideContent.length > 0) {
        slides.push({
          heading: currentSlideHeading,
          content: currentSlideContent.join("\n"),
        });
        currentSlideContent = [];
        currentSlideHeading = "";
      }

      const takeawayMatch = line.match(/Key Takeaway:\s*(.+)/);
      if (takeawayMatch) {
        keyTakeaway = takeawayMatch[1];
      }
    } else if (currentSlideHeading) {
      // Add content to current slide (bullet points or sentences)
      if (line.startsWith("*") || line.startsWith("-") || line.length > 0) {
        currentSlideContent.push(line);
      }
    }
  }

  // Save last slide if not saved
  if (currentSlideHeading && currentSlideContent.length > 0) {
    slides.push({
      heading: currentSlideHeading,
      content: currentSlideContent.join("\n"),
    });
  }

  return { title, overview, slides, keyTakeaway, minuteRead };
}

export default async function generateSummary(text: string) {
  // Get the current user
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let summary;

  try {
    summary = await getGroqSummaryCreation(text);
  } catch (error) {
    throw new Error("Failed to generate summary content");
  }

  if (!summary) {
    throw new Error("Failed to generate summary content");
  }

  // Parse the quiz text into structured data
  const summaryData = parseSummaryText(summary);
  console.log("Parsed Summary Data:", summaryData);
  if (!summaryData.slides.length) {
    throw new Error("No summary generated from the provided text");
  }

  try {
    // Save to database with slides relation
    const savedSummary = await prisma.summary.create({
      data: {
        userId,
        title: summaryData.title || "Untitled Summary",
        overview: summaryData.overview,
        keyTakeaway: summaryData.keyTakeaway,
        minRead: summaryData.minuteRead,
        slides: {
          create: summaryData.slides.map((slide) => ({
            heading: slide.heading,
            content: slide.content,
          })),
        },
      },
    });

    return savedSummary;
  } catch (dbError) {
    console.error("Database save error:", dbError);
    throw new Error("Failed to save summary to database");
  } finally {
    await prisma.$disconnect();
  }
}
