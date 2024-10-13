import { Card } from "@radix-ui/themes";
import { ReactNode } from "react";
import RenderPortal from "./RenderPortal";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

export const StackCardContentModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <div
      onClick={() => setOpen(false)}
      className="modal-content"
      style={{ display: open ? "flex" : "none" }}
    >
      <Card
        className="w-full sm:w-2/3 h-[80vh] sm:h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[98%] sm:w-full h-full overflow-y-auto no-scrollbar">
          {children}
        </div>
      </Card>
    </div>
  );
};

export const MoviesPreviewModal: React.FC<ModalProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <RenderPortal>
      <div
        onClick={() => setOpen(false)}
        className="modal-content z-50"
        style={{ display: open ? "flex" : "none" }}
      >
        <Card
          className=" w-full sm:w-2/3 2xl:w-[60%] h-[80vh] sm:h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[98%] sm:w-full h-full overflow-y-auto no-scrollbar">
            {children}
          </div>
        </Card>
      </div>
    </RenderPortal>
  );
};
