import { useLocalStorageState } from 'ahooks';
import { DEFAULT_GLOBAL_SETTINGS } from '@/app/globalSetting';

export function useGlobalSettings() {
    return useLocalStorageState<GlobalSettingsConfig>('GlobalSettings', {
        defaultValue: DEFAULT_GLOBAL_SETTINGS,
        listenStorageChange: true,
    });
}

export function useDisplayMode(): GlobalDisplayModeConfig {
    const [globalSettings] = useGlobalSettings();
    return globalSettings?.displayMode ?? DEFAULT_GLOBAL_SETTINGS.displayMode;
}

export function useMoviesPreviewModalTheme(): GlobalMoviesPreviewModalThemeConfig {
    const [globalSettings] = useGlobalSettings();
    return globalSettings?.moviesPreviewModalTheme ?? DEFAULT_GLOBAL_SETTINGS.moviesPreviewModalTheme;
}

export function useImageDisplay(): GlobalImageDisplayConfig {
    const [globalSettings] = useGlobalSettings();
    return globalSettings?.imageDisplay ?? DEFAULT_GLOBAL_SETTINGS.imageDisplay;
}


export function useCoverSetting(): GlobalCoverSettingConfig {
    const [globalSettings] = useGlobalSettings();
    return globalSettings?.coverSetting ?? DEFAULT_GLOBAL_SETTINGS.coverSetting;
}
