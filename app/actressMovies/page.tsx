import ActressMoviesClient from "./ActressMoviesClient";

interface ActressMoviesPageProps {
  searchParams: Record<string, any>;
}

export default function ActressMoviesPage({
  searchParams,
}: ActressMoviesPageProps) {
  return <ActressMoviesClient {...searchParams} />;
}
