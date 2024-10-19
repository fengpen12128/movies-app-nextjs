import { Card } from "@radix-ui/themes";
import PaginationInfo from "@/components/PaginationInfo";
import MagentPopover from "@/components/MagentPopover";
import FilterDropdown from "@/components/FilterDropdown";
import OrderSelect from "@/components/MoviesOrderSelect";
import { Calendar, Clock } from "lucide-react";
const movieFilterOptions = [
  { value: "latest", label: "最新" },
  { value: "popular", label: "热门" },
  { value: "highRated", label: "高分" },
  { value: "recommended", label: "推荐" },
];

const homeOrderOptions = [
  {
    value: "releaseDate",
    label: "上映日期",
    icon: <Calendar className="mr-2 h-4 w-4" />,
  },
  {
    value: "crawlDate",
    label: "爬取日期",
    icon: <Clock className="mr-2 h-4 w-4" />,
  },
];

const HomeFilter: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between">
        <div>
          <MagentPopover />
          <FilterDropdown filterOptions={movieFilterOptions} />
          <OrderSelect options={homeOrderOptions} />
        </div>
        <PaginationInfo />
      </div>
    </Card>
  );
};

export default HomeFilter;
