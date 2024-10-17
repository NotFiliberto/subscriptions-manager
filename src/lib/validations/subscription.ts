import { z } from "zod"
import { addSubscriptionInputSchema } from "./user"

export const deleteSubscriptionSchema = z.object({
	subscriptionId: z.string(),
	//user: userSchema,
})

export const editSubscriptionSchema = addSubscriptionInputSchema
	.partial({
		duration: true,
		macAddress: true,
		notes: true,
		userNotified: true,
		server: true,
		paymentDate: true,
		email: true,
		password: true,
		subscriptionPeriod: true,
		username: true,
		type: true,
	})
	.extend({ subscriptionId: z.string() })
	.transform((ess) => {
		const { duration, ...rest } = ess

		return {
			...rest,
			/* ...(paymentDate && {
                // rename property paypemnt date with subscriptinPeriod if paymentDate exists
                subscriptionPeriod: {
                    paymentaDate: paymentDate?.startDate,
                    expirationDate: paymentDate?.endDate,
                },
            }), */
		}
	})

export type EditSubscriptionInput = z.infer<typeof editSubscriptionSchema>
