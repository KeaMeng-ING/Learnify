import Stripe from "stripe";
import { PrismaClient } from "@/app/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  console.log("Checkout session completed", session);
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0]?.price?.id;
  const user = await currentUser();
  const userId = user?.id;

  if ("email" in customer && priceId) {
    const { email, name } = customer;

    await createOrUpdateUser({
      id: userId as string,
      email: email as string,
      fullName: name as string,
      customerId,
      priceId: priceId as string,
      status: "active",
    });

    await createPayment({
      session,
      priceId: priceId as string,
      userEmail: email as string,
    });
  }
}

async function createOrUpdateUser({
  id,
  email,
  fullName,
  customerId,
  priceId,
  status,
}: {
  id: string;
  email: string;
  fullName: string;
  customerId: string;
  priceId: string;
  status: "active" | "inactive";
}) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        customerId,
        priceId,
        status,
      },
      create: {
        id,
        email,
        fullName,
        customerId,
        priceId,
        status,
      },
    });

    console.log("User created or updated successfully", user);
  } catch (error) {
    console.error("Error creating or updating user", error);
  }
}

async function createPayment({
  session,
  priceId,
  userEmail,
}: {
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount_total, id, customer_email, status } = session;

    const payment = await prisma.payment.create({
      data: {
        amount: amount_total ?? 0,
        userEmail: userEmail,
        priceId: priceId,
        status: status as "paid" | "unpaid" | "pending",
        stripePaymentId: id, // Assuming 'id' is the Stripe payment ID
      },
    });
  } catch (error) {
    console.error("Error creating payment", error);
  }
}
