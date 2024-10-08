export interface PaginationData {
    totalCount: number;
    current: number;
    pageSize: number;
    totalPage: number;
}

export interface ProcessStats {
    total_size_str: string;
    total_size: string;
    start_time: string;
    end_time: string | null;
    duration: number | null;
    success_count: number;
    failure_count: number;
    total_count: number;
    status: 'not_started' | 'in_progress' | 'completed';
    total_records: number;
    percent: number;
}

export interface CrawlStat {
    id: number;
    jobId: string;
    batchId: string;
    executeType: string;
    newlyIncreasedNum: number;
    updatedNum: number;
    status: string;
    startedTime: Date;
    endTime: Date | null;
    urls: UrlParams[];
}


export interface CrawlStatResponse {
    data: CrawlStat[];
    pagination: PaginationData;
}


export interface UrlParams {
    url: string;
    maxPages: number;
}


export interface CrawlStatus {
    status: "running" | "pending" | "finished" | "not_found" | "error";
}

export interface CrawlParams {
    jobId: string;
    mode: string;
    urls: UrlParams[];
    batchId: string;
    status?: CrawlStatus['status'];
}
