import { SubscriptionType } from "@/lib/types/subscription-manager"
import { renderFile } from "template-file"

export type SubscriptionManagerMailParams = {
	//subscription info
	subscriptionType: SubscriptionType
	paymentDate: Date | string
	expirationDate: Date | string
	subscriptionGeneratedString: string

	//pricing list
	deluxePlanText: string
	deluxePlanPrice: string
	basePlanText: string
	basePlanPrice: string

	// user info
	userUsername: string
	userPassword: string

	//misc
	additionalMessage?: string

	//payment info
	recipientName: string
	recipientSurname: string
	recipientCardNumber: string
	recipientFiscalCode: string
	recipientIban: string
	recipientBic: string
	providerMail: string
}

/* export type ExtendSubscriptionTemplateParams = {
    //subscription info
    subscriptionType: SubscriptionType
    paymentDate: Date | string
    expirationDate: Date | string
    subscriptionGeneratedString: string

    //pricing list
    deluxePlanText: string
    deluxePlanPrice: string
    basePlanText: string
    basePlanPrice: string

    // user info
    userUsername: string
    userPassword: string

    providerMail: string
} */

export async function buildTemplate<TemplateParams>(
	params: TemplateParams,
	templateFilePath: string
) {
	const message = await renderFile(templateFilePath, params as any)

	return message
}
