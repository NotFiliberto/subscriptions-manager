import {
	Duration,
	Pricing,
	SUBSCRIPTION_STATUS_COLORS,
	UserNotified,
} from "./types/tvpanel"

export const SUBSCRIPTION_TYPE = ["VIP", "VIP2", "GUEST"] as const

export const PRICING: Pricing = {
	VIP: 7,
	VIP2: 14,
	GUEST: 0,
}

export type Durations = (Omit<Duration, "price"> & { price: Pricing })[]

export const DURATIONS: Readonly<Durations> = [
	{
		title: "1 mese",
		months: 1,
		price: { VIP: PRICING.VIP, VIP2: PRICING.VIP2, GUEST: PRICING.GUEST },
	},
	{
		title: "12 mesi",
		months: 12,
		price: {
			VIP: PRICING.VIP * 12,
			VIP2: PRICING.VIP2 * 12,
			GUEST: PRICING.GUEST * 12,
		},
	},
]

export const USER_NOTIFICATION_STATUS: Readonly<UserNotified[]> = [
	{
		title: "No",
		notified: false,
	},
	{
		title: "Si",
		notified: true,
	},
]

export type SUBSCRIPTIONS_NAME = "expired" | "expiring" | "valid"

export const SUBSCRIPTIONS_STATUS: {
	[key in SUBSCRIPTIONS_NAME]: SUBSCRIPTION_STATUS_COLORS
} = {
	expired: {
		bgColor: "bg-red-400",
	},
	expiring: {
		bgColor: "bg-yellow-400",
	},
	valid: {
		bgColor: "bg-green-400",
	},
}

export const USER_TABLE_PAGINATION = {
	sizes: [5, 25, 100],
	defaultSize: 100,
}

export const PENDING_SUBSCRIPTION_DAYS = 7
