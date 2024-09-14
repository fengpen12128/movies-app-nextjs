import "@/styles/globals.css";
import "@/styles/siderbar.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
export const metadata = {
  title: "MoviesAdminNext",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="app">
      <Theme
        panelBackground="translucent"
        appearance="dark"
        accentColor="gray"
        grayColor="mauve"
        radius="small"
      >
        <main>{children}</main>
      </Theme>
    </body>
  </html>
);


export default RootLayout;
