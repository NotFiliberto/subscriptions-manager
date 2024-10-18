// Use LOG_DIR from env
export const LOG_DIR = process.env.LOG_DIR || "logs"
export const LOG_LEVEL = process.env.LOG_LEVEL || "info"
export const WINSTON_API_ENDPOINT = "api/winstonLog"
export const STATIC_FILENAME_STRING = "subscription-manager"

export const LOGGER_LEVELS = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6,
} as const satisfies Record<string, number>

// trick for typesafe logger levels
export const acceptedLevelKeys = Object.keys(LOGGER_LEVELS)

export function getBaseUrl() {
	if (typeof window !== "undefined")
		// browser should use relative path
		return ""
	if (process.env.VERCEL_URL)
		// reference for vercel.com
		return `https://${process.env.VERCEL_URL}`
	if (process.env.RENDER_INTERNAL_HOSTNAME)
		// reference for render.com
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
	// assume localhost
	return `http://127.0.0.1:${process.env.PORT ?? 3000}`
}
