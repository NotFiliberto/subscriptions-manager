"use server"

import { serverLogger } from "@/lib/logger/serverLogger"
import { subscriptionTypeSchema } from "@/lib/types/subscription-manager"
import { sendMailsInputSchema } from "@/lib/validations/mail"
import { z } from "zod"
import { mailSettings } from "../mail/config"
import { sendEmailV2, sendMultipleEmailsV2 } from "../mail/send"
import { action } from "../utils"
import { editSubscription } from "./subscriptions"

const sendMailSchema = z.object({
	mailType: z.union([z.literal("EXTENDED"), z.literal("NOTIFY")]),
	userUsername: z.string(),
	userPassword: z.string(),
	userEmail: z.string().array(),
	paymentDate: z.date().or(z.string()),
	expirationDate: z.date().or(z.string()),
	subscriptionType: subscriptionTypeSchema,
	subscriptionId: z.string(),
})
export type SendMailInput = z.infer<typeof sendMailSchema>

export const sendMail = action(sendMailSchema, async (input) => {
	const { mailType, ...rest } = input

	try {
		const mail = await sendEmailV2(input.mailType, {
			...rest,
		})
		serverLogger.log({
			level: "info",
			message: "Notification email sent to the user",
			object: { mail },
		})

		//edit subscription
		await editSubscription({
			subscriptionId: input.subscriptionId,
			userNotified: { title: "Si", notified: true },
		})

		return mail
	} catch (error) {
		serverLogger.log({
			level: "error",
			message: "Error while sending notification email",
			object: { input },
		})
		throw error
	}
})

export async function getEmailSettings() {
	const { password_sender, mail_sender, SMTPAuth, host, port, ...mainInfo } =
		mailSettings.mail_options
	return {
		mailInfo: { ...mainInfo, mail_sender },
	}
}

export const sendMultipleEmails = action(
	sendMailsInputSchema,
	async (input) => {
		console.log("sending emails...")
		return await sendMultipleEmailsV2(input)
	}
)
