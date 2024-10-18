"use server"

import { prisma } from "@/server/prisma"

import { ComboBoxUser } from "@/lib/types/subscription-manager"
import { calculateDiff } from "@/lib/utils"

export const getUsersWithMultipleSubscriptions = async () => {
	return await prisma.user.findMany({
		select: {
			username: true,
			email: true,
			subscriptions: {
				select: {
					expirationDate: true,
					paymentDate: true,
					id: true,
					notes: true,
				},
			},
		},
	})
}

export const getAllUsers = async () => {
	const usersWithMultipleSubscriptions =
		await getUsersWithMultipleSubscriptions()

	const users: ComboBoxUser[] = []

	usersWithMultipleSubscriptions.map((user) => {
		const { subscriptions, ...rest } = user

		subscriptions.map((s) => {
			const diff = calculateDiff(s.expirationDate)

			users.push({ ...rest, subscription: { ...s }, diff })
		})
	})

	return users
}
