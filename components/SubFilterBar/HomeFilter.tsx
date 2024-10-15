import { Card } from "@radix-ui/themes";
import PaginationInfo from "@/components/PaginationInfo";
import MagentPopover from "@/components/MagentPopover";

const HomeFilter: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between">
        <MagentPopover />
        <PaginationInfo />
      </div>
    </Card>
  );
};

export default HomeFilter;
