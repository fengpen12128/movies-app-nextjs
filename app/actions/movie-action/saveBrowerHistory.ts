"use server";

import prisma from "@/app/lib/prisma";


export async function saveBrowerHistory(movieCode: string) {
    const history = await prisma.browsingHistory.create({
        data: {
            movieCode,
        },
    });
    return history;
}
