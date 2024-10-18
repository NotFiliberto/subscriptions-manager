import { getAllSubcriptions } from "@/server/actions/subscriptions"
import { auth } from "@/server/auth"
import { PENDING_SUBSCRIPTION_DAYS } from "../global-variables"
import { calculateDiff } from "../utils"

export async function getStats() {
    const session = await auth()

    if (!session) throw new Error("NOT_AUTHORIZED")

    const subscriptions = await getAllSubcriptions()

    let activeSubscriptions: typeof subscriptions = []
    let pendingSubscriptions: typeof subscriptions = []
    let expiredSubscriptions: typeof subscriptions = []

    subscriptions.map((subscription) => {
        // check if active subscription
        const diff = calculateDiff(subscription.expirationDate)
        if (diff >= 0) {
            activeSubscriptions.push(subscription)

            // check if it is a pending subscription
            if (diff <= PENDING_SUBSCRIPTION_DAYS) {
                pendingSubscriptions.push(subscription)
            }
        } else {
            expiredSubscriptions.push(subscription)
        }
    })

    return {
        activeSubscriptions,
        pendingSubscriptions,
        expiredSubscriptions,
    }
}

export type Stats = Awaited<ReturnType<typeof getStats>>
