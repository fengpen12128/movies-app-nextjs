'use server'

import prisma from "@/app/lib/prisma"
import dayjs from 'dayjs'

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
                icon: "film" // 添加适当的图标名称
            },
            {
                key: "actressNum",
                title: "Actress Num",
                num: actressNum,
                progressValue: 100,
                progressLabel: "100% increase",
                additionalInfo: "Actress Record Num",
                icon: "user" // 添加适当的图标名称
            },
            {
                key: "prefixNum",
                title: "Prefix Num",
                num: prefixNum,
                progressValue: 100,
                progressLabel: "100% increase",
                additionalInfo: "Prefix Record Num",
                icon: "tag" // 添加适当的图标名称
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

export async function getScheduleCrawlUrl({ page, pageSize = 20, web, uri }: { page: number, pageSize?: number, web?: string, uri?: string }): Promise<DataResponse<ScheduleCrawlUrl[]>> {
    try {
        const schedules = await prisma.scheduleCrawlUrl.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                ...(web && {
                    web: {
                        contains: web || ''
                    }
                }),
                ...(uri && {
                    uri: {
                        contains: uri || ''
                    }
                })
            }
        });
        return {
            code: 200,
            data: schedules as ScheduleCrawlUrl[]
        }
    } catch (error) {
        return {
            code: 500,
            msg: "获取数据失败",
            data: []
        }
    }
}

export async function addScheduleCrawlUrl(data: ScheduleCrawlUrl): Promise<DataResponse<void>> {
    try {
        // console.log('data_XXXXXXXX', data)
        // const exist = await prisma.scheduleCrawlUrl.findUnique({
        //     where: {
        //         url_uri: {
        //             url: data.url,
        //             uri: data.uri
        //         }
        //     }
        // })
        // if (exist) {
        //     return {
        //         code: 500,
        //         msg: "existed..."
        //     }
        // }

        await prisma.scheduleCrawlUrl.create({
            data: {
                url: data.url,
                uri: data.uri,
                web: 'Javdb',

            }
        });
        return {
            code: 200,
            msg: "添加成功"
        }
    } catch (error) {
        console.log(error)
        return {
            code: 500,
            msg: "添加失败"
        }
    }
}

export async function deleteScheduleCrawlUrl(ids: number[]): Promise<DataResponse<void>> {
    try {
        await prisma.scheduleCrawlUrl.deleteMany({
            where: { id: { in: ids } }
        });
        return {
            code: 200,
            msg: "删除成功"
        }
    } catch (error) {
        return {
            code: 500,
            msg: "删除失败"
        }
    }
}

export async function getDashboardChartData(): Promise<DataResponse<DashboardChartData>> {
    try {
        const [browsingStats, collectionStats]: any = await Promise.all([
            prisma.$queryRaw`
                SELECT DATE(viewed_at) as date, COUNT(*) as count
                FROM browsing_history
                GROUP BY DATE(viewed_at)
                ORDER BY DATE(viewed_at) ASC
            `,
            prisma.$queryRaw`
                SELECT DATE(created_time) as date, COUNT(*) as count
                FROM movies_collection
                GROUP BY DATE(created_time)
                ORDER BY DATE(created_time) ASC
            `
        ]);

        // 处理浏览历史数据
        const browserHistory: ChartData[] = browsingStats.map((stat: any) => ({
            xData: dayjs(stat.date).format('YYYY-MM-DD'),
            yData: Number(stat.count)
        }));

        // 处理收藏数据
        const collectionHistory: ChartData[] = collectionStats.map((stat: any) => ({
            xData: dayjs(stat.date).format('YYYY-MM-DD'),
            yData: Number(stat.count)
        }));


        return {
            code: 200,
            data: {
                browserHistory,
                collectionHistory
            }
        };
    } catch (error) {
        console.error("Error fetching browsing history and collection statistics:", error);
        return {
            code: 500,
            msg: "获取浏览历史和收藏统计数据失败",
            data: {
                browserHistory: [],
                collectionHistory: []
            }
        };
    }
}
