"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/app/lib/prisma";
import dayjs from "dayjs";
export async function getCrawlInfo() {
  const crawlInfo = await prisma.crawlInfo.findMany({
    where: {
      checked: "0",
    },
    orderBy: {
      createdTime: "desc",
    },
  });
  crawlInfo?.forEach((x) => {
    x.createdTime = dayjs(x.createdTime).format("YYYY-MM-DD HH:mm:ss");
  });
  return crawlInfo;
}

export async function updateCrawlInfo(id) {
  await prisma.crawlInfo.update({
    where: { id },
    data: { checked: "1" },
  });
  revalidatePath("/home");
}
