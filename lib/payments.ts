import Stripe from "stripe";
import { PrismaClient } from "@/app/generated/prisma";

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

  if ("email" in customer && priceId) {
    const { email, name } = customer;

    await createOrUpdateUser({
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

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  console.log("Subscription deleted", subscriptionId);

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update the user's status to inactive
    await prisma.user.update({
      where: { customerId: subscription.customer as string },
      data: { status: "cancelled" },
    });

    console.log(
      "User status updated to cancelled for subscription",
      subscriptionId
    );
  } catch (error) {
    console.error("Error handling subscription deletion", error);
    throw error;
  }
}

async function createOrUpdateUser({
  email,
  fullName,
  customerId,
  priceId,
  status,
}: {
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
