"use client";

import { Card, Flex } from '@radix-ui/themes';
import { MixerHorizontalIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import SelectItem from './SelectItem';
import { useFilterState } from './Common';

export default function DownloadFilter() {
  const [collected, setCollected] = useFilterState('collected', 'all');

  const items = [
    { value: 'all', label: '全部', icon: <MixerHorizontalIcon /> },
    { value: 'true', label: '已收藏', icon: <StarFilledIcon /> },
    { value: 'false', label: '未收藏', icon: <StarIcon /> },
  ];

  return (
    <Card className="my-3 p-4">
      <Flex direction="row" gap="6" align="center" wrap="wrap">
        <SelectItem
          label="收藏状态"
          items={items}
          value={collected}
          onChange={setCollected}
        />
      </Flex>
    </Card>
  );
}
