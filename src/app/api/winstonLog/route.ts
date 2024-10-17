import { winstonLogSchema } from "@/lib/logger/clientLogger"
import { serverLogger } from "@/lib/logger/serverLogger"

import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const body = await request.json()
    const parsed = winstonLogSchema.safeParse(body)

    if (!parsed.success) {
        console.warn("Could not log with your custom logger")
        return new NextResponse("Invalid body", {
            status: 400,
            statusText: "Bad Request",
        })
    }

    //log
    serverLogger.log({
        level: parsed.data.level,
        message: parsed.data.message,
        ...parsed.data.object,
    })

    return new NextResponse(JSON.stringify(true))
}
