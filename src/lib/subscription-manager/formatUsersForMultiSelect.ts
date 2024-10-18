import {
	GroupOption,
	Option,
} from "react-tailwindcss-select/dist/components/type"
import { PENDING_SUBSCRIPTION_DAYS } from "../global-variables"
import { ComboBoxUser } from "../types/subscription-manager"

export interface UserOption extends Option {
	user: ComboBoxUser | Option
}

export interface UserGroupOption extends GroupOption {
	options: (UserOption | Option)[]
}

export const GROUPS = {
	ALL: {
		group: 0,
		label: "Seleziona tutti",
		value: "selectAll",
	},
	EXPIRING_SOON: {
		group: 1,
		label: "In scadenza",
		value: "selectExpiring",
	},
	ACTIVE: {
		group: 2,
		label: "Attivi",
		value: "selectActive",
	},
	INACTIVE: {
		group: 3,
		label: "Inattivi",
		value: "selectInactive",
	},
}
export default function formatUsersForMultiSelect(users: ComboBoxUser[]) {
	const formatted: UserGroupOption[] = [
		/*         {
            label: "",
            options: [
                {
                    label: GROUPS.ALL.label,
                    value: GROUPS.ALL.value,
                } as Option,
                {
                    label: GROUPS.EXPIRING_SOON.label,
                    value: GROUPS.EXPIRING_SOON.value,
                } as Option,
                {
                    label: GROUPS.ACTIVE.label,
                    value: GROUPS.ACTIVE.value,
                } as Option,
                {
                    label: GROUPS.INACTIVE.label,
                    value: GROUPS.INACTIVE.value,
                } as Option,
            ],
        }, */
		{
			label: GROUPS.EXPIRING_SOON.label,
			options: [],
		},
		{
			label: GROUPS.ACTIVE.label,
			options: [],
		},
		{
			label: GROUPS.INACTIVE.label,
			options: [],
		},
	]

	users.map((user) => {
		let groupToPush: number // store the temp group to push user

		// inactive users
		if (user.diff < 0) {
			groupToPush = GROUPS.INACTIVE.group
		} else {
			// expiring subscription soon
			if (user.diff <= PENDING_SUBSCRIPTION_DAYS) {
				groupToPush = GROUPS.EXPIRING_SOON.group
			} else {
				// active user
				groupToPush = GROUPS.ACTIVE.group
			}
		}

		// push
		formatted[groupToPush - 1].options.push({
			user,
			value: user.subscription.id,
			label: `${user.email} -  ${user.username}`,
		})
	})

	return formatted
}
