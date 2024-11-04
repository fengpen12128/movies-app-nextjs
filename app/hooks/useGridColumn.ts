import { useCoverSetting } from "./useGlobalSettings";
import { useState, useEffect } from "react";

export const useGridColumn = () => {

    const init = 'grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'

    const [gridColumn, setGridColumn] = useState<string>(init);

    const coverSetting = useCoverSetting();

    useEffect(() => {
        if (coverSetting === 'front') {
            setGridColumn('grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5')
        } else {
            setGridColumn('grid mt-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4')
        }
    }, [coverSetting])

    return gridColumn;
}
