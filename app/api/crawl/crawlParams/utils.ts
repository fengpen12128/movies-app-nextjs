
export async function getSpiderStatus(jobId: string): Promise<CrawlStatus> {
    try {
        const response = await fetch(
            `${process.env.CRAWLER_SERVER}/spider-status/${jobId}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch spider status: ${response.statusText}`);
        }
        const data: { status: CrawlStatus } = await response.json();
        return data.status;
    } catch (error) {
        console.error("Error fetching spider status:", error);
        return "error";
    }
}

export function parseUrlParams(urls: string): UrlParams[] {
    return JSON.parse(urls).map(([url, maxPages]: [string, number]) => ({
        url,
        maxPages,
    }));
}

export async function processCrawlParams(parsedParams: any): Promise<CrawlParams> {
    const urlsArray = parseUrlParams(parsedParams.urls);

    let status: CrawlStatus;
    try {
        status = await getSpiderStatus(parsedParams._job);
    } catch (error) {
        console.error("Error fetching spider status:", error);
        status = "error";
    }

    return {
        jobId: parsedParams._job,
        mode: parsedParams.mode,
        urls: urlsArray,
        batchId: parsedParams.batch_id,
        status: status,
    };
}
