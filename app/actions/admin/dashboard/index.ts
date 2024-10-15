'use server'

import prisma from "@/app/lib/prisma"

export async function getMoiveeAppStatistic(): Promise<DataResponse<MovieeAppStatistic[]>> {
    try {
        const [moviesNumResult, actressNumResult, prefixNumResult] = await Promise.allSettled([
            prisma.moviesInfo.count(),
            prisma.actress.count(),
            prisma.moviesInfo.groupBy({
                by: ['prefix'],
                _count: true,
                where: {
                    prefix: {
                        not: null
                    }
                }
            })
        ]);

        const moviesNum = moviesNumResult.status === "fulfilled" ? moviesNumResult.value : 0;
        const actressNum = actressNumResult.status === "fulfilled" ? actressNumResult.value : 0;
        const prefixNum = prefixNumResult.status === "fulfilled" ? prefixNumResult.value.length : 0;

        const statisticData: MovieeAppStatistic[] = [
            {
                key: "moviesNum",
                title: "Movies Num",
                num: moviesNum,
                progressValue: 100,
                progressLabel: "100% increase",
                additionalInfo: "Movies Record Num",
            },
            {
                key: "actressNum",
                title: "Actress Num",
                num: actressNum,
                progressValue: 100,
                progressLabel: "100% increase",
                additionalInfo: "Actress Record Num",
            },
            {
                key: "prefixNum",
                title: "Prefix Num",
                num: prefixNum,
                progressValue: 100,
                progressLabel: "100% increase",
                additionalInfo: "Prefix Record Num",
            }
        ]

        return {
            code: 200,
            data: statisticData
        }
    } catch (error) {
        return {
            code: 500,
            msg: "获取数据失败",
        }
    }
}

export async function getPrefixStatistics(): Promise<DataResponse<PrefixCode[]>> {
    try {
        const prefixStats = await prisma.moviesInfo.groupBy({
            by: ['prefix'],
            _count: {
                prefix: true
            },
            orderBy: {
                _count: {
                    prefix: 'desc'
                }
            },
            where: {
                prefix: {
                    not: null
                }
            }
        });

        const formattedStats: PrefixCode[] = prefixStats.map(stat => ({
            code: stat.prefix || '',
            num: stat._count.prefix,
        }));

        return {
            code: 200,
            data: formattedStats
        };
    } catch (error) {
        console.error("Error fetching prefix statistics:", error);
        return {
            code: 500,
            msg: "获取前缀统计数据失败",
        };
    }
}
