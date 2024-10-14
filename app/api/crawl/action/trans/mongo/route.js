import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");

  if (start !== "true") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    // 连接到 MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("py_crawal"); // 替换为您的 MongoDB 数据库名称
    const collection = db.collection("movies_default"); // 替换为您的集合名称

    // 从 MongoDB 获取数据
    const mongoData = await collection.find({}).toArray();

    // 将数据插入到 CrawlSourceData 的 data 字段中
    for (const item of mongoData) {
      await prisma.crawlSourceData.create({
        data: {
          data: item, // 将 MongoDB 文档转换为 JSON 字符串
        },
      });
      console.log("insert => ", item.code);
    }

    await client.close();

    return NextResponse.json(
      { message: "Data transferred successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error transferring data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
