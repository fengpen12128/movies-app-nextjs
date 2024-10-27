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
    prefix: string;
    num: number;
    maker?: string;
}

declare interface ChartData {
    xData: string;
    yData: number;
};

declare interface DashboardChartData {
    browserHistory: ChartData[];
    collectionHistory: ChartData[];
};
