import { Inter, Quicksand, Playfair_Display, Karla, Lora, Source_Code_Pro, IBM_Plex_Mono } from "next/font/google";
export const inter = Inter({ subsets: ["latin"] });
export const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-quicksand",
});
export const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
});
export const karla = Karla({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
});

export const sourceCodePro = Source_Code_Pro({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
});

export const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: "400",
});
