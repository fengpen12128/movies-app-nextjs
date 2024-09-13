"use client";

import { Button, Card, TextField } from "@radix-ui/themes";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search") || "";
    setSearchKeyword(search);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!searchKeyword) {
        router.push(pathname);
      } else {
      router.push(`${pathname}?search=${searchKeyword}`);
      }
    }
  };

  return (
    <Card className="mt-10 mb-5" size="4">
      <div className="flex items-center justify-center">
        <div className="flex-grow  flex justify-center">
          <TextField.Root
            size="3"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-2/3"
            radius="medium"
            placeholder="Search the code..."
          ></TextField.Root>
        </div>

        <div className=" self-end">
          <Button
            variant="surface"
            size="sm"
            color="indigo"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters {showFilters}
            {showFilters ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        </div>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: showFilters ? "1000px" : "0px" }}
      >
        <div className="space-y-6 pt-9">
          {filterOptions.map((x) => (
            <div key={x.title} className=" space-y-2  ">
              <label className="font-suse font-medium text-gray-300 ">
                {x.title}
              </label>
              <div key={x.title} className="flex flex-wrap gap-2">
                {x.options.map((tag) => (
                  <>
                    <Button key={tag} color="cyan" variant="outline" size="sm">
                      {tag}
                    </Button>
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
