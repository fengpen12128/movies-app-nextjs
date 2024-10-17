"use client";

import { useState } from "react";
import { Tabs } from "@radix-ui/themes";
import MatchedResources from "./MatchedResources";
import UnmatchedResources from "./UnmatchedResources";

export default function ResourceMatching() {
  const [activeTab, setActiveTab] = useState<string>("matched");

  return (
    <div>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-4">
          <Tabs.Trigger value="matched">已匹配资源</Tabs.Trigger>
          <Tabs.Trigger value="unmatched">未匹配资源</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="matched">
          <MatchedResources />
        </Tabs.Content>

        <Tabs.Content value="unmatched">
          <UnmatchedResources />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
