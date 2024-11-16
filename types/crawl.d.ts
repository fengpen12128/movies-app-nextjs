declare interface CrawlResponse {
    jobId: string,
    batchNum: string
}

declare interface CrawlUrl {
    url: string;
    save?: boolean;
    web?: string;
    maxPage?: number;
}

declare interface CrawlConfig {
    urls: CrawlUrl[];
}



declare interface CrawlStat {
    id: number;
    jobId: string;
    batchNum: string;
    executeType: string;
    newlyIncreasedNum: number;
    updatedNum: number;
    crawlStatus: CrawlStatus;
    transStatus: number;
    startedTime: Date;
    endTime: Date | null;
    urls?: CrawlUrl[];
}

declare type CrawlStatus = 'running' | 'pending' | 'finished' | 'not_found' | 'error';


declare interface UnDownloadNum {
    imageNum: number,
    videoNum: number,
}
