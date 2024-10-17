import DashboardStats from "@/components/dashboardStats"
import PendingSubscriptionsTable from "@/components/pendingSubscriptionsTable"
import { getStats } from "@/lib/tvpanel/stats"

export default async function Dashboard() {
    const stats = await getStats()

    return (
        <div className="p-5">
            <DashboardStats subscriptionStats={stats} />
            <PendingSubscriptionsTable
                pendingSubscriptions={stats.pendingSubscriptions}
            />
            {/*  <TvPanelFund /> */}
        </div>
    )
}
