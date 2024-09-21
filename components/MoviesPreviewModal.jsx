import { Card } from "@radix-ui/themes";

const MoviesPreviewModal = ({ open, setOpen, children }) => {
  return (
    <div
      onClick={() => {
        setOpen(false);
      }}
      className="no-scrollbar fixed inset-0 bg-black bg-opacity-60 h-screen w-screen flex items-center justify-center z-50"
      style={{ display: open ? "flex" : "none" }}
    >
      <Card
        className=" sm:w-1/2 h-[80vh] sm:h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[98%] sm:w-full h-full overflow-y-auto no-scrollbar">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default MoviesPreviewModal;
