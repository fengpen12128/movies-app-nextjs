import { Card } from "@radix-ui/themes";
import PaginationInfo from "@/components/PaginationInfo";
import MagentPopover from "@/components/MagentPopover";
import FilterDropdown from "@/components/FilterDropdown";
import OrderSelect from "@/components/MoviesOrderSelect";
import { Calendar, Clock } from "lucide-react";
import { Film, Tv, Star } from "lucide-react";

const movieFilterOptions = [
  { value: "movie", label: "Movies", icon: <Film size={16} /> },
  { value: "tv", label: "TV Shows", icon: <Tv size={16} /> },
  { value: "popular", label: "Popular", icon: <Star size={16} /> },
  { value: "latest", label: "Latest", icon: <Clock size={16} /> },
];

const homeOrderOptions = [
  {
    value: "releaseDate",
    label: "releaseDate",
    icon: <Calendar className="mr-2 h-4 w-4" />,
  },
  {
    value: "crawlDate",
    label: "crawlDate",
    icon: <Clock className="mr-2 h-4 w-4" />,
  },
];

const HomeActionPanel: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between">
        <div className="flex gap-6">
          <MagentPopover />
          <FilterDropdown filterOptions={movieFilterOptions} />
          <OrderSelect options={homeOrderOptions} />
        </div>
        <PaginationInfo />
      </div>
    </Card>
  );
};

export default HomeActionPanel;
