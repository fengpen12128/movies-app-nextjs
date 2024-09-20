import { useState, useEffect } from "react";
import { useLocalStorageState } from "ahooks";
import getGlobalSettings from "@/app/globalSetting";

// export function useDisplayMode() {
//   const [globalSettings] = useLocalStorageState("GlobalSettings", {
//     defaultValue: {
//       theme: "system",
//       displayMode: "normal",
//     },
//     listenStorageChange: true,
//   });

//   const [displayMode, setDisplayMode] = useState(globalSettings?.displayMode);

//   useEffect(() => {
//     setDisplayMode(globalSettings?.displayMode);
//   }, [globalSettings?.displayMode]);

//   return displayMode;
// }

export function useDisplayMode() {
  const [globalSettings] = useLocalStorageState("GlobalSettings", {
    defaultValue: getGlobalSettings(),
    listenStorageChange: true,
  });

  return globalSettings?.displayMode;
}
