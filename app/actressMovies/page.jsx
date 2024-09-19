import ActressMoviesClient from "./ActressMoviesClient";

export default function ActressMoviesPage({ searchParams }) {
  return <ActressMoviesClient {...searchParams} />;
}
