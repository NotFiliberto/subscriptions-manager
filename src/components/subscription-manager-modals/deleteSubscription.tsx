import { SubscriptionAndUser } from "@/lib/types/subscription-manager"
import { deleteSubscription } from "@/server/actions/subscriptions"
import { Dialog, Transition } from "@headlessui/react"
import { TrashIcon } from "@heroicons/react/20/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { Fragment } from "react"
import Notification from "../common/notification"
import DeleteSubscriptionInfo from "./deleteSubscriptionInfo"

export type DeleteSubscriptionModalProps = {
	visible: boolean
	toggle: () => void
	subscription: SubscriptionAndUser | undefined
}

export default function DeleteSubscriptionModal({
	visible,
	toggle,
	subscription,
}: DeleteSubscriptionModalProps) {
	const router = useRouter()
	const { execute, status, reset } = useAction(deleteSubscription, {
		onSuccess: async (deletedSubscription) => {
			router.refresh() // update user list
		},
	})

	async function handleDeleteSubmit(subscription: SubscriptionAndUser) {
		toggle()
		execute({
			subscriptionId: subscription.id,
		})
	}

	if (subscription === undefined) return null

	if (status == "hasErrored" && !visible)
		return (
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col gap-y-5 px-4 py-20 pointer-events-none sm:items-start"
			>
				<Notification
					text="❌ Errore imprevisto, non è stato rimosso nulla."
					countdown={{ onCountdownEnd: () => reset(), show: false }}
				/>
			</div>
		)

	if (status == "hasSucceeded" && !visible) {
		return (
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col gap-y-5 px-4 py-20 pointer-events-none sm:items-start"
			>
				<Notification
					text="✅ Rimosso con successo!"
					countdown={{ onCountdownEnd: () => reset(), show: false }}
				/>
			</div>
		)
	}

	// show modal
	return (
		<Transition.Root show={visible} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={() => {
					toggle()
				}}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
									<button
										type="button"
										className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none "
										onClick={() => {
											toggle()
										}}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon
											className="h-6 w-6"
											aria-hidden="true"
										/>
									</button>
								</div>
								<div className="sm:flex sm:items-start">
									<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
										<TrashIcon
											className="h-6 w-6 text-red-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title
											as="h3"
											className="text-base font-semibold leading-6 text-gray-900"
										>
											Rimuovi abbonameno
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500">
												Sei sicuro di voler eliminare
												questo abbonamento?
											</p>
										</div>
										<div className="mt-5">
											<DeleteSubscriptionInfo
												subscription={subscription}
											/>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
										onClick={() =>
											handleDeleteSubmit(subscription)
										}
									>
										Rimuovi
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
										onClick={() => {
											toggle()
										}}
									>
										Annulla
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
