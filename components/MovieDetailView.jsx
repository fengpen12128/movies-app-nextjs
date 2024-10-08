import { Card } from "@radix-ui/themes";
import MoviesDetail from "@/components/MoviesDetail/MoviesDetail";

const MovieDetailView = ({ open, clickedMovie, setOpen }) => {
  return (
    <div
      onClick={() => {
        setOpen(false);
      }}
      className="no-scrollbar fixed inset-0 bg-black bg-opacity-60 h-screen w-screen flex items-center justify-center z-50"
      style={{ display: open ? "flex" : "none" }}
    >
      <Card
        className="w-full sm:w-1/2 h-[80vh] sm:h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full overflow-y-auto no-scrollbar">
          {open && <MoviesDetail code={clickedMovie} />}
        </div>
      </Card>
    </div>
  );
};

export default MovieDetailView;
