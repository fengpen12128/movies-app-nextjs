import { getGroupedMoviesMode } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET(request) {
  const res = await getGroupedMoviesMode();
  return NextResponse.json(res);
}
