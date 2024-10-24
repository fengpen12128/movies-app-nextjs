import { CommonDisplay } from "@/components/MovieCardDisplay";

export default function RelationMovies({ relMovies }: { relMovies: Movie[] }) {
  return (
    <div className="w-full mt-10 bg-base-100 rounded  p-2">
      <div className="pb-2 flex justify-between">
        <div className="text-xl font-ibmPlexMono">She also starred in</div>
      </div>
      <CommonDisplay movies={relMovies} />
    </div>
  );
}
