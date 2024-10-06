import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

const getPaginationData = (totalCount, page, limit) => ({
  totalCount,
  current: page,
  pageSize: limit,
  totalPage: Math.ceil(totalCount / limit),
});

/**
 * 获取要下载的数据链接
 * @param {*} req
 * @param {*} param1
 * @returns
 */

export async function GET(req, { params }) {
  const { batchNum } = params;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;

  const skip = (page - 1) * 10;

  try {
    const query = {
      where: {
        batchId: {
          equals: batchNum,
        },
      },
      skip,
      take: 10,
    };
    // 查询 batchNum 对应的数据
    const [results, count] = await Promise.all([
      prisma.downloadUrls.findMany(query),
      prisma.downloadUrls.count({ where: query.where }),
    ]);

    // 返回查询结果
    return NextResponse.json(
      {
        data: results,
        pagination: getPaginationData(count, 1, 10),
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
