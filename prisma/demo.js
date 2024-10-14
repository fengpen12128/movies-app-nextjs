import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const q = {
        select: {
            id: true,
            tags: true,
            duration: true,
            code: true,
            rate: true,
            rateNum: true,
            releaseDate: true,
            releaseYear: true,
            actresses: {
                select: {
                    id: true,
                    actressName: true
                }
            },
            files: {
                where: {
                    type: 2
                },
                select: {
                    path: true,
                    onlineUrl: true
                }
            }
        },
        orderBy: {
            releaseDate: "desc"
        },
        where: {
            actresses: {
                some: {
                    actressName: "水原みその"
                }
            },
            code: {
                notIn: ["HZGD-266"]
            },
            AND: [
                {
                    actresses: {
                        some: {
                            actressName: "水原みその"
                        }
                    }
                },
                {
                    actresses: {
                        some: {
                            NOT: {
                                actressName: "水原みその"
                            }
                        }
                    }
                }
            ]
        }
    }
    const movies = await prisma.moviesInfo.findMany(q);
    console.log(movies);
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
