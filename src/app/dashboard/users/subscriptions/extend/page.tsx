import { getAllUsers } from "@/server/actions/users"
import ExtendSubscription from "./ExtendSubscription"

export default async function ExtendSubscriptionPage() {
	const users = await getAllUsers()

	if (!users) return <>error loading users...</>
	return <ExtendSubscription users={users} />
}
