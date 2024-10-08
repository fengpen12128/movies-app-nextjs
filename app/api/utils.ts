import { PaginationData } from "@/app/types/crawlerTypes";

export function getPaginationData(totalCount: number, page: number, limit: number): PaginationData {
    return {
        totalCount,
        current: page,
        pageSize: limit,
        totalPage: Math.ceil(totalCount / limit),
    };
}

interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
