import { useMoviesPreviewModalTheme } from "./useGlobalSettings";
export const useModalTheme = () => {

    const moviesPreviewModalTheme = useMoviesPreviewModalTheme();
    switch (moviesPreviewModalTheme) {
        case 'sample1':
            return 'bg-black/50'
        case 'sample2':
            return 'backdrop-blur-md'
        default:
            return 'bg-black/50'
    }

}
