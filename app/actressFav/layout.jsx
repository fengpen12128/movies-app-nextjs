import SharedLayout from "../shared-layout/layout";

export const metadata = {
  title: "收藏演员",
};

export default function ActressCollectionMain({ children }) {
  return (
    <>
      <SharedLayout>{children}</SharedLayout>
    </>
  );
}
