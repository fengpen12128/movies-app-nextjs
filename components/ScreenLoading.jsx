import { Spinner } from "@radix-ui/themes";

const ScreenLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner size="3" />
    </div>
  );
};

export default ScreenLoading;
