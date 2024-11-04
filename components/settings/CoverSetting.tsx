import { DropdownMenu, Text } from "@radix-ui/themes";
import { EyeOpenIcon, StackIcon } from "@radix-ui/react-icons";
import { FC } from "react";

interface CoverSettingProps {
  coverSetting: string;
  onCoverSettingChange: (value: string) => void;
}

const CoverSetting: FC<CoverSettingProps> = ({
  coverSetting,
  onCoverSettingChange,
}) => {
  return (
    <>
      <DropdownMenu.Label>卡片封面</DropdownMenu.Label>
      <DropdownMenu.RadioGroup
        value={coverSetting}
        onValueChange={onCoverSettingChange}
      >
        <DropdownMenu.RadioItem value="front">
          <EyeOpenIcon />
          <Text size="2" style={{ marginLeft: "8px" }}>
            正面
          </Text>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="demo">
          <StackIcon />
          <Text size="2" style={{ marginLeft: "8px" }}>
            全部
          </Text>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};

export default CoverSetting;
