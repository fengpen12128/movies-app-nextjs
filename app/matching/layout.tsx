export const metadata = {
  title: "资源匹配",
};

import { ReactNode } from "react";

export default function CollectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-[87%] mx-auto h-screen ">
      <main className="pt-20">{children}</main>
    </div>
  );
}
