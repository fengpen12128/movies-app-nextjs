import { useLocalStorageState } from 'ahooks';
import { DEFAULT_GLOBAL_SETTINGS } from '@/app/globalSetting';

export function useGlobalSettings() {
    return useLocalStorageState<GlobalSettingsConfig>('GlobalSettings', {
        defaultValue: DEFAULT_GLOBAL_SETTINGS,
        listenStorageChange: true,
    });
}

export function useDisplayMode(): GlobalSettingsConfig['displayMode'] {
    const [globalSettings] = useGlobalSettings();
    return globalSettings?.displayMode ?? DEFAULT_GLOBAL_SETTINGS.displayMode;
}