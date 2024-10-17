import { createLogger, format, transports } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import {
    LOGGER_LEVELS,
    LOG_DIR,
    LOG_LEVEL,
    STATIC_FILENAME_STRING,
} from "./config"

const { combine, timestamp, json, colorize, align, simple, label } = format

const timeStampStyle = timestamp({
    format: "DD-MM-YYYY hh:mm:ss Z",
})

const consoleFormatStyle = combine(
    timeStampStyle,
    align(),
    colorize({ level: true }),
    simple()
)

const fileFormatStyle = combine(timeStampStyle, json())

export const serverLogger = createLogger({
    level: LOG_LEVEL,
    levels: LOGGER_LEVELS,

    transports: [
        new transports.Console({ format: consoleFormatStyle }),

        // daily logs
        new DailyRotateFile({
            dirname: LOG_DIR,
            filename: `${STATIC_FILENAME_STRING}-%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormatStyle,
        }),

        // append to all logs
        new transports.File({
            dirname: LOG_DIR,
            filename: `${STATIC_FILENAME_STRING}-combined.log`,
            format: fileFormatStyle,
        }),
    ],
})
