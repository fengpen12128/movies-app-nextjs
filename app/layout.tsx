import "@/styles/globals.css";
import "@/styles/siderbar.css";
import "@radix-ui/themes/styles.css";
import SidesBar from "@/components/SidesBar";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";

export const metadata = {
  title: "Index",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className="app">
      <Theme
        panelBackground="translucent"
        appearance="dark"
        accentColor="gray"
        grayColor="mauve"
        radius="small"
      >
        <SidesBar />
        <main>{children}</main>
      </Theme>
    </body>
  </html>
);

export default RootLayout;
