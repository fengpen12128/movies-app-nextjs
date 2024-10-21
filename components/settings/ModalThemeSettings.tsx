import { DropdownMenu, Text } from "@radix-ui/themes";
import { SquareIcon, CircleIcon } from "@radix-ui/react-icons";
import { FC } from "react";

interface ThemeSettingsProps {
  theme: string;
  onThemeChange: (value: string) => void;
}

const ModalThemeSettings: FC<ThemeSettingsProps> = ({
  theme,
  onThemeChange,
}) => {
  return (
    <>
      <DropdownMenu.Label>Movies Modal Theme</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={theme} onValueChange={onThemeChange}>
        <DropdownMenu.RadioItem value="sample1">
          <SquareIcon />
          <Text size="2" style={{ marginLeft: "8px" }}>
            样式一(bg-black/50)
          </Text>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="sample2">
          <CircleIcon />
          <Text size="2" style={{ marginLeft: "8px" }}>
            样式二 (backdrop-blur-md)
          </Text>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};

export default ModalThemeSettings;
