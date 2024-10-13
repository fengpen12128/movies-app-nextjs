// 基础接口
declare interface PaginationData {
    totalCount: number;
    current: number;
    pageSize: number;
    totalPage: number;
}

declare interface DataResponse<T> {
    data?: T;
    code: 200 | 500;
    msg?: string;
    pagination?: PaginationData;
}

// 电影相关接口
declare interface Tag {
    id: number;
    tagName: string;
}

declare interface Actress {
    id: number;
    actressName: string;
    avatarBase64?: string;
}

declare interface Movie {
    id: number;
    code: string;
    prefix?: string;
    duration?: string;
    rate?: number;
    rateNum?: number;
    releaseDate?: Date | null;
    releaseYear?: number | null;
    batchNum?: string;
    coverUrl?: string;
    collected?: boolean;
    downloaded?: boolean;
    tags?: Tag[];
    actresses?: Actress[];
    files?: MovieMedia[];
    createdTime?: Date;
    viewCount?: number;
    collectedTime?: Date;
    downloadTime?: Date;
    onClick?: () => void;
}

declare interface MovieMedia {
    id: number;
    path: string;
    type: number;
    useOnline?: boolean;
    onlineUrl?: string;
}

declare interface VideoResource {
    id: number;
    path: string;
    size: string;
    createdTime: Date;
}

declare interface MagnetLink {
    id: number;
    linkUrl: string | null;
    size: string | null;
    uploadTime: string | null;
}

// 查询参数接口
declare interface MovieQueryParams {
    page?: number;
    search?: string;
    prefix?: string;
    actressName?: string;
    years?: string | number;
    tags?: string;
    batchId?: string;
}

// 爬虫相关接口
declare interface ProcessStats {
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

declare interface UrlParams {
    url: string;
    maxPages: number;
}

declare interface CrawlStat {
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

declare interface CrawlStatResponse {
    data: CrawlStat[];
    pagination: PaginationData;
}

declare type CrawlStatus = 'running' | 'pending' | 'finished' | 'not_found' | 'error';

declare interface CrawlParams {
    jobId: string;
    mode: string;
    urls: UrlParams[];
    batchId: string;
    status?: CrawlStatus;
}

declare interface OptionGroup {
    title: string;
    options: string[];
}


declare interface ActressFav {
    id: number;
    actressName: string;
    createdTime: Date | null;
    avatarBase64: string | null | undefined;
}


declare interface GlobalSettingsConfig {
    theme: 'system' | 'light' | 'dark';
    displayMode: 'normal' | 'demo';
}


declare interface ActressGroupedMovies {
    actress: {
        id: number;
        actressName: string;
    };
    movies: Movie[] | Movie;
    grouped?: boolean;
    size: number;
    latestCollectedDate: Date;
}
