import {
	SUBSCRIPTION_TYPE,
	USER_NOTIFICATION_STATUS,
} from "@/lib/global-variables"
import { SubscriptionAndUser, SubscriptionType } from "@/lib/types/tvpanel"
import { formatMACAddress } from "@/lib/utils"
import {
	EditSubscriptionInput,
	editSubscriptionSchema,
} from "@/lib/validations/subscription"
import { editSubscription } from "@/server/actions/subscriptions"
import { Dialog, Transition } from "@headlessui/react"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { Fragment } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import BasicTextArea from "../common/form/basicTextArea"
import FormSelect from "../common/form/formSelect"
import InputText from "../common/form/inputText"
import Notification from "../common/notification"
import TVPanelDatepicker from "../tvPanelDatepicker"

export type EditubscriptionModalProps = {
	visible: boolean
	toggle: () => void
	subscription: SubscriptionAndUser
}

function getDefaultEditSubscriptionValues(subscription: SubscriptionAndUser) {
	const defaultEditSubscriptionInput: EditSubscriptionInput = {
		subscriptionId: subscription.id,
		email: subscription.userEmail,
		password: subscription.userPassword,
		username: subscription.userUsername,
		userNotified: subscription.userNotificated
			? USER_NOTIFICATION_STATUS[1]
			: USER_NOTIFICATION_STATUS[0],
		macAddress: subscription.macAddress ?? "",
		notes: subscription.notes ?? "",
		type: { title: subscription.type as SubscriptionType },
		subscriptionPeriod: {
			startDate: subscription.paymentDate,
			endDate: subscription.expirationDate,
		},
	}
	return defaultEditSubscriptionInput
}

export default function EditSubscriptionModal({
	visible,
	toggle,
	subscription,
}: EditubscriptionModalProps) {
	const router = useRouter()
	// form control
	const {
		handleSubmit,
		control,
		reset: resetForm,
		getValues,
		setValue,
	} = useForm<EditSubscriptionInput>({
		resolver: zodResolver(editSubscriptionSchema),
		mode: "onChange", // check validation onChange event
		values: getDefaultEditSubscriptionValues(subscription),
	})

	const { execute, status, reset } = useAction(editSubscription, {
		onSuccess: () => {
			router.refresh()
		},
		onError: () => {
			resetForm()
		},
	})

	// called if the user input is valid
	async function onValidInput(data: EditSubscriptionInput) {
		toggle()
		//show submited notification with timer to cancel the operation
		execute(data)
	}
	// called if the user input is NOT valid
	function onInvalidInput(fields: FieldErrors<EditSubscriptionInput>) {
		console.log("invalid input", fields)
	}

	if (status == "hasErrored" && !visible)
		return (
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col px-4 py-20 pointer-events-none gap-y-5 sm:items-start"
			>
				<Notification
					text="❌ Errore imprevisto, non è stato modificato nulla."
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
					text="✅ Modificato con successo!"
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
							<Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:overflow-visible sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
								<form
									method="POST"
									className=""
									onSubmit={handleSubmit(
										onValidInput,
										onInvalidInput
									)}
								>
									<div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
										<button
											type="button"
											className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none "
											onClick={() => {
												toggle()
											}}
										>
											<span className="sr-only">
												Close
											</span>
											<XMarkIcon
												className="w-6 h-6"
												aria-hidden="true"
											/>
										</button>
									</div>
									<div className="sm:flex sm:items-start">
										<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-teal-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
											<PencilSquareIcon
												className="w-6 h-6 text-teal-600"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:ml-3 sm:mt-0 sm:text-left ">
											<Dialog.Title
												as="h3"
												className="text-base font-semibold leading-6 text-gray-900"
											>
												Modifica abbonamento
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Sei sicuro di voler
													modificare questo
													abbonamento?
												</p>
											</div>
											<div className="mt-5 ">
												<div className="grid grid-cols-1 pb-12 gap-y-4 ">
													<div className="col-span-full">
														<InputText
															label={{
																id: "username",
																text: "Username",
															}}
															type="text"
															control={{
																control,
																name: "username",
																rules: {
																	required:
																		true,
																},
															}}
														/>
													</div>
													<div className="col-span-full">
														<InputText
															label={{
																id: "password",
																text: "Password",
															}}
															type="text"
															control={{
																control,
																name: "password",
																rules: {
																	required:
																		true,
																},
															}}
														/>
													</div>
													<div className="col-span-full">
														<InputText
															label={{
																id: "email",
																text: "Indirizzo email",
															}}
															type="email"
															control={{
																control,
																name: "email",
																rules: {
																	required:
																		true,
																},
															}}
														/>
													</div>
													<div className="sm:col-span-full">
														<FormSelect
															items={SUBSCRIPTION_TYPE.map(
																(s) => ({
																	title: s,
																})
															)}
															label="Tipo abbonamento"
															control={{
																control,
																name: "type",
																rules: {
																	required:
																		true,
																},
															}}
														/>
													</div>
													<div className="col-span-full">
														<FormSelect
															items={[
																...USER_NOTIFICATION_STATUS,
															]}
															control={{
																control,
																name: "userNotified",
															}}
															label="Notificato"
														/>
														<p className="mt-1 text-sm text-gray-500">
															Metti {'"Si"'} se
															hai già inviato la
															mail di conferma
														</p>
													</div>
													<div className="col-span-full">
														<TVPanelDatepicker
															label={{
																id: "subscriptionPeriod",
																text: "Periodo abbonamento",
															}}
															formName="subscriptionPeriod"
															control={control}
															asSingle={false}
															defaultValue={{
																startDate:
																	subscription.paymentDate,
																endDate:
																	subscription.expirationDate,
															}}
															required
														/>
													</div>
													<div className="col-span-full">
														<InputText
															label={{
																id: "macAddress",
																text: "Indirizzo MAC",
															}}
															type="text"
															placeholder="00:B0:D0:63:C2:26"
															control={{
																control,
																name: "macAddress",
																rules: {
																	onChange(
																		event
																	) {
																		const macAddress =
																			getValues(
																				"macAddress"
																			)
																		setValue(
																			"macAddress",
																			formatMACAddress(
																				event
																					.target
																					.value
																			)
																		)
																	},
																},
															}}
														/>
													</div>
													<div className="col-span-full">
														<BasicTextArea
															label={{
																id: "notes",
																text: "Note aggiuntive",
															}}
															rows={4}
															control={{
																control,
																name: "notes",
															}}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
										<button
											type="submit"
											className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-500 sm:ml-3 sm:w-auto"
										>
											Modifica
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
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
