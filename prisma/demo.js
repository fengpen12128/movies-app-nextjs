import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.crawlStat.findUnique({
    select: { crawlParams: true },
    where: {
      batchId: "1728233393",
    },
  });
  console.log(result);
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e) => {
    console.error(e);
  });
