import { NextResponse } from "next/server";
import { deleteActressFav } from "@/app/actions/index";

export async function DELETE(req, { params }) {
  try {
    const { name } = params;
    const result = await deleteActressFav(name);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json([false, "删除失败"]);
  }
}
