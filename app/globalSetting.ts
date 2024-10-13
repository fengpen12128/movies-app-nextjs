
export const DEFAULT_GLOBAL_SETTINGS: GlobalSettingsConfig = {
    theme: 'system',
    displayMode: 'normal',
};

export function getGlobalSettings(): GlobalSettingsConfig {
    return DEFAULT_GLOBAL_SETTINGS;
}
