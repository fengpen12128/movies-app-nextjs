"use server";

import prisma from "@/app/lib/prisma";
import { deleteMinioFolders } from "@/app/lib/minio-utils";

export async function deleteMovies(ids: number | number[]): Promise<DataResponse<void>> {
    try {
        const idsArray = Array.isArray(ids) ? ids : [ids];

        console.log("idsArray....", idsArray);

        // 获取要删除的电影的 code
        const moviesToDelete = await prisma.moviesInfo.findMany({
            where: { id: { in: idsArray } },
            select: { code: true }
        });

        const movieCodes = moviesToDelete.map(movie => movie.code).filter((code): code is string => code !== null);

        // 使用事务确保数据一致性
        await prisma.$transaction(async (tx) => {
            // 软删除电影信息，设置 deletedAt 时间戳
            await tx.moviesInfo.updateMany({
                where: { id: { in: idsArray } },
                data: {
                    deletedAt: new Date()
                }
            });

            // 删除关联的文件信息
            await tx.filesInfo.deleteMany({
                where: { moviesId: { in: idsArray } }
            });

            // 删除关联的磁力链接
            await tx.magnetLinks.deleteMany({
                where: { moviesId: { in: idsArray } }
            });

            // 删除源数据
            await tx.crawlSourceData.deleteMany({
                where: { code: { in: movieCodes } }
            });
        });

        // 事务完成后，异步删除 MinIO 中的文件夹，不等待结果
        if (movieCodes.length > 0) {
            deleteMinioFolders(movieCodes).catch(error => {
                console.error("删除 MinIO 文件夹失败:", error);
            });
        }

        return {
            code: 200,
            msg: "删除成功"
        }
    } catch (error) {
        console.error("Delete failed:", error);
        return {
            code: 500,
            msg: `删除失败: ${error}`
        }
    }
}
