import { Card } from "@radix-ui/themes";

const MoviesPreviewModal = ({ open, setOpen, children }) => {
  return (
    <div
      onClick={() => setOpen(false)}
      className="modal-content"
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
  );
};

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Button,
} from "@headlessui/react";

function MoviesPreviewModal_bak({ open, setOpen, children }) {
  return (
    <>
      <Dialog
        open={open}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setOpen(false)}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-1/2 rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              {children}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default MoviesPreviewModal;
