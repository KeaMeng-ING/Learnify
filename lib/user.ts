import { pricingPlans } from "@/utils/constant";
import { prisma } from "@/lib/prisma";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const startOfTomorrow = new Date(startOfToday);
startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

export async function getPriceId(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn(`User with email ${email} not found.`);
      return null;
    } else if (user?.status === "inactive") {
      return null;
    }

    return user?.priceId || null;
  } catch (error) {
    console.error("Error fetching user price ID:", error);
    return null;
  }
  // Remove the finally block with $disconnect()
}

export async function hasReachedUploadLimit(userId: string, email: string) {
  try {
    if (!userId) {
      console.warn("No user ID provided.");
      return true;
    }

    const count = await prisma.quiz.count({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    });

    const priceId = await getPriceId(email);

    const isPro =
      pricingPlans.find((plan) => plan.priceId === priceId)?.id === "pro";

    const uploadLimit = isPro ? 1000 : 5;

    return count >= uploadLimit;
  } catch (error) {
    console.error("Error checking upload limit:", error);
    return true;
  }
  // Remove the finally block with $disconnect()
}

export async function getStatus(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user?.status || "inactive";
  } catch (error) {
    console.error("Error fetching user status:", error);
    return "inactive";
  }
}
