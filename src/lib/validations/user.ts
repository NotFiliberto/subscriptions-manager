import { SUBSCRIPTION_TYPE } from "@/lib/global-variables"
import { z } from "zod"
import { subscriptionTypeSchema } from "../types/tvpanel"
import { zodKeys } from "../utils"

const ServerPriceSchema = z.object(
	Object.fromEntries(SUBSCRIPTION_TYPE.map((key) => [key, z.number()])) // Create entries
) as z.ZodObject<{ [K in (typeof SUBSCRIPTION_TYPE)[number]]: z.ZodNumber }>

export const durationSchema = z.object({
	title: z.string(),
	months: z.number(),
})

/********************************************************* 
    Add User
*********************************************************/
export const addSubscriptionInputSchema = z.object({
	username: z.string().min(1, { message: "Insersci un username" }),
	password: z.string().min(1, { message: "Insersci una password" }),
	email: z.string().email({ message: "Insersci una mail valida" }),
	macAddress: z
		.string()
		.refine(
			(value) =>
				/^[0-9a-z]{1,2}([\.:-])(?:[0-9a-z]{1,2}\1){4}[0-9a-z]{1,2}$/gim.test(
					value
				),
			"Indirizzo MAC non valido"
		)
		.or(z.literal("")),
	duration: durationSchema,
	type: z.object({
		title: subscriptionTypeSchema,
	}),
	userNotified: z.object({
		title: z.literal("Si").or(z.literal("No")),
		notified: z.boolean(),
	}),
	subscriptionPeriod: z.object({
		startDate: z.date().or(z.string().pipe(z.coerce.date())),
		endDate: z.date().or(z.string().pipe(z.coerce.date())),
	}),
	notes: z.string(),
})

export type AddSubscriptionForm = z.infer<typeof addSubscriptionInputSchema>

export const userSchema = z.object({
	username: z.string().nonempty(),
	password: z.string().nonempty(),
	email: z.string().email(),
})

export type GetUserInput = z.infer<typeof userSchema>

export const getUserInputKeys = zodKeys(userSchema)

/********************************************************* 
    Extend line
*********************************************************/

export const extendSubscriptionInputSchema = z.object({
	extendFor: durationSchema,
	sendEmail: z.boolean(),
	user: z.object({
		username: z.string(),
		email: z.string().email(),
		subscription: z.object({
			paymentDate: z.date().or(z.string().pipe(z.coerce.date())),
			expirationDate: z.date().or(z.string().pipe(z.coerce.date())),
			id: z.string(),
		}),
	}),
})

export type ExtendSubscriptionFormValues = z.infer<
	typeof extendSubscriptionInputSchema
>
