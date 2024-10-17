import { getAllSubcriptions } from "@/server/actions/subscriptions"
import Users from "./Users"

export default async function ExtendSubscriptionPage() {
	const subscriptions = await getAllSubcriptions()

	return <Users subscriptions={subscriptions} />
	//return <>{subscriptions[0].expirationDate.toISOString()}</>
}
