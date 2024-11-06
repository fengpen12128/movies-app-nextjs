import { useCoverSetting } from "./useGlobalSettings";
import { useState, useEffect } from "react";

export const useGridColumn = (pageGrid: boolean = false) => {
    const init = `grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-${pageGrid ? 4 : 3}`
    const [gridColumn, setGridColumn] = useState<string>(init);
    const coverSetting = useCoverSetting();

    // useEffect(() => {
    //     if (coverSetting === 'front') {
    //         if (pageGrid) {
    //             setGridColumn('grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6')
    //         } else {
    //             setGridColumn('grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4')
    //         }
    //     } else {
    //         setGridColumn('grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4')
    //     }
    // }, [coverSetting])

    return [gridColumn, coverSetting];
}
