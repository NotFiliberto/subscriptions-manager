import { SubscriptionAndUser } from "@/lib/types/subscription-manager"
import { sendMail } from "@/server/actions/mails"
import { Dialog, Transition } from "@headlessui/react"
import { EnvelopeIcon } from "@heroicons/react/20/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { Fragment } from "react"
import Badge from "../common/badge"
import { ListItem } from "../common/listItem"
import Notification from "../common/notification"

export type NotifyUserByEmailModalProps = {
	visible: boolean
	toggle: () => void
	subscription: SubscriptionAndUser | undefined
}

export default function NotifyUserByEmailModal({
	visible,
	toggle,
	subscription,
}: NotifyUserByEmailModalProps) {
	const router = useRouter()

	const {
		status,
		execute: sendMailMutation,
		reset,
	} = useAction(sendMail, { onSuccess: () => router.refresh() })

	async function handleMailSubmit(subscription: SubscriptionAndUser) {
		toggle()

		sendMailMutation({
			mailType: "NOTIFY",
			//@ts-expect-error
			subscriptionType: subscription.server,
			paymentDate: subscription.paymentDate.toLocaleDateString("it-IT"),
			expirationDate:
				subscription.expirationDate.toLocaleDateString("it-IT"),
			userEmail: [subscription.userEmail],
			userUsername: subscription.userUsername,
			userPassword: subscription.userPassword,
			subscriptionId: subscription.id,
		})
	}

	if (subscription === undefined) return null

	if (status == "hasErrored" && !visible)
		return (
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col px-4 py-20 pointer-events-none gap-y-5 sm:items-start"
			>
				<Notification
					text="❌ Errore imprevisto, la mail non è stata inviata."
					countdown={{ onCountdownEnd: () => reset(), show: false }}
				/>
			</div>
		)

	if (status == "hasSucceeded" && !visible) {
		return (
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col px-4 py-20 pointer-events-none gap-y-5 sm:items-start"
			>
				<Notification
					text="✅ Mail inviata con successo!"
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
					<div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
									<button
										type="button"
										className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none "
										onClick={() => {
											toggle()
										}}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon
											className="w-6 h-6"
											aria-hidden="true"
										/>
									</button>
								</div>
								<div className="sm:flex sm:items-start">
									<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
										<EnvelopeIcon
											className="w-6 h-6 text-blue-600"
											aria-hidden="true"
										/>
									</div>
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<div className="flex gap-4">
											<Dialog.Title
												as="h3"
												className="text-base font-semibold leading-6 text-gray-900"
											>
												Notifica email
											</Dialog.Title>
											<Badge
												color="red"
												text="Disabled"
											/>
										</div>
										<div className="mt-2">
											<p className="text-sm text-gray-500">
												Sei sicuro di voler inviare una
												mail di notifica a questo
												utente?
											</p>
											<dl className="mt-5 divide-y divide-gray-100">
												<ListItem
													title="Username"
													content={
														subscription.userUsername
													}
												/>
												<ListItem
													title="Indirizzo email"
													content={
														subscription.userEmail
													}
												/>
												<ListItem
													title="Server"
													content={subscription.type}
												/>
												<ListItem
													title="Scadenza"
													content={subscription.expirationDate.toLocaleDateString(
														"it-IT"
													)}
												/>
											</dl>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
									<button
										type="button"
										className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
										onClick={() =>
											handleMailSubmit(subscription)
										}
										disabled
									>
										Invia
									</button>
									<button
										type="button"
										className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
