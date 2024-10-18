import { Stats } from "@/lib/subscription-manager/stats"
import { asyncComponent } from "@/lib/utils"

async function DashboardStats({
	subscriptionStats,
}: {
	subscriptionStats: Stats
}) {
	const { activeSubscriptions, pendingSubscriptions, expiredSubscriptions } =
		subscriptionStats

	const stats = [
		{
			name: "Abbonamenti attivi",
			stat: activeSubscriptions.length,
		},
		{
			name: "In attesa di rinnovo",
			stat: pendingSubscriptions.length,
		},
		{ name: "Abbonamenti scaduti", stat: expiredSubscriptions.length },
	]

	return (
		<dl className=" grid grid-cols-1 gap-5 sm:grid-cols-3">
			{stats.map((item) => (
				<div
					key={item.name}
					className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
				>
					<dt className="truncate text-sm font-medium text-gray-500">
						{item.name}
					</dt>
					<dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
						{item.stat}
					</dd>
				</div>
			))}
		</dl>
	)
}
export default asyncComponent(DashboardStats)
