import SidesBar from "@/components/SidesBar";
import SearchBar from "@/components/SearchBar";

export default function SharedLayout({ children }) {
  return (
    <div className="px-8 container mx-auto h-screen pt-6 no-scrollbar overflow-auto">
      <SidesBar />
      <SearchBar />
      <main>{children}</main>
    </div>
  );
}
