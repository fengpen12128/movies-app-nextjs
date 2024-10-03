"use client";

import { Card } from "@radix-ui/themes";
import PageationInfo from "../PageationInfo";

const HomeFilter = () => {
  return (
    <Card>
      <div className="flex justify-end">
        <PageationInfo />
      </div>
    </Card>
  );
};

export default HomeFilter;
