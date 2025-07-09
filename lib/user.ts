import { PrismaClient } from "@/app/generated/prisma";
import { pricingPlans } from "@/utils/constant";

const prisma = new PrismaClient();
export async function getPriceId(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email, status: "active" },
      select: { priceId: true },
    });

    return user?.priceId || null;
  } catch (error) {
    console.error("Error fetching user price ID:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const startOfTomorrow = new Date(startOfToday);
startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

export async function hasReachedUploadLimit(userId: string, email: string) {
  try {
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
  } finally {
    await prisma.$disconnect();
  }
}
