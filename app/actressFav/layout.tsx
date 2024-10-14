import SharedLayout from "../shared-layout/layout";
import { ReactNode } from "react";

export const metadata = {
  title: "收藏演员",
};

interface ActressCollectionMainProps {
  children: ReactNode;
}

export default function ActressCollectionMain({ children }: ActressCollectionMainProps) {
  return <SharedLayout>{children}</SharedLayout>;
}
