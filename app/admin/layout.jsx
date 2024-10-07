import AdminAside from "./AdminAside";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminAside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">{children}</div>
    </div>
  );
}
