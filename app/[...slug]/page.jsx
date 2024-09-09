// "use client";

// import { useEffect, useState } from "react";
// import { Pagination } from "@nextui-org/pagination";
// import { MacCloseButton } from "@/components/MoviesCloseButton";

// import MoviesCard from "@/components/MoviesCard";
// import MoviesDetail from "@/components/MoviesDetail";
// import { useSearchParams } from "next/navigation";
// const CardContent = ({
//   open = false,
//   movies,
//   setDetailMovies,
//   setSilderOpen,
// }) => {
//   const handleClickMoviesCard = (movies) => {
//     setDetailMovies(movies);
//     setSilderOpen(true);
//   };

//   const colClass = `grid gap-5  ${open ? "grid-cols-2" : "grid-cols-4"}`;
//   return (
//     <div className="flex flex-col transition-all duration-200 ease-in-out transform">
//       <section className={colClass}>
//         {movies.map((x) => (
//           <MoviesCard
//             onClick={() => handleClickMoviesCard(x)}
//             key={x._id}
//             coverUrl={"http://127.0.0.1:9000/demo/p1.jpg"}
//             code={x.code}
//             rate={x.score}
//             releaseDate={x.release_date}
//             viewCount={10}
//             collected={"1"}
//             downloaded={"1"}
//           ></MoviesCard>
//         ))}
//       </section>
//     </div>
//   );
// };

// const HomePageation = ({ currentPage, setCurrentPage, totalPages }) => (
//   <div className="p-3 m-8 flex-center">
//     <Pagination
//       page={currentPage}
//       onChange={setCurrentPage}
//       total={totalPages}
//     />
//   </div>
// );

// const Home = ({ params }) => {
//   const { slug } = params;
//   const [movies, setMovies] = useState([]);
//   const searchParams = useSearchParams();
//   const prefix = searchParams.get("prefix");

//   const [pageation, setPageation] = useState({
//     totalPages: 0,
//     currentPage: 1,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(1);
//   const [silderOpen, setSilderOpen] = useState(false);
//   const [detailMovies, setDetailMovies] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     const getMovies = async () => {
//       try {
//         const resp = await fetch(
//           `/api/movies/filter?prefix=${prefix}&page=${currentPage}`,
//           {
//             method: "GET",
//           }
//         );
//         const data = await resp.json();
//         setMovies(data.movies);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getMovies();
//   }, [currentPage, prefix]);

//   const displayCol = `px-8 h-screen pt-6 no-scrollbar overflow-auto ${
//     silderOpen ? "w-1/2" : ""
//   }`;

//   return (
//     <>
//       <h1>this is filter page</h1>
//       <div className={displayCol}>
//         <CardContent
//           open={silderOpen}
//           setDetailMovies={setDetailMovies}
//           setSilderOpen={setSilderOpen}
//           movies={movies}
//         />
//         <HomePageation
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           totalPages={pageation.totalPages}
//         />
//       </div>

//       <div
//         className={`absolute top-4 bottom-4 right-0 flex flex-col bg-base-300  shadow-2xl rounded-lg transition-all duration-200 ease-in-out transform ${
//           silderOpen ? " w-1/2 p-2" : "w-0"
//         }`}
//       >
//         {silderOpen && (
//           <div className="flex item-center gap-4 p-3">
//             {/* 关闭按钮区域 */}
//             <MacCloseButton onClick={() => setSilderOpen(false)} />
//           </div>
//         )}

//         <div className="overflow-y-auto no-scrollbar">
//           {silderOpen && (
//             <MoviesDetail
//               links={detailMovies.links}
//               mediaUrls={detailMovies.media_urls}
//               movies={{ ...detailMovies }}
//               actress={detailMovies.actress}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
