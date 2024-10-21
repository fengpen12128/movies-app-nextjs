import { useDisplayMode } from './useGlobalSettings';
import { useEffect, useState } from 'react';




export function useMediaUrls(movieMedia: MovieMedia[]): { videoUrl: string | undefined, coverUrl: string | undefined, introUrls: { id: number | string, path: string }[] } {
    const displayMode = useDisplayMode();
    const videoUrl = displayMode === "normal" ? movieMedia.find((x) => x.type === 3)?.path : process.env.NEXT_PUBLIC_DEMO_VIDEO;
    const coverUrl =
        displayMode === "normal"
            ? movieMedia.find((x) => x.type === 2)?.path
            : process.env.NEXT_PUBLIC_DEMO_IMAGE;
    const introUrls = movieMedia
        .filter((x) => x.type === 1)
        .map((x) => ({
            id: x.id,
            path: displayMode === "normal" ? x.path : process.env.NEXT_PUBLIC_DEMO_IMAGE,
        }));

    return { videoUrl, coverUrl, introUrls };
}

export function useShowMode(code: string, coverUrl: string): [string, string, boolean] {
    const displayMode = useDisplayMode();
    const [hydrated, setHydrated] = useState(false); // 用于标记客户端是否完成水合
    const [showCode, setShowCode] = useState<string>(code);
    const [showCoverUrl, setShowCoverUrl] = useState<string>(coverUrl);

    // 在客户端渲染完成后标记为已水合
    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {  // 确保在水合之后才更新状态
            setShowCode(displayMode === "normal" ? code : code.split("-")[1]);
            setShowCoverUrl(displayMode === "normal" ? coverUrl : process.env.NEXT_PUBLIC_DEMO_IMAGE);
        }
    }, [hydrated, displayMode]);

    return [showCode, showCoverUrl, hydrated];
}
