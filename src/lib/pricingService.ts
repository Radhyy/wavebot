import { prisma } from "@/lib/prisma";
import { PLANS, PlanType, PlanDetail } from "@/lib/plans";

export interface PlanPriceConfig {
  price: number;
  priceDisplay: string;
}

export type PricingConfigMap = Record<string, PlanPriceConfig>;

const CONFIG_KEY = "PRICING_PLANS_CONFIG";

/**
 * Mengambil konfigurasi harga paket dinamis dari database (SystemConfig).
 * Jika belum diset, menggunakan nilai default dari PLANS di `src/lib/plans.ts`.
 */
export async function getDynamicPricing(): Promise<Record<PlanType, PlanDetail>> {
  let customConfig: PricingConfigMap = {};

  try {
    const row: any = await prisma.$queryRawUnsafe(
      `SELECT "value" FROM "SystemConfig" WHERE "key" = $1 LIMIT 1`,
      CONFIG_KEY
    );

    if (row && row.length > 0 && row[0]?.value) {
      customConfig = JSON.parse(row[0].value);
    }
  } catch (err) {
    console.error("Error reading pricing config from db:", err);
  }

  // Gabungkan ke model PLANS
  const resolvedPlans: Record<PlanType, PlanDetail> = { ...PLANS };

  (Object.keys(PLANS) as PlanType[]).forEach((key) => {
    if (customConfig[key]) {
      const customPrice = customConfig[key].price;
      resolvedPlans[key] = {
        ...resolvedPlans[key],
        price: customPrice,
        priceDisplay: `Rp ${customPrice.toLocaleString("id-ID")}`,
      };
    }
  });

  return resolvedPlans;
}

/**
 * Menyimpan pembaruan konfigurasi harga paket ke database Neon (SystemConfig).
 */
export async function updateDynamicPricing(newPrices: Record<string, number>): Promise<boolean> {
  try {
    const currentConfig: PricingConfigMap = {};

    Object.entries(newPrices).forEach(([key, price]) => {
      currentConfig[key] = {
        price: Number(price),
        priceDisplay: `Rp ${Number(price).toLocaleString("id-ID")}`,
      };
    });

    const jsonValue = JSON.stringify(currentConfig);

    await prisma.$executeRawUnsafe(
      `INSERT INTO "SystemConfig" ("key", "value", "updatedAt")
       VALUES ($1, $2, NOW())
       ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW()`,
      CONFIG_KEY,
      jsonValue
    );

    return true;
  } catch (err) {
    console.error("Error updating dynamic pricing in db:", err);
    return false;
  }
}
