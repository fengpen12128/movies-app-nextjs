import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SCRIPT_BACKEND_ENDPOINT}/download-statistics`
        );
        const data: ProcessStats = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ msg: "An error occurred while fetching download statistics" }, { status: 500 });
    }
}
