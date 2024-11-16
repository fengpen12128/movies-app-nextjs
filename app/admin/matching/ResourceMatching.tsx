"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MatchedResources from "./MatchedResources";
import UnmatchedResources from "./UnmatchedResources";

export default function ResourceMatching() {
  const [activeTab, setActiveTab] = useState<string>("matched");

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="matched">已匹配资源</TabsTrigger>
          <TabsTrigger value="unmatched">未匹配资源</TabsTrigger>
        </TabsList>

        <TabsContent value="matched">
          <MatchedResources />
        </TabsContent>

        <TabsContent value="unmatched">
          <UnmatchedResources />
        </TabsContent>
      </Tabs>
    </div>
  );
}
