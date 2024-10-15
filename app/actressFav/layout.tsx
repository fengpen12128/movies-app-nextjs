import SharedLayout from "../shared-layout/layout";
import { ReactNode } from "react";

export const metadata = {
  title: "Actress Collection",
};

interface ActressCollectionMainProps {
  children: ReactNode;
}

export default function ActressCollectionMain({ children }: ActressCollectionMainProps) {
  return <SharedLayout>{children}</SharedLayout>;
}
