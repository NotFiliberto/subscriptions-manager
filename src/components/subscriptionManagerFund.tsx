"use client"

import { asyncComponent } from "@/lib/utils"
import { useState } from "react"
import AddFundModal from "./subscription-manager-modals/addFundModal"

async function SubscriptionManagerFund() {
	const [visible, setVisible] = useState(false)

	function toggle() {
		setVisible(!visible)
	}

	return (
		<>
			<div className="mt-10 sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Cassa - 222€
					</h1>
					<p className="text-base font-semibold leading-7 text-indigo-600">
						Ultimo anno
					</p>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						onClick={() => toggle()}
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Aggiungi credito
					</button>
				</div>
			</div>

			{visible && <AddFundModal visible={visible} toggle={toggle} />}
		</>
	)
}

export default asyncComponent(SubscriptionManagerFund)
