import {
	DURATIONS,
	SUBSCRIPTION_TYPE,
	USER_NOTIFICATION_STATUS,
} from "@/lib/global-variables"
import { AddSubscriptionForm } from "@/lib/validations/user"

export const defaultAddSubscriptionInputData: Partial<AddSubscriptionForm> = {
	username: "sdf",
	duration: {
		title: DURATIONS[0].title,
		months: DURATIONS[0].months,
	},
	userNotified: {
		title: USER_NOTIFICATION_STATUS[0].title,
		notified: USER_NOTIFICATION_STATUS[0].notified,
	},
	email: "sdfs@gmail.it",
	password: "sdf",
	type: { title: SUBSCRIPTION_TYPE[0] },
	macAddress: "",
	subscriptionPeriod: {
		startDate: new Date(),
		endDate: new Date(),
	},
	notes: "",
}
