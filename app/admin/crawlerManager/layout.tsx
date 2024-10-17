import React, { ReactNode } from "react";

export const metadata = {
  title: "Clawer",
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="mx-auto w-[70%]">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
