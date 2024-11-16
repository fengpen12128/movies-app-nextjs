import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CrawlParamsHoverCard({
  batchNum,
  crawlParams,
}: {
  batchNum: string;
  crawlParams: CrawlUrl[];
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {/* <Button variant="link">@nextjs</Button> */}
        <Link
          href={`/admin/crawlerManager?batchNum=${batchNum}`}
          className="text-blue-500 hover:underline dark:text-blue-400"
        >
          {batchNum}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[450px] max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>MaxPage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crawlParams.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.url}</TableCell>
                <TableCell>{item.maxPage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </HoverCardContent>
    </HoverCard>
  );
}
