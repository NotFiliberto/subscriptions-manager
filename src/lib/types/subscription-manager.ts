import { getAllSubcriptions } from "@/server/actions/subscriptions"
import { getUsersWithMultipleSubscriptions } from "@/server/actions/users"
import { z } from "zod"

export type UsersOutput = Awaited<
	ReturnType<typeof getUsersWithMultipleSubscriptions>
>[number]

// create an array with users with only a subscription, if a user have multiple subscripiion it will be splitted into 2 objects
export type ComboBoxUserInfo = Omit<UsersOutput, "subscriptions">

export type ComboBoxUserSubscription = UsersOutput["subscriptions"][number]

export type ComboBoxUser = ComboBoxUserInfo & {
	subscription: ComboBoxUserSubscription
	diff: number
}

export type SubscriptionAndUser = Awaited<
	ReturnType<typeof getAllSubcriptions>
>[number]

export type SubscriptionAndUserWithDiff = SubscriptionAndUser & {
	diff: number
}

/*********************************************************************************************
 * Types for global variables
 *********************************************************************************************/

export const subscriptionTypeSchema = z.union([
	z.literal("VIP"),
	z.literal("VIP2"),
	z.literal("GUEST"),
])
export type SubscriptionType = z.infer<typeof subscriptionTypeSchema>

export type ServerInfo = {
	readonly title: SubscriptionType
}

// It creates an object where the keys are the subscription types defined by SubscriptionType
export type Pricing = {
	[name in (typeof subscriptionTypeSchema)["_input"]]: number
}

export type Duration = {
	title: string
	months: number
	price: number
}

export type UserNotified = {
	title: "Si" | "No"
	notified: boolean
}

export type SUBSCRIPTION_STATUS_COLORS = {
	bgColor: string
}
