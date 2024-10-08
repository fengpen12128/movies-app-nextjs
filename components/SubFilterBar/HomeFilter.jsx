"use client";

import { Card } from "@radix-ui/themes";
import PaginationInfo from "@/components/PaginationInfo";

const HomeFilter = () => {
  return (
    <Card>
      <div className="flex justify-end">
        <PaginationInfo />
      </div>
    </Card>
  );
};

export default HomeFilter;
