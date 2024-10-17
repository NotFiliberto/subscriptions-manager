"use server"

import { DURATIONS } from "@/lib/global-variables"
import { clientLogger } from "@/lib/logger/clientLogger"
import { serverLogger } from "@/lib/logger/serverLogger"
import { SubscriptionType } from "@/lib/types/tvpanel"
import { omit, pick } from "@/lib/utils"
import {
	deleteSubscriptionSchema,
	editSubscriptionSchema,
} from "@/lib/validations/subscription"
import {
	AddSubscriptionForm,
	ExtendSubscriptionFormValues,
	addSubscriptionInputSchema,
	extendSubscriptionInputSchema,
} from "@/lib/validations/user"
import { prisma } from "@/server/prisma"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"
import { action } from "../utils"

export async function getAllSubcriptions() {
	revalidatePath("/dashboard/users")
	return await prisma.subscription.findMany({
		include: { user: true },
		orderBy: { expirationDate: "desc" },
	})
}

export async function addSubscription(userToAdd: AddSubscriptionForm) {
	const validatedFields = addSubscriptionInputSchema.safeParse(userToAdd)

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const userData = pick(userToAdd, ["email", "username", "password"])

		const subscriptionData = omit(userToAdd, [
			"email",
			"username",
			"password",
		])

		// calculate expiration date
		const paymentDate = subscriptionData.subscriptionPeriod.startDate
		const expirationDate = new Date(paymentDate)
		expirationDate.setMonth(
			paymentDate.getMonth() + subscriptionData.duration.months
		)

		// add to db
		const subscription = await prisma.subscription.create({
			data: {
				macAddress: subscriptionData.macAddress,
				notes: subscriptionData.notes,
				userNotificated: subscriptionData.userNotified.notified,
				type: subscriptionData.type.title,
				paymentDate: subscriptionData.subscriptionPeriod.startDate,
				expirationDate,
				user: {
					create: { ...userData },
				},
			},
		})

		// calcuate price for the subscirption
		const amount = DURATIONS.find(
			(d) =>
				d.months == subscriptionData.duration.months &&
				d.title.toLowerCase() ===
					subscriptionData.duration.title.toLowerCase()
		)!.price[subscriptionData.type.title]

		// add to history transaction
		await prisma.historyTransaction.create({
			data: {
				subscriptionId: subscription.id,
				amount,
			},
		})

		clientLogger({
			level: "info",
			message: "New subscription added",
			object: subscription,
		})
		revalidatePath("/dashboard")
		return subscription
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2002") throw new Error("CONFLICT")
		}
		throw new Error("INTERNAL_SERVER_ERROR")
	}
}

export async function extendSubscription(
	subscriptionToExtend: ExtendSubscriptionFormValues
) {
	const validatedFields =
		extendSubscriptionInputSchema.safeParse(subscriptionToExtend)

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		throw new Error(
			JSON.stringify({
				errors: validatedFields.error.flatten().fieldErrors,
			})
		)
	}

	try {
		// the new paymenent date became today
		const paymentDate = new Date()

		const expirationDate = new Date(
			subscriptionToExtend.user.subscription.expirationDate
		)
		expirationDate.setMonth(
			expirationDate.getMonth() + subscriptionToExtend.extendFor.months
		)

		const extendedSubscription = await prisma.subscription.update({
			where: {
				id: subscriptionToExtend.user.subscription.id,
			},
			data: {
				paymentDate, // today
				expirationDate, // previus + extended duration
				userNotificated: false, // reset indicator
			},
		})

		// calcuate price for the subscirption
		const amount = DURATIONS.find(
			(d) =>
				d.months == subscriptionToExtend.extendFor.months &&
				d.title.toLowerCase() ===
					subscriptionToExtend.extendFor.title.toLowerCase()
		)!.price[extendedSubscription.type as SubscriptionType]

		// add to history transaction
		await prisma.historyTransaction.create({
			data: {
				subscriptionId: extendedSubscription.id,
				amount,
			},
		})

		clientLogger({
			level: "info",
			message: "User subscription extended",
			object: { extendedSubscription },
		})

		revalidatePath("dashboard/users/subscriptions/extend")

		return { ...extendedSubscription }
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2002") throw new Error("CONFLICT")
		}
		throw new Error("INTERNAL_SERVER_ERROR")
	}
}

export const deleteSubscription = action(
	deleteSubscriptionSchema,
	async ({ subscriptionId }) => {
		try {
			const deletedSubscription = await prisma.subscription.delete({
				where: { id: subscriptionId },
			})
			serverLogger.log({
				level: "info",
				message: "Subscription deleted",
				object: { deletedSubscription },
			})
			revalidatePath("/dashboard/users")
			return deletedSubscription
		} catch (error) {
			serverLogger.log({
				level: "error",
				message: "Error while deleting subscription",
				object: { subscriptionId },
			})
			throw error
		}
	}
)

export const editSubscription = action(
	editSubscriptionSchema,
	async (input) => {
		try {
			const subscriptionEdited = await prisma.subscription.update({
				where: { id: input.subscriptionId },
				data: {
					macAddress: input.macAddress,
					notes: input.notes,
					type: input?.type?.title,
					paymentDate: input.subscriptionPeriod?.startDate,
					expirationDate: input.subscriptionPeriod?.endDate,
					userNotificated: input.userNotified?.notified,
					user: {
						update: {
							email: input.email,
							username: input.username,
							password: input.password,
						},
					},
				},
			})

			serverLogger.log({
				level: "info",
				message: "Subscription edited",
				object: { subscriptionEdited },
			})

			revalidatePath("/dashboard/users")
			return subscriptionEdited
		} catch (error) {
			serverLogger.log({
				level: "error",
				message: "while editing subscription",
				object: { input },
			})

			throw error
		}
	}
)
