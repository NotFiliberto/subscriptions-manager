import { SubscriptionAndUser } from "@/lib/types/subscription-manager"
import { useState } from "react"

const useModal = () => {
	const [visible, setVisible] = useState(false)
	const [subscription, setSubscription] = useState<
		SubscriptionAndUser | undefined
	>(undefined)
	function toggle() {
		setVisible(!visible)
	}
	return { toggle, visible, subscription, setSubscription }
}

export default useModal
