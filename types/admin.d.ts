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

declare interface ChartData {
    xData: string;
    yData: number;
};

declare interface DashboardChartData {
    browserHistory: ChartData[];
    collectionHistory: ChartData[];
};
