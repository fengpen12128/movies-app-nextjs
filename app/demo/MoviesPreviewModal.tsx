"use client";

import { ReactNode } from "react";
import RenderPortal from "@/components/RenderPortal";
import { Card } from "@radix-ui/themes";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

export const MoviesPreviewModalCustom1: React.FC<ModalProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <RenderPortal>
      <div
        onClick={() => setOpen(false)}
        className="no-scrollbar fixed inset-0 bg-black/50 h-screen w-screen flex items-center justify-center z-40"
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

export const MoviesPreviewModalCustom2: React.FC<ModalProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <RenderPortal>
      <div
        style={{ display: open ? "flex" : "none" }}
        onClick={() => setOpen(false)}
        className="fixed inset-0  bg-black/50 backdrop-blur-md flex-center z-40"
      >
        <div
          className="rounded-[var(--radius-4)] border p-[var(--space-3)] backdrop-blur-md   w-full sm:w-2/3 2xl:w-[60%] h-[80vh] sm:h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[98%] sm:w-full h-full overflow-y-auto no-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </RenderPortal>
  );
};

// 总结一下： 使用bg-black 创建的背景最好不要太深，太深会覆盖改本来的背景，透明度高一点，使用bg-black/50 就差不多
// 对于内容框，可以使用bg-black/50, 模糊效果继承背景，在现在情况下，使用bg-black 会导致内部card 的背景完全变黑，所以最好使用backdrop-blur-md
