import { Card, Skeleton } from "@radix-ui/themes";

export default function SkeletonCard() {
  return (
    <Card>
      <div className="h-[300px] space-y-5 p-2">
        <Skeleton className="rounded-lg">
          <div className="h-52 rounded-lg bg-default-300"></div>
        </Skeleton>

        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      </div>
    </Card>
  );
}
