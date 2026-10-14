import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  const devices = await prisma.device.findMany();
  console.log("DEVICES:");
  console.table(devices.map(d => ({ name: d.name, id: d.id, number: d.number, sessionId: d.sessionId })));
  
  const rules = await prisma.autoReply.findMany();
  console.log("RULES:");
  console.table(rules.map(r => ({ keyword: r.keyword, type: r.type, deviceId: r.deviceId, active: r.isActive })));
}

test().catch(console.error).finally(() => prisma.$disconnect());
