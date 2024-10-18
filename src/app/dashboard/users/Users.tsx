"use client"

import BasicSelect from "@/components/common/form/basicSelect"
import Pagination from "@/components/common/pagination"
import { SortColumn } from "@/components/common/table/types"
import SubscriptionManagerTable from "@/components/subscriptionManagerTable"
import { USER_TABLE_PAGINATION } from "@/lib/global-variables"
import { SubscriptionAndUser } from "@/lib/types/subscription-manager"
import { useState } from "react"
import { getPagedSubscriptions } from "./getPagedSubscriptions"

export type UserPageState = {
	currentPage: number
	pageSize: number
	sortColumn: SortColumn<SubscriptionAndUser>
	alreadySorted: boolean
}

export default function Users({
	subscriptions,
}: {
	subscriptions: SubscriptionAndUser[]
}) {
	const [state, setState] = useState<UserPageState>({
		currentPage: 1,
		pageSize: USER_TABLE_PAGINATION.defaultSize,
		sortColumn: {
			path: "userUsername",
			order: "desc",
		},
		alreadySorted: false,
	})

	function handlePageChange(pageNumber: number) {
		const { currentPage, ...rest } = state
		setState({ currentPage: Number(pageNumber), ...rest }) // need to explicit parse to Number to prevent wrong type (string)
	}

	function handlePageSizeChange(newPageSize: number) {
		const { currentPage, pageSize, ...rest } = state
		setState({ currentPage: 1, pageSize: Number(newPageSize), ...rest }) // need to explicit parse to Number to prevent wrong type (string)
	}

	function handleSort(sortColumn: SortColumn<SubscriptionAndUser>) {
		const { sortColumn: old, alreadySorted, ...rest } = state
		setState({ sortColumn, alreadySorted: true, ...rest })
	}

	const { data } = getPagedSubscriptions(
		subscriptions,
		state.currentPage,
		state.pageSize,
		state.sortColumn,
		state.alreadySorted
	)

	return (
		<>
			<div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<h1 className="text-2xl font-semibold text-gray-900">
						Lista utenti
					</h1>
				</div>
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					Ordinata per gli utenti in fase di scadenza.
				</div>
				<SubscriptionManagerTable
					subscriptionToRender={data}
					sortColumn={state.sortColumn}
					onSort={handleSort}
				/>

				<div className="sm:items-center sm:flex">
					<div className="content-center block p-5 text-center">
						<BasicSelect
							items={USER_TABLE_PAGINATION.sizes}
							defaultValue={USER_TABLE_PAGINATION.defaultSize}
							onSelect={handlePageSizeChange}
						/>
					</div>
					<div className="flex-1 text-right">
						<Pagination
							itemsCount={subscriptions.length}
							pageSize={state.pageSize}
							onPageChange={handlePageChange}
							currentPage={state.currentPage}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
