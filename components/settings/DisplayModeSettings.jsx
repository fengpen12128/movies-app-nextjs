import { DropdownMenu, Text } from "@radix-ui/themes";
import { EyeOpenIcon, StackIcon } from "@radix-ui/react-icons";

const DisplayModeSettings = ({ displayMode, onDisplayModeChange }) => {
  return (
    <>
      <DropdownMenu.Label>显示模式</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={displayMode} onValueChange={onDisplayModeChange}>
        <DropdownMenu.RadioItem value="normal">
          <EyeOpenIcon />
          <Text size="2" style={{ marginLeft: '8px' }}>正常</Text>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="demo">
          <StackIcon />
          <Text size="2" style={{ marginLeft: '8px' }}>演示</Text>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};

export default DisplayModeSettings;
