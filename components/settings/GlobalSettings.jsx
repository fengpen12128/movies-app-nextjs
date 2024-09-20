"use client";

import Cookies from "js-cookie";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import ThemeSettings from "./ThemeSettings";
import DisplayModeSettings from "./DisplayModeSettings";
import { useLocalStorageState } from "ahooks";
import getGlobalSettings from "@/app/globalSetting";

const GlobalSettings = () => {
  const [globalSettings, setGlobalSettings] = useLocalStorageState(
    "GlobalSettings",
    {
      defaultValue: getGlobalSettings(),
      listenStorageChange: true,
    }
  );

  const handleThemeChange = (newTheme) => {
    setGlobalSettings({ ...globalSettings, theme: newTheme });
    Cookies.set(
      "USER_CONFIG",
      { ...globalSettings, theme: newTheme },
      { expires: 7, path: "/" }
    );
  };

  const handleDisplayModeChange = (newMode) => {
    setGlobalSettings({ ...globalSettings, displayMode: newMode });
    Cookies.set(
      "USER_CONFIG",
      { ...globalSettings, displayMode: newMode },
      { expires: 7, path: "/" }
    );
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            <GearIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <ThemeSettings
            theme={globalSettings.theme}
            onThemeChange={handleThemeChange}
          />
          <DropdownMenu.Separator />
          <DisplayModeSettings
            displayMode={globalSettings.displayMode}
            onDisplayModeChange={handleDisplayModeChange}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default GlobalSettings;
