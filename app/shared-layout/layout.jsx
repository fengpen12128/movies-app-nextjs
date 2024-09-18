import SidesBar from "@/components/SidesBar";
import SearchBar from "@/components/SearchBar";

export default function SharedLayout({ children }) {
  //   useEffect(() => {
  //     const checkWidth = () => {
  //       setIsMobile(window.innerWidth <= 768); // Assuming 768px as the mobile breakpoint
  //     };

  //     checkWidth(); // Check on initial render
  //     window.addEventListener("resize", checkWidth);

  //     return () => window.removeEventListener("resize", checkWidth);
  //   }, []);

  return (
    <div
      className={`px-4 sm:px-8 mx-auto   sm:w-[90%]   pt-6 sm:h-screen sm:overflow-auto`}
    >
      <SidesBar />
      <SearchBar />
      <main>{children}</main>
    </div>
  );
}
