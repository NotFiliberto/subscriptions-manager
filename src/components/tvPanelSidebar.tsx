"use client"

import { useState } from "react"

import Sidebar, { SidebarState } from "../app/layouts/sidebarLayout"
import {
    navigationItems as initialNavigationItems,
    userNavigationItems,
} from "../lib/tvPanelRoutes"

export default function TVPanelSidebar({
    children,
}: {
    children: React.ReactNode
}) {
    const [state, setState] = useState<SidebarState>({
        navigationItems: initialNavigationItems,
        userNavigationItems: userNavigationItems,
        sidebarOpen: false,
    })

    function handleSwapActiveItem(newActiveItemIndex: number) {
        const currentActiveIndex = state.navigationItems.findIndex(
            (i) => i.current === true
        )
        if (
            currentActiveIndex === undefined ||
            state.navigationItems === undefined
        )
            return null

        // new item selected from sidebar
        if (currentActiveIndex !== newActiveItemIndex) {
            let { navigationItems, ...rest } = state

            if (currentActiveIndex !== -1)
                navigationItems[currentActiveIndex].current = false
            navigationItems[newActiveItemIndex].current = true

            setState({ navigationItems, ...rest })
        }
    }

    function handleSidebarOpen(open: boolean) {
        let { sidebarOpen, ...rest } = state
        setState({ sidebarOpen: open, ...rest })
    }

    return (
        <Sidebar
            navigationItems={state.navigationItems}
            onSelectedNavigationItem={handleSwapActiveItem}
            userNavigationItems={state.userNavigationItems}
            sidebarOpen={state.sidebarOpen}
            onSideBarOpen={handleSidebarOpen}
            logoLocalPath="/tvpanelLogo.png"
        >
            {children}
        </Sidebar>
    )
}
