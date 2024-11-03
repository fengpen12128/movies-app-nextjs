import { Card, CardContent } from "@/components/ui/card";
import PaginationInfo from "@/components/PaginationInfo";
import MagentPopover from "@/components/MagentPopover";
import FilterDropdown from "@/components/FilterDropdown";
import MoviesOrderSelect from "@/components/MoviesOrderSelect";
import { Calendar, Clock, Download, Star, Heart } from "lucide-react";
import ButtonListPopover from "../components/ButtonListPopover";
import { getTags } from "@/app/actions";

const HomeActionPanel: React.FC = async () => {
  const movieFilterOptions = [
    { value: "latest", label: "Latest", icon: <Clock size={16} /> },
    {
      value: "nd",
      label: "Not Download",
      icon: <Download size={16} />,
    },
    { value: "nc", label: "Not Collection", icon: <Heart size={16} /> },
    { value: "popular", label: "Popular", icon: <Star size={16} /> },
  ];

  const options = [
    {
      value: "releaseDate",
      label: "Release Date",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      showOn: ["home", "collection", "download"],
    },
    {
      value: "crawlDate",
      label: "Crawl Date",
      icon: <Clock className="mr-2 h-4 w-4" />,
      showOn: ["home", "collection", "download"],
    },
  ];
  const { data, code } = await getTags();

  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between m-3 p-0 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          <MagentPopover />
          <FilterDropdown filterOptions={movieFilterOptions} />
          <MoviesOrderSelect options={options} />

          <Card>
            <CardContent className="p-0 flex gap-2">
              {code === 200 &&
                data?.map((x) => (
                  <ButtonListPopover
                    key={x.title}
                    title={x.title}
                    options={x.options}
                    showSearch={x.title === "Prefix"}
                  />
                ))}
            </CardContent>
          </Card>
        </div>
        <div className="flex-shrink-0">
          <PaginationInfo />
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeActionPanel;
