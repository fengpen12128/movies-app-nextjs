import { DropdownMenu, Text } from "@radix-ui/themes";
import { SquareIcon, CircleIcon } from "@radix-ui/react-icons";
import { FC } from "react";

interface ImageDisplaySettingsProps {
  imageDisplay: string;
  onImageDisplayChange: (value: string) => void;
}

const ModalThemeSettings: FC<ImageDisplaySettingsProps> = ({
  imageDisplay,
  onImageDisplayChange,
}) => {
  return (
    <>
      <DropdownMenu.Label>Image Display</DropdownMenu.Label>
      <DropdownMenu.RadioGroup
        value={imageDisplay}
        onValueChange={onImageDisplayChange}
      >
        <DropdownMenu.RadioItem value="MasonryGrid">
          <SquareIcon />
          <Text size="2" style={{ marginLeft: "8px" }}>
            Masonry Grid
          </Text>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="Grid">
          <CircleIcon />
          <Text size="2" style={{ marginLeft: "8px" }}>
            Grid
          </Text>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};

export default ModalThemeSettings;
