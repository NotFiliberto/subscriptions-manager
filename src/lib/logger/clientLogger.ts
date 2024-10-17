import { z } from "zod"
import {
    acceptedLevelKeys,
    getBaseUrl,
    LOGGER_LEVELS,
    WINSTON_API_ENDPOINT,
} from "./config"

export const winstonLogSchema = z.object({
    level: z.string().refine((l) => acceptedLevelKeys.includes(l)),
    message: z.string(),
    object: z.any(),
})

export type LogApiBody = z.infer<typeof winstonLogSchema>

//typesafe function that you can use from react client components
export function clientLogger({
    level,
    message,
    object,
}: Omit<LogApiBody, "level"> & { level: keyof typeof LOGGER_LEVELS }) {
    winstonLogSchema.parse({ level, message, object })

    fetch(`${getBaseUrl()}/${WINSTON_API_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify({
            level,
            message,
            object,
        }),
    })
}
