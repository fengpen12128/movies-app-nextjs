import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const res = await fetch(`${process.env.CRAWLER_SERVER}/scheduled-urls`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
