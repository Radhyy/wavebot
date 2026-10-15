import { NextResponse } from "next/server";
import { getDynamicPricing } from "@/lib/pricingService";

export async function GET() {
  try {
    const plans = await getDynamicPricing();
    return NextResponse.json({
      success: true,
      plans: {
        FREE: {
          price: plans.FREE.price,
          priceDisplay: plans.FREE.priceDisplay,
        },
        PAKET_1: {
          price: plans.PAKET_1.price,
          priceDisplay: plans.PAKET_1.priceDisplay,
        },
        PAKET_2: {
          price: plans.PAKET_2.price,
          priceDisplay: plans.PAKET_2.priceDisplay,
        },
        PAKET_3: {
          price: plans.PAKET_3.price,
          priceDisplay: plans.PAKET_3.priceDisplay,
        },
      },
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
