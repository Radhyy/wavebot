export type PlanType = "FREE" | "PAKET_1" | "PAKET_2" | "PAKET_3";

export interface PlanDetail {
  id: PlanType;
  name: string;
  tagline: string;
  price: number;
  priceDisplay: string;
  period: string;
  messagesLimit: number;
  maxDevices: number;
  features: {
    restApi: boolean;
    autoReply: boolean;
    reminder: boolean;
    broadcast: boolean;
    aiChatbot: boolean;
    interactiveMenu: boolean;
  };
}

export const PLANS: Record<PlanType, PlanDetail> = {
  FREE: {
    id: "FREE",
    name: "Free Trial",
    tagline: "Free Plan",
    price: 0,
    priceDisplay: "Rp 0",
    period: "/selamanya",
    messagesLimit: 500,
    maxDevices: 9999, // Bebas nomor WhatsApp
    features: {
      restApi: true,
      autoReply: false,
      reminder: false,
      broadcast: false,
      aiChatbot: false,
      interactiveMenu: false,
    },
  },
  PAKET_1: {
    id: "PAKET_1",
    name: "Paket 1",
    tagline: "Plan Paket 1",
    price: 15000,
    priceDisplay: "Rp 15.000",
    period: "/bulan",
    messagesLimit: 1000,
    maxDevices: 9999, // Bebas nomor WhatsApp
    features: {
      restApi: true,
      autoReply: true,
      reminder: false,
      broadcast: false,
      aiChatbot: false,
      interactiveMenu: false,
    },
  },
  PAKET_2: {
    id: "PAKET_2",
    name: "Paket 2",
    tagline: "Plan Paket 2",
    price: 30000,
    priceDisplay: "Rp 30.000",
    period: "/bulan",
    messagesLimit: 4000,
    maxDevices: 9999, // Bebas nomor WhatsApp
    features: {
      restApi: true,
      autoReply: true,
      reminder: true,
      broadcast: true,
      aiChatbot: false,
      interactiveMenu: true,
    },
  },
  PAKET_3: {
    id: "PAKET_3",
    name: "Paket 3",
    tagline: "Plan Paket 3",
    price: 50000,
    priceDisplay: "Rp 50.000",
    period: "/bulan",
    messagesLimit: 10000,
    maxDevices: 9999, // Bebas nomor WhatsApp
    features: {
      restApi: true,
      autoReply: true,
      reminder: true,
      broadcast: true,
      aiChatbot: true,
      interactiveMenu: true,
    },
  },
};

export const ADMIN_PLAN: PlanDetail = {
  id: "PAKET_3",
  name: "Administrator Access",
  tagline: "Admin Unlimited",
  price: 0,
  priceDisplay: "Gratis / Admin",
  period: "/permanen",
  messagesLimit: 999999999, // Tanpa batas kuota pesan
  maxDevices: 9999, // Bebas nomor
  features: {
    restApi: true,
    autoReply: true,
    reminder: true,
    broadcast: true,
    aiChatbot: true,
    interactiveMenu: true,
  },
};

export function getPlanDetail(planKey?: string | null, userRole?: string | null): PlanDetail {
  if (userRole === "ADMIN" || planKey === "ADMIN") {
    return ADMIN_PLAN;
  }
  if (!planKey || !(planKey in PLANS)) {
    return PLANS.FREE;
  }
  return PLANS[planKey as PlanType];
}
