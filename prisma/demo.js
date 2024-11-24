import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const movieDataArray = await prisma.crawlSourceData.findMany({
        select: { data: true },
        where: { batchNum: "1731759331" },
    });
    console.log(movieDataArray);
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
