declare interface MovieeAppStatistic {
    key?: string;
    title?: string;
    num?: number;
    icon?: string;
    progressValue?: number;
    progressLabel?: string;
    additionalInfo?: string;
}

declare interface PrefixCode {
    code: string;
    num: number;
    brand?: string;
}

type BrowsingHistoryChartData = {
    viewedAt: string;
    browserNum: number;
    collectedNum: number;
};
