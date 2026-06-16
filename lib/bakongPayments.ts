import { KHQR, CURRENCY, COUNTRY, TAG } from "ts-khqr";

const result = KHQR.generate({
  tag: TAG.INDIVIDUAL,
  accountID: "keameng_ing@aclb",
  merchantName: "KEA MENG Ing",
  acquiringBank: "ACLEDA Bank",
  merchantCity: "Phnom Penh", // default 'Phnom Penh'
  currency: CURRENCY.KHR, // default KHR
  amount: 100,
  countryCode: COUNTRY.KH, // default KH
  expirationTimestamp: Date.now() + 1 * 120 * 1000,
  additionalData: {
    mobileNumber: "85517868882",
    billNumber: "INV-2022-12-25",
    storeLabel: "Learnify",
    terminalLabel: "012345",
    purposeOfTransaction: "Payment",
  },
  upiMerchantAccount: "",
});

console.log(result);

const khqrString =
  "00020101021229350016keameng_ing@aclb0211ACLEDA Bank520459995303116540410005802KH5912KEA MENG Ing6010Phnom Penh62660114INV-2022-12-250211855178688820308Learnify07060123450807Payment993400131769352090363011317693522103626304CA56";

const result2 = KHQR.parse(khqrString);

console.log(result2);

export async function verifyBakongPayment(transactionId: string) {
  try {
    // Call Bakong API to verify payment status
    const response = await fetch(
      `${process.env.BAKONG_API_URL}/api/v1/transaction/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BAKONG_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    const data = await response.json();
    return data.status === "completed" || data.status === "paid";
  } catch (error) {
    console.error("Error verifying Bakong payment:", error);
    return false;
  }
}
