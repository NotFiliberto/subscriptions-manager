import TVPanelSidebar from "../../components/tvPanelSidebar"

export default async function SidebarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <TVPanelSidebar>{children}</TVPanelSidebar>
}
