import { Spinner } from "@radix-ui/themes";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen" style={{ transform: "translateY(-20%)" }}>
      <Spinner size="3" />
    </div>
  );
}
