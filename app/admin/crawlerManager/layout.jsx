import React from "react";

export const metadata = {
  title: "Clawer",
};

const Layout = ({ children }) => {
  return (
    <div className="mx-auto w-[70%]">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
