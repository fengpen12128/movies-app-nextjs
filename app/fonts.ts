import { IBM_Plex_Mono, Zen_Maru_Gothic } from "next/font/google";
export const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin", "cyrillic"],
    weight: "400",
    variable: "--font-ibm-plex-mono",
});

export const zenMaruGothic = Zen_Maru_Gothic({
    subsets: ["cyrillic", "latin"],
    weight: "400",
    variable: "--font-zen-maru-gothic",
});
