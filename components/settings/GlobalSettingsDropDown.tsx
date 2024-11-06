"use client";

import { Button, DropdownMenu } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import DisplayModeSettings from "./DisplayModeSettings";
import ModalThemeSettings from "./ModalThemeSettings";
import ImageDisplaySettings from "./ImageDisplaySettings";
import { useLocalStorageState } from "ahooks";
import { DEFAULT_GLOBAL_SETTINGS } from "@/app/globalSetting";
import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import CoverSetting from "./CoverSetting";

const GlobalSettings: React.FC = () => {
  const [globalSettings, setGlobalSettings] =
    useLocalStorageState<GlobalSettingsConfig>("GlobalSettings", {
      defaultValue: DEFAULT_GLOBAL_SETTINGS,
      listenStorageChange: true,
    });

  const isFirstRender = useRef(true);
  const prevSettingsRef = useRef<GlobalSettingsConfig | null>(null);

  useEffect(() => {
    // 如果 globalSettings 为 undefined，使用默认值
    const currentSettings = globalSettings || DEFAULT_GLOBAL_SETTINGS;

    if (isFirstRender.current) {
      if (!Cookies.get("config")) {
        Cookies.set("config", JSON.stringify(currentSettings), { expires: 7 });
      }
      isFirstRender.current = false;
      return;
    }

    const prevSettings = prevSettingsRef.current;
    Cookies.set("config", JSON.stringify(currentSettings), { expires: 7 });

    // 检查是否有实际变化
    if (
      prevSettings &&
      prevSettings.displayMode !== currentSettings.displayMode
    ) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }

    // 在存储之前确保值不为 undefined
    prevSettingsRef.current = currentSettings;
  }, [globalSettings]);

  const handleDisplayModeChange = (newMode: string): void => {
    setGlobalSettings((prevSettings) => {
      if (!prevSettings) return DEFAULT_GLOBAL_SETTINGS;
      return {
        ...DEFAULT_GLOBAL_SETTINGS,
        ...prevSettings,
        displayMode: newMode as GlobalDisplayModeConfig,
      };
    });
  };

  const handleModalThemeChange = (newTheme: string): void => {
    setGlobalSettings((prevSettings) => {
      if (!prevSettings) return DEFAULT_GLOBAL_SETTINGS;
      return {
        ...DEFAULT_GLOBAL_SETTINGS,
        ...prevSettings,
        moviesPreviewModalTheme:
          newTheme as GlobalMoviesPreviewModalThemeConfig,
      };
    });
  };

  const handleImageDisplayChange = (newImageDisplay: string): void => {
    setGlobalSettings((prevSettings) => {
      if (!prevSettings) return DEFAULT_GLOBAL_SETTINGS;
      return {
        ...DEFAULT_GLOBAL_SETTINGS,
        ...prevSettings,
        imageDisplay: newImageDisplay as GlobalImageDisplayConfig,
      };
    });
  };

  const handleCoverSettingChange = (newCoverSetting: string): void => {
    setGlobalSettings((prevSettings) => {
      if (!prevSettings) return DEFAULT_GLOBAL_SETTINGS;
      return {
        ...DEFAULT_GLOBAL_SETTINGS,
        ...prevSettings,
        coverSetting: newCoverSetting as GlobalCoverSettingConfig,
      };
    });
  };

  const settings = globalSettings || DEFAULT_GLOBAL_SETTINGS;

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            <GearIcon />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DisplayModeSettings
            displayMode={settings.displayMode}
            onDisplayModeChange={handleDisplayModeChange}
          />
          <DropdownMenu.Separator />
          <ModalThemeSettings
            theme={settings.moviesPreviewModalTheme}
            onThemeChange={handleModalThemeChange}
          />
          <DropdownMenu.Separator />
          <ImageDisplaySettings
            imageDisplay={settings.imageDisplay}
            onImageDisplayChange={handleImageDisplayChange}
          />
          <DropdownMenu.Separator />
          <CoverSetting
            coverSetting={settings.coverSetting}
            onCoverSettingChange={handleCoverSettingChange}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default GlobalSettings;
