"use client";
import { ReactNode, useEffect, useState } from "react";
import * as Portal from "@radix-ui/react-portal";

const RenderPortal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById("app-main"));
  }, []);

  if (!container) return null;

  return <Portal.Root container={container}>{children}</Portal.Root>;
};

export default RenderPortal;
