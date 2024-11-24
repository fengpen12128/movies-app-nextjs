import { NextRequest, NextResponse } from "next/server";

interface ScheduledUrl {
    url: string;
    maxPages: number;
}

interface ScheduledUrlsResponse {
    scheduledUrls: ScheduledUrl[];
}

export async function GET(req: NextRequest): Promise<NextResponse<ScheduledUrlsResponse | { error: string }>> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/scheduled-urls`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ScheduledUrlsResponse = await res.json();

        // 验证返回的数据结构
        if (!Array.isArray(data.scheduledUrls)) {
            throw new Error("Invalid response structure");
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching scheduled URLs:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}
