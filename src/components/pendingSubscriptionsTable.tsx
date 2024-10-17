import { PENDING_SUBSCRIPTION_DAYS } from "@/lib/global-variables"
import { SubscriptionAndUser } from "@/lib/types/tvpanel"
import { asyncComponent, calculateDiff } from "@/lib/utils"

async function PendingSubscriptionTable({
	pendingSubscriptions,
}: {
	pendingSubscriptions: SubscriptionAndUser[]
}) {
	return (
		<div>
			<h1 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				Abbonamenti in scadenza
			</h1>
			<p className="text-base font-semibold leading-7 text-indigo-600">
				Ultimi {PENDING_SUBSCRIPTION_DAYS} giorni
			</p>

			<div className="mt-8 -mx-4 sm:-mx-0">
				<table className="min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
							>
								Username
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
							>
								Server
							</th>
							<th
								scope="col"
								className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>
								Notificato
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>
								Data di Scadenza
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
							>
								GG Rimanenti
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 ">
						{pendingSubscriptions.map((subscription) => (
							<tr key={subscription.id}>
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
									{subscription.userUsername}
								</td>
								<td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
									{subscription.type}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
									{subscription.userNotificated ? "Si" : "No"}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									{subscription.expirationDate.toLocaleDateString(
										"it-IT"
									)}
								</td>
								<td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
									{calculateDiff(subscription.expirationDate)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default asyncComponent(PendingSubscriptionTable)
