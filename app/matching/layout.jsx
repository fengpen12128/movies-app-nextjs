import SidesBar from "@/components/SidesBar";

export default function CollectionLayout({ children }) {
  return (
    <div className="w-[87%] mx-auto h-screen ">
      <SidesBar />
      <main className="pt-20">{children}</main>
    </div>
  );
}
