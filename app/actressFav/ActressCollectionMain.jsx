import ActressCard from "@/components/ActressCard";
import { getActressFavList } from "../actions/index";

const ActressCollectionMain = async ({ page }) => {
  const { pagination, favActresses } = await getActressFavList({ page });

  return (
    <div className="grid grid-cols-4 gap-3">
      {favActresses?.map((actress) => (
        <ActressCard key={actress.id} {...actress} />
      ))}
    </div>
  );
};

export default ActressCollectionMain;
