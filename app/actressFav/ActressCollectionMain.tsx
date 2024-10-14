import ActressCard from "@/components/ActressCard";
import { getActressFavList } from "@/app/actions";

interface ActressCollectionMainProps {
  page?: number;
}

const ActressCollectionMain = async ({ page }: ActressCollectionMainProps) => {
  const {
    data: favActresses,
    code,
    msg,
  }: DataResponse<ActressFav[]> = await getActressFavList({ page });

  if (code !== 200) {
    return <div>Error: {msg}</div>;
  }

  if (favActresses!.length === 0) {
    return <div>No favorites yet</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {favActresses!.map((actress) => (
        <ActressCard
          key={actress.id}
          actressName={actress.actressName}
          avatarBase64={actress.avatarBase64 ?? ""}
        />
      ))}
    </div>
  );
};

export default ActressCollectionMain;
