import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const importDataFromJson = async () => {
  try {
    // 读取 a.json 文件
    const rawData = await fs.readFile(
      "/Users/fengpan/Documents/crawl_source_data.json",
      "utf8"
    );
    const jsonData = JSON.parse(rawData);

    // 使用批量插入提高插入速度，每次批量插入1000条
    const batchSize = 1000;
    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize).map(item => ({
        data: item.data,
      }));

      await prisma.crawlSourceData.createMany({
        data: batch,
      });

      console.log(`批量数据插入成功: ${i + 1} - ${i + batch.length}`);
    }

    console.log("所有数据导入成功");
  } catch (error) {
    console.error("导入数据时出错:", error);
  } finally {
    await prisma.$disconnect();
  }
};

importDataFromJson();
