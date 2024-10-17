import { SortColumn } from "@/components/common/table/types"
import { paginate } from "@/lib/paginate"
import {
    SubscriptionAndUser,
    SubscriptionAndUserWithDiff,
} from "@/lib/types/tvpanel"
import { calculateDiff } from "@/lib/utils"
import { orderBy } from "lodash"

export function getPagedSubscriptions(
    subscriptions: SubscriptionAndUser[],
    currentPage: number,
    pageSize: number,
    sortColumn: SortColumn<SubscriptionAndUser>,
    alreadySorted: boolean
) {
    // add diff property
    let sorted: SubscriptionAndUser[] = []

    if (!alreadySorted) {
        let subscriptionsWithDiff = subscriptions.map((s) => {
            const { expirationDate, ...rest } = s

            const diff = calculateDiff(s.expirationDate)
            return { ...s, diff }
        })
        // order by expiration > 0
        sorted = orderBy<SubscriptionAndUserWithDiff>(
            subscriptionsWithDiff,
            [(s) => s.diff >= 0, "diff"],
            "desc"
        )
    } else {
        const lowerCase = subscriptions.map((s: SubscriptionAndUser) => {
            if (typeof s[sortColumn.path] === "string")
                //@ts-expect-error
                s[sortColumn.path] = s[sortColumn.path]
                    .toLocaleString()
                    .toLowerCase()
            return { ...s }
        })
        sorted = orderBy<SubscriptionAndUser>(
            lowerCase,
            [sortColumn.path],
            [sortColumn.order]
        ) // order by column
    }

    const subscriptionsToRender = paginate<SubscriptionAndUser>(
        sorted,
        currentPage,
        pageSize
    )

    return {
        totalCount: subscriptionsToRender.length,
        data: subscriptionsToRender,
    }
}
