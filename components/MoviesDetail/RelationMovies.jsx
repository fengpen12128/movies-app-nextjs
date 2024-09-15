import { Spinner } from "@radix-ui/themes";
import MoviesCard from "@/components/MoviesCard";
import { useRequest } from "ahooks";

const setToMinioMode = (data) => {
  data?.forEach((x) => {
    x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
  });
};

export default function RelationMovies({ actressNames = [], setCode }) {
  const { data: relMovies, loading } = useRequest(
    async () => {
      const resp = await fetch(`/api/movies/actressRel`, {
        method: "POST",
        body: JSON.stringify({ actressName: actressNames }),
      });
      const data = await resp.json();
      setToMinioMode(data);
      return data?.map((x) => ({
        ...x,
        releaseDate: x.releaseDate
          ? new Date(x.releaseDate).toISOString().split("T")[0]
          : null,
      }));
    },
    {
      refreshDeps: [actressNames],
    }
  );

  if (loading) {
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
      <div className="grid gap-3 mt-2 grid-cols-1 sm:grid-cols-3">
        {relMovies.map((x) => (
          <MoviesCard
            key={x.id}
            {...x}
            onClick={() => setCode(x.id)}
          ></MoviesCard>
        ))}
      </div>
    </div>
  );
}
