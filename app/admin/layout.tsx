import React from "react";
import AdminAside from "./AdminAside";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AdminAside />
      <div className="flex h-full flex-col sm:mt-4 sm:pl-14">{children}</div>
    </div>
  );
}
