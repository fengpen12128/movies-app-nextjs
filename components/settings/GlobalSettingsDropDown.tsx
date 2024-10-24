"use client";

import { Button, DropdownMenu } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import DisplayModeSettings from "./DisplayModeSettings";
import ModalThemeSettings from "./ModalThemeSettings";
import ImageDisplaySettings from "./ImageDisplaySettings";
import { useLocalStorage } from "usehooks-ts";
import { DEFAULT_GLOBAL_SETTINGS } from "@/app/globalSetting";
import Cookies from "js-cookie";
import { useEffect, useRef } from "react";

const GlobalSettings: React.FC = () => {
  const [globalSettings, setGlobalSettings, removeGlobalSettings] =
    useLocalStorage<GlobalSettingsConfig>(
      "GlobalSettings",
      DEFAULT_GLOBAL_SETTINGS
    );

  const isFirstRender = useRef(true);
  const prevSettingsRef = useRef<GlobalSettingsConfig | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      if (!Cookies.get("config")) {
        Cookies.set("config", JSON.stringify(globalSettings), { expires: 7 });
      }
      isFirstRender.current = false;
      return;
    }

    const prevSettings = prevSettingsRef.current;
    Cookies.set("config", JSON.stringify(globalSettings), { expires: 7 });

    // 检查是否有实际变化
    if (
      prevSettings &&
      prevSettings.displayMode !== globalSettings.displayMode
    ) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }

    prevSettingsRef.current = globalSettings;
  }, [globalSettings]);

  const handleThemeChange = (newTheme: string): void => {
    setGlobalSettings((prevSettings) => ({
      ...prevSettings,
      theme: newTheme as GlobalThemeConfig,
    }));
  };

  const handleDisplayModeChange = (newMode: string): void => {
    setGlobalSettings((prevSettings) => ({
      ...prevSettings,
      displayMode: newMode as GlobalDisplayModeConfig,
    }));
  };

  const handleModalThemeChange = (newTheme: string): void => {
    setGlobalSettings((prevSettings) => ({
      ...prevSettings,
      moviesPreviewModalTheme: newTheme as GlobalMoviesPreviewModalThemeConfig,
    }));
  };

  const handleImageDisplayChange = (newImageDisplay: string): void => {
    setGlobalSettings((prevSettings) => ({
      ...prevSettings,
      imageDisplay: newImageDisplay as GlobalImageDisplayConfig,
    }));
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
          <DisplayModeSettings
            displayMode={globalSettings.displayMode ?? "normal"}
            onDisplayModeChange={handleDisplayModeChange}
          />
          <DropdownMenu.Separator />
          <ModalThemeSettings
            theme={globalSettings.moviesPreviewModalTheme ?? "sample1"}
            onThemeChange={handleModalThemeChange}
          />
          <DropdownMenu.Separator />
          <ImageDisplaySettings
            imageDisplay={globalSettings.imageDisplay ?? "MasonryGrid"}
            onImageDisplayChange={handleImageDisplayChange}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default GlobalSettings;
