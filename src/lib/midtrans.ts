// @ts-ignore
import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});
