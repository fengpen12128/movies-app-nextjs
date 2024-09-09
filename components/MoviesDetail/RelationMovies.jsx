import { useEffect, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import MoviesCard from "../MoviesCard.jsx";
import { getImages } from "@/commonApi/commonApi.js";

const setToDemonstrationMode = (data, wallpapers) => {
  data?.forEach((x) => {
    x.coverUrl = `${process.env.NEXT_PUBLIC_TEST_PATH}/${
      wallpapers[Math.floor(Math.random() * wallpapers.length)]
    }`;
  });
};

const setToMinioMode = (data, wallpapers) => {
  data?.forEach((x) => {
    x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
  });
};

export default function RelationMovies({ actressNames = [], setCode }) {
  const [relMovies, setRelMovies] = useState([]);

  const getRelMovies = async () => {
    const [resp, wallpapers] = await Promise.all([
      fetch(`/api/movies/actressRel`, {
        method: "POST",
        body: JSON.stringify({
          actress: actressNames,
        }),
      }),
      getImages(),
    ]);
    const data = await resp.json();

    // 设置为演示模式
    setToMinioMode(data, wallpapers);

    const processedData = data?.map((x) => {
      const releaseDate = x.releaseDate
        ? new Date(x.releaseDate).toISOString().split("T")[0]
        : null;
      return { ...x, releaseDate };
    });
    setRelMovies(processedData);
  };

  useEffect(() => {
    getRelMovies();
  }, [actressNames]);

  if (!relMovies) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <div className="w-full mt-10 bg-base-100 rounded  p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl font-ma">她还出演过</div>
      </div>
      <div className="grid gap-3 mt-2 grid-cols-1 sm:grid-cols-4">
        {relMovies.map((x) => (
          <MoviesCard
            key={x.id}
            {...x}
            onClick={() => setCode(x.code)}
          ></MoviesCard>
        ))}
      </div>
    </div>
  );
}
