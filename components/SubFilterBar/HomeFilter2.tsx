import { Card, CardContent } from "@/components/ui/card";
import PaginationInfo from "@/components/PaginationInfo";
import MagentPopover from "@/components/MagentPopover";
import FilterDropdown from "@/components/FilterDropdown";
import MoviesOrderSelect from "@/components/MoviesOrderSelect";
import { Calendar, Clock } from "lucide-react";

const HomeFilter: React.FC = () => {
  const movieFilterOptions = [
    { value: "latest", label: "最新" },
    { value: "popular", label: "热门" },
    { value: "highRated", label: "高分" },
    { value: "recommended", label: "推荐" },
  ];

  const options = [
    {
      value: "releaseDate",
      label: "上映日期",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      showOn: ["home", "collection", "download"],
    },
    {
      value: "crawlDate",
      label: "爬取日期",
      icon: <Clock className="mr-2 h-4 w-4" />,
      showOn: ["home", "collection", "download"],
    },
  ];

  return (
    <Card>
      <CardContent className="flex justify-between m-3 p-0 ">
        <div className="flex items-center gap-3">
          <MagentPopover />
          <FilterDropdown filterOptions={movieFilterOptions} />
          <MoviesOrderSelect options={options} />
        </div>
        <PaginationInfo />
      </CardContent>
    </Card>
  );
};

export default HomeFilter;
