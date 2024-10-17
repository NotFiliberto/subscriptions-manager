import { SubscriptionAndUser } from "@/lib/types/tvpanel"
import { calculateDiff } from "@/lib/utils"
import { ListItem } from "../common/listItem"

export type DeleteSubscriptionInfoProps = {
	subscription: SubscriptionAndUser
}

export default function DeleteSubscriptionInfo({
	subscription,
}: DeleteSubscriptionInfoProps) {
	return (
		<dl className="divide-y divide-gray-100">
			<ListItem title="Username" content={subscription.userUsername} />
			<ListItem
				title="Indirizzo email"
				content={subscription.userEmail}
			/>
			<ListItem title="Server" content={subscription.type} />
			<ListItem
				title="Notificato"
				content={subscription.userNotificated ? <>Si</> : <>No</>}
			/>
			{subscription.macAddress && (
				<ListItem
					title="Indirizzo Mac"
					content={subscription.macAddress}
				/>
			)}

			{subscription.notes && (
				<ListItem title="Note" content={subscription.notes} />
			)}
			<ListItem
				title="Giorni rimanenti"
				content={String(calculateDiff(subscription.expirationDate))}
			/>
			<ListItem
				title="Ultimo pagamento"
				content={subscription.paymentDate.toLocaleDateString("it-IT")}
			/>
			<ListItem
				title="Data di Scadenza"
				content={subscription.expirationDate.toLocaleDateString(
					"it-IT"
				)}
			/>
		</dl>
	)
}
