import { DropdownMenu, Text } from "@radix-ui/themes";
import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";

const ThemeSettings = ({ theme, onThemeChange }) => {
  return (
    <>
      <DropdownMenu.Label>主题设置</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={theme} onValueChange={onThemeChange}>
        <DropdownMenu.RadioItem value="light">
          <SunIcon />
          <Text size="2" style={{ marginLeft: '8px' }}>浅色</Text>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="dark">
          <MoonIcon />
          <Text size="2" style={{ marginLeft: '8px' }}>深色</Text>
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="system">
          <DesktopIcon />
          <Text size="2" style={{ marginLeft: '8px' }}>跟随系统</Text>
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </>
  );
};

export default ThemeSettings;
