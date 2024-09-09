import prisma from "./prisma.js";

// const movies = await prisma.movieInfo.findMany({
//   skip: 0,
//   take: 20,
//   orderBy: {
//     releaseDate: "desc",
//   },
//   include: {
//     tags: {
//       include: {
//         tag: true,
//       },
//     },
//   },
// });

// const total = await prisma.movieInfo.count();
// const totalPages = Math.ceil(total / 20);
// let aa = JSON.stringify({
//   pagination: {
//     totalPages,
//     currentPage: 1,
//   },
// });

/////////////////
// const movie = await prisma.movieInfo.findUnique({
//   where: {
//     code: "IPX-777",
//   },
//   include: {
//     actresses: true, // 假设你在模型中定义了 movieInfo 和 actress 之间的关系为 actresses
//     magnetLinks: true,
//   },
// });

// const movies11 = await prisma.movieInfo.findUnique({
//   where: {
//     id: 202,
//   },
//   include: {
//     files: {
//       where: {
//         type: 2,
//       },
//     },
//     tags: true,
//   },
// });
// console.log(movies11);
// const collection = await prisma.MoviesCollection.findMany({
//     select: {
//         moviesCode: true
//     }
// });
// const moviesCodeArray = collection.map(item => item.moviesCode);
// console.log(moviesCodeArray);

// const actressRel = await prisma.movieInfo.findMany({
//     where: {
//       actresses: {
//         some: {
//           actressName: {
//             in: [],
//           },
//         },
//       },
//     },
//     select: {
//       id: true,
//       code: true,
//       releaseDate: true,
//       rate: true,
//       rateNum: true,
//       files: {
//         where: {
//           type: 2,
//         },
//         select: {
//           path: true,
//         },
//       },
//     },
//     take: 9,
//     orderBy: {
//       releaseDate: "desc",
//   },
// });

// actressRel.forEach(x => {
//     console.log(x)
//     //console.log(x.files)
// })

// const movies = await prisma.movieInfo.findMany({
//   take: 10,
//   orderBy: {
//     releaseDate: "desc",
//   },
//   where: {
//     code: {
//       contains: "ssis",
//       mode: "insensitive",
//     },
//   },
//   include: {
//     tags: true,
//     files: {
//       where: {
//         type: 2,
//       },
//     },
//   },
// });

// console.log(movies);
const collectedMoviesCodes = await prisma.moviesCollection.findMany({
  distinct: ["moviesCode"],
  select: {
    moviesCode: true,
  },
});

const movies = await prisma.movieInfo.findMany({
  orderBy: {
    releaseDate: "desc",
  },
  where: {
    code: {
      in: collectedMoviesCodes.map(movie => movie.moviesCode),
    },
  },
});

console.log(movies);
