"use client";

import { useState, useEffect } from 'react';
import SidesBar from "@/components/SidesBar";
import SearchBar from "@/components/SearchBar";

export default function SharedLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768); // Assuming 768px as the mobile breakpoint
    };

    checkWidth(); // Check on initial render
    window.addEventListener('resize', checkWidth);

    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <div className={`px-4 sm:px-8 container mx-auto h-screen pt-6 overflow-auto ${!isMobile ? 'no-scrollbar' : ''}`}>
      <SidesBar />
      <SearchBar />
      <main>{children}</main>
    </div>
  );
}
