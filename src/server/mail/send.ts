import { SubscriptionType } from "@/lib/types/tvpanel"
import { SendMailFormInput } from "@/lib/validations/mail"
import _ from "lodash"
import nodemailer from "nodemailer"
import { smtpOptions } from "./config"
import { TVPanelMailParams, buildTemplate } from "./templates/buildTemplate"

type RecipientInfo = Pick<
	TVPanelMailParams,
	| "recipientName"
	| "recipientSurname"
	| "recipientCardNumber"
	| "recipientFiscalCode"
	| "recipientIban"
	| "recipientBic"
	| "providerMail"
>

// Replace with your SMTP credentials

export const sendEmailV2 = async (
	mailType: "NOTIFY" | "EXTENDED",
	info: {
		userUsername: string
		userPassword: string
		userEmail: string[]
		//subscription info
		subscriptionType: SubscriptionType
		paymentDate: Date | string
		expirationDate: Date | string
	}
) => {
	const transporter = nodemailer.createTransport({
		...smtpOptions,
	})

	if (info.subscriptionType !== "GUEST") info.subscriptionType = "VIP"

	const params = {}

	//build template
	let htmlTemplate: string = ""
	let emailSubject: string = ``

	if (mailType === "NOTIFY")
		htmlTemplate = await buildTemplate(
			{ ...params, TEXT_STR: "stringa" },
			"./src/server/mail/templates/notify.html"
		)
	else if (mailType === "EXTENDED")
		htmlTemplate = await buildTemplate(
			{ ...params, TEXT_STR: "stringa" },
			"./src/server/mail/templates/ExtendSubscription.html"
		)

	return await transporter.sendMail({
		to: info.userEmail,
		subject: emailSubject,
		html: htmlTemplate,
		from: process.env.NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS,
	})
}

export async function sendMultipleEmailsV2(data: SendMailFormInput) {
	const transporter = nodemailer.createTransport({
		...smtpOptions,
	})

	const recipients = _.uniq(data.to.map((r) => r.user.email))

	return await transporter.sendMail({
		bcc: recipients, // hide other recipients to other recipients
		subject: data.subject,
		from: data.from,
		text: data.content,
	})
}
