"use client";

import { Button, Card, TextField } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import GlobalSettings from "@/components/settings/GlobalSettings";
import _ from "lodash";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedOptions, setExpandedOptions] = useState({});
  const optionsRefs = useRef({});

  useRequest(
    async () => {
      const res = await fetch("/api/tags/list");
      return await res.json();
    },
    {
      onSuccess: (data) => {
        setFilterOptions(data);
        const initialExpandedState = {};
        data.forEach((x) => {
          initialExpandedState[x.title] = false;
        });
        setExpandedOptions(initialExpandedState);
      },
    }
  );

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
        router.push(`/home?search=${searchKeyword.trim()}`);
      }
    }
  };

  const handleFilterClick = (groupTitle, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupTitle]: prev[groupTitle] === option ? null : option,
    }));
  };

  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      fetchMoviesByFilters();
    }
  }, [selectedFilters]);

  const fetchMoviesByFilters = () => {
    const validFilters = Object.fromEntries(
      Object.entries(selectedFilters).filter(([key, value]) => value)
    );

    const params = new URLSearchParams(validFilters).toString();
    router.push(`/home?${params}`);
  };

  const toggleOptions = (title) => {
    setExpandedOptions((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const shouldShowExpandButton = (title) => {
    const ref = optionsRefs.current[title];
    return ref && ref.scrollHeight > 35;
  };

  return (
    <Card className="mt-10 mb-5 relative" size="4">
      <div className="absolute right-0 top-0 p-4 ">
        <GlobalSettings />
      </div>

      <div className="flex gap-4 items-center justify-center">
        <Button
          variant="surface"
          size="sm"
          color="indigo"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters {showFilters}
          {showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>

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
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: showFilters ? "1000px" : "0px" }}
      >
        <div className="space-y-6 pt-9">
          {filterOptions?.map((x) => (
            <div key={x.title} className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-suse text-xl font-bold text-gray-300 mr-2">
                  {_.capitalize(x.title)}
                </label>
                {shouldShowExpandButton(x.title) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleOptions(x.title)}
                  >
                    {expandedOptions[x.title] ? "Show Less" : "Show More"}
                    {expandedOptions[x.title] ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </Button>
                )}
              </div>
              <div
                ref={(el) => (optionsRefs.current[x.title] = el)}
                className="flex flex-wrap gap-3 transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedOptions[x.title] ? "1000px" : "35px",
                  overflowY: "hidden",
                }}
              >
                {x.options.map((option, index) => (
                  <Button
                    style={{ width: "70px" }}
                    key={option}
                    color={
                      selectedFilters[x.title] === option ? "cyan" : "gray"
                    }
                    variant={
                      selectedFilters[x.title] === option ? "solid" : "outline"
                    }
                    size="sm"
                    onClick={() => handleFilterClick(x.title, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
