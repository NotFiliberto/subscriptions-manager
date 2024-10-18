import SubscriptionManagerSidebar from "@/components/subscriptionManagerSidebar"

export default async function SidebarLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <SubscriptionManagerSidebar>{children}</SubscriptionManagerSidebar>
}
