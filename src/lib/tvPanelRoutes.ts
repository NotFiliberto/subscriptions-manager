import {
	AdjustmentsHorizontalIcon,
	ClockIcon,
	Cog8ToothIcon,
	EnvelopeIcon,
	HomeIcon,
	UserPlusIcon,
	UsersIcon,
} from "@heroicons/react/20/solid"
import {
	NavigationItem,
	UserNavigationItem,
} from "../app/layouts/sidebarLayout"

export const DASHBOARD: NavigationItem = {
	name: "Dashboard",
	href: "/dashboard",
	icon: HomeIcon,
	current: false,
}

export const USERS: NavigationItem = {
	name: "Utenti",
	href: `${DASHBOARD.href}/users`,
	icon: UsersIcon,
	current: false,
}

export const SUBSCRIPTIONS: NavigationItem = {
	name: "Abbonamenti",
	href: `${USERS.href}/subscriptions`,
	icon: AdjustmentsHorizontalIcon,
	current: false,
}

export const ADD_USER: NavigationItem = {
	name: "Aggiungi utente/abbonamento",
	href: `${SUBSCRIPTIONS.href}/add`,
	icon: UserPlusIcon,
	current: false,
}

export const EXTEND_SUBSCRIPTION: NavigationItem = {
	name: "Estendi abbonamento",
	href: `${SUBSCRIPTIONS.href}/extend`,
	icon: ClockIcon,
	current: false,
}

export const SETTINGS: NavigationItem = {
	name: "Impostazioni",
	href: `${DASHBOARD.href}/settings`,
	icon: Cog8ToothIcon,
	current: false,
}

export const MAIL_SETTING: NavigationItem = {
	name: "Impostazioni",
	href: `${SETTINGS.href}/mail`,
	icon: EnvelopeIcon,
	current: false,
}

export const MAIL: NavigationItem = {
	name: "E-mail",
	href: `${DASHBOARD.href}/mail`,
	icon: EnvelopeIcon,
	current: false,
}

export let navigationItems: NavigationItem[] = [
	DASHBOARD,
	USERS,
	SUBSCRIPTIONS,
	MAIL,
	SETTINGS,
	/* { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    { name: "Documents", href: "#", icon: InboxIcon, current: false },
    { name: "Reports", href: "#", icon: ChartBarIcon, current: false }, */
]

export const userNavigationItems: UserNavigationItem[] = [
	/* { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" }, */
	{ name: "Sign out", href: "/api/auth/signOut" },
]
