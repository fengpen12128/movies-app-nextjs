import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

const getPaginationData = (totalCount, page, limit) => ({
  totalCount,
  current: page,
  pageSize: limit,
  totalPage: Math.ceil(totalCount / limit),
});

/**
 * 获取批次信息
 * @param {*} req
 * @returns
 */

export async function POST(req) {
  const { batchId, page = 1, limit = 30 } = await req.json();

  const skip = (page - 1) * limit;

  try {
    let results, count;

    if (batchId) {
      console.log("batchId is ", batchId);
      // 当 batchId 不为空时，使用 findUnique 查询单条记录
      results = await prisma.crawlStat.findUnique({
        where: { batchId },
      });
      count = results ? 1 : 0;
    } else {
      // 当 batchId 为空时，使用原来的分页查询逻辑
      const query = {
        skip,
        take: limit,
        orderBy: {
          startedTime: "desc",
        },
      };
      [results, count] = await Promise.all([
        prisma.crawlStat.findMany(query),
        prisma.crawlStat.count(),
      ]);
    }

    // 返回查询结果
    return NextResponse.json(
      {
        data: results,
        pagination: getPaginationData(count, page, limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
