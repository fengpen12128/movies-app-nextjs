import { useLocalStorageState } from "ahooks";
import getGlobalSettings from "@/app/globalSetting";

export function useDisplayMode() {
  const [globalSettings] = useLocalStorageState("GlobalSettings", {
    defaultValue: getGlobalSettings(),
    listenStorageChange: true,
  });

  return globalSettings?.displayMode;
}
