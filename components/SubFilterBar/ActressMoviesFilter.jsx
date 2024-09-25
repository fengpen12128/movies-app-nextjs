"use client";

import { Flex } from '@radix-ui/themes';
import { MixerHorizontalIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import SelectItem from './SelectItem';
import { useFilterState } from './Common';

export default function ActressMoviesFilter() {
  const [collected, setCollected] = useFilterState('collected', 'all');
  const [download, setDownload] = useFilterState('download', 'all');
  const [single, setSingle] = useFilterState('single', 'all');

  const items = {
    collected: [
      { value: 'all', label: '全部', icon: <MixerHorizontalIcon /> },
      { value: 'true', label: '已收藏', icon: <StarFilledIcon /> },
      { value: 'false', label: '未收藏', icon: <StarIcon /> },
    ],
    download: [
      { value: 'all', label: '全部', icon: <MixerHorizontalIcon /> },
      { value: 'true', label: '已下载', icon: <StarFilledIcon /> },
      { value: 'false', label: '未下载', icon: <StarIcon /> },
    ],
    single: [
      { value: 'all', label: '全部', icon: <MixerHorizontalIcon /> },
      { value: 'true', label: '单体作品', icon: <StarFilledIcon /> },
      { value: 'false', label: '共演作品', icon: <StarIcon /> },
    ],
  };

  return (
    <Flex direction="row" gap="6" align="center" wrap="wrap">
      <SelectItem
        label="收藏状态"
        items={items.collected}
        value={collected}
        onChange={setCollected}
      />
      <SelectItem
        label="下载状态"
        items={items.download}
        value={download}
        onChange={setDownload}
      />
      <SelectItem
        label="作品类型"
        items={items.single}
        value={single}
        onChange={setSingle}
      />
    </Flex>
  );
}
