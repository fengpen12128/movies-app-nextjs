import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let res = await prisma.crawlStat.findMany();
  console.log(res);
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
