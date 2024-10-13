import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const allMoviesWithActress = await prisma.moviesCollection.findMany({
    include: {
      MovieInfo: {
        include: {
          actresses: {
            select: {
              id: true,
              actressName: true,
            },
          }, // 关联演员信息
          files: {
            where: {
              type: 2,
            },
            select: {
              path: true,
              onlineUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdTime: "desc", // 按收藏时间倒序
    },
  });
  console.log(allMoviesWithActress);
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
