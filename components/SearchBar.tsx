"use client";

import { Button, Card, TextField } from "@radix-ui/themes";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import GlobalSettings from "@/components/settings/GlobalSettingsDropDown";
import _ from "lodash";
import { getTags } from "@/app/actions";

interface ExpandedOptions {
  [key: string]: boolean;
}

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useQueryState("search");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<OptionGroup[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | null>
  >({});
  const [expandedOptions, setExpandedOptions] = useState<ExpandedOptions>({});
  const optionsRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getFilterOptions = useCallback(async () => {
    try {
      const resp = await getTags();
      if (resp.code !== 200) {
        console.error("Failed to fetch filter options:", resp.msg);
        return;
      }

      const result = resp.data as OptionGroup[];
      setFilterOptions(result);
      if (!result) return;
      const initialExpandedState: ExpandedOptions = {};
      result.forEach((x: OptionGroup) => {
        initialExpandedState[x.title] = false;
      });
      setExpandedOptions(initialExpandedState);
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
      setFilterOptions([]);
    }
  }, []);

  useEffect(() => {
    getFilterOptions();
  }, [getFilterOptions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!searchKeyword) {
        router.push(pathname as any);
      } else {
        router.push(`/home?search=${encodeURIComponent(searchKeyword.trim())}`);
      }
    }
  };

  const handleFilterClick = useCallback(
    (groupTitle: string, option: string) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [groupTitle]: prev[groupTitle] === option ? null : option,
      }));
    },
    []
  );

  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      const validFilters = Object.fromEntries(
        Object.entries(selectedFilters).filter(([, value]) => value !== null)
      ) as Record<string, string>;
      const params = new URLSearchParams(validFilters).toString();
      router.push(`/home?${params}`);
    }
  }, [selectedFilters, router]);

  const toggleOptions = useCallback((title: string) => {
    setExpandedOptions((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  const shouldShowExpandButton = useCallback((title: string) => {
    const ref = optionsRefs.current[title];
    return ref && ref.scrollHeight > 35;
  }, []);

  return (
    <Card className="mt-10 mb-5 relative" size="4">
      <div className="absolute right-0 top-0 p-4">
        <GlobalSettings />
      </div>

      <div className="flex gap-2 items-center justify-center">
        <Button
          variant="surface"
          size="3"
          color="indigo"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>

        <TextField.Root
          size="3"
          placeholder="Search the code..."
          value={searchKeyword || ""}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-2/3"
          radius="medium"
        ></TextField.Root>
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: showFilters ? "1000px" : "0px" }}
      >
        <div className="space-y-6 pt-9">
          {filterOptions.map((x) => (
            <div key={x.title} className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-suse text-lg font-bold text-gray-300 mr-2">
                  {_.capitalize(x.title)}
                </label>
                {shouldShowExpandButton(x.title) && (
                  <Button
                    variant="ghost"
                    size="1"
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
                ref={(el: HTMLDivElement | null) => {
                  if (el) {
                    optionsRefs.current[x.title] = el;
                  }
                }}
                className="flex flex-wrap gap-3 transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedOptions[x.title] ? "1000px" : "35px",
                  overflowY: "hidden",
                }}
              >
                {x.options.map((option) => (
                  <Button
                    key={option}
                    color={
                      selectedFilters[x.title] === option ? "cyan" : "gray"
                    }
                    variant={
                      selectedFilters[x.title] === option ? "solid" : "outline"
                    }
                    size="1"
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
