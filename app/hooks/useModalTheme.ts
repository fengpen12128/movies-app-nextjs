import { useEffect, useState } from "react";
import { useMoviesPreviewModalTheme } from "./useGlobalSettings";
export const useModalTheme = () => {

    const moviesPreviewModalTheme = useMoviesPreviewModalTheme();
    switch (moviesPreviewModalTheme) {
        case 'sample1':
            return 'rounded-[var(--radius-4)] border p-[var(--space-3)] bg-black/50 w-full sm:w-2/3 2xl:w-[60%] h-[80vh] sm:h-[95vh] overflow-hidden'
        case 'sample2':
            return 'rounded-[var(--radius-4)] border p-[var(--space-3)]  backdrop-blur-md w-full sm:w-2/3 2xl:w-[60%] h-[80vh] sm:h-[95vh] overflow-hidden'
        default:
            return 'rounded-[var(--radius-4)] border p-[var(--space-3)] bg-black/50 w-full sm:w-2/3 2xl:w-[60%] h-[80vh] sm:h-[95vh] overflow-hidden'
    }

}
