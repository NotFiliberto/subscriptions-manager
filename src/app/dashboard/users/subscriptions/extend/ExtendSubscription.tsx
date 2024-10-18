"use client"

import CheckBox from "@/components/common/form/checkBox"
import FormSelect from "@/components/common/form/formSelect"
import Notification from "@/components/common/notification"
import SubscriptionManagerUserComboBox from "@/components/subscriptionManagerUserComboBox"
import { DURATIONS } from "@/lib/global-variables"
import { clientLogger } from "@/lib/logger/clientLogger"
import { AllNotificationsStates } from "@/lib/types/notifications"
import {
	ComboBoxUser,
	SubscriptionType,
} from "@/lib/types/subscription-manager"
import {
	ExtendSubscriptionFormValues,
	extendSubscriptionInputSchema,
} from "@/lib/validations/user"
import { SendMailInput, sendMail } from "@/server/actions/mails"
import { extendSubscription } from "@/server/actions/subscriptions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"

type ExtendNotificationState = AllNotificationsStates & {
	email: { show: boolean; message: string }
}

const initialState: ExtendNotificationState = {
	submited: { show: false, message: "Estendo l' abbonamento all' utente..." },
	error: { show: false, message: "❌ Errore" },
	success: {
		show: false,
		message: "✅ abbonamento esteso correttamente!",
	},
	email: {
		show: false,
		message: "📧 Invio email...",
	},
}

export default function ExtendSubscription({
	users,
}: {
	users: Array<ComboBoxUser & { diff: number }>
}) {
	const router = useRouter()

	const { execute: executeSendMail } = useAction(sendMail)

	const [state, setState] = useState<ExtendNotificationState>(initialState)

	const { handleSubmit, control, getValues, reset } =
		useForm<ExtendSubscriptionFormValues>({
			defaultValues: {
				extendFor: {
					months: DURATIONS[0].months,
					title: DURATIONS[0].title,
				},
				sendEmail: false,
			},
			resolver: zodResolver(extendSubscriptionInputSchema),
			mode: "onChange", // check validation onChange event
		})

	// called if the user input is valid
	function onValidInput(data: ExtendSubscriptionFormValues) {
		//console.log({ ...data })

		let stateCopy = { ...state }
		stateCopy.submited.show = true
		setState(stateCopy)
	}

	// called if the user input is NOT valid
	function onInvalidInput(fields: FieldErrors<ExtendSubscriptionFormValues>) {
		console.log("invalid input", fields)
	}

	async function ExtendSubscription(
		lineToExtend: ExtendSubscriptionFormValues
	) {
		let stateCopy = { ...state }
		try {
			reset() // reset form input fields
			const extendendLine = await extendSubscription(lineToExtend)
			state.success.show = true
			try {
				if (lineToExtend.sendEmail) {
					state.email.show = true

					const mailInfo: SendMailInput = {
						mailType: "EXTENDED",
						//@ts-ignore
						subscriptionId: extendendLine.id,
						subscriptionType:
							extendendLine.type as SubscriptionType,
						userEmail: [extendendLine.userEmail],
						userPassword: extendendLine.userPassword,
						userUsername: extendendLine.userUsername,
						paymentDate:
							extendendLine.paymentDate.toLocaleDateString(
								"it-IT"
							),
						expirationDate:
							extendendLine.expirationDate.toLocaleDateString(
								"it-IT"
							),
					}
					executeSendMail(mailInfo)

					clientLogger({
						level: "info",
						message: "Notification email sent to the user",
						object: { mailInfo },
					})

					// update state
					stateCopy.email.message = "📧 email inviata con successo!"
					stateCopy.email.show = true
				}
			} catch (error) {
				stateCopy.email.message = "📧 email NON inviata..."
				stateCopy.email.show = true
			}
		} catch (error) {
			stateCopy.error.show = true
			stateCopy.error.message =
				"❌ Errore durante l'estensione dell' abbonamento"
			clientLogger({
				level: "error",
				message: "Error while extending user",
				object: { lineToExtend },
			})
		}
		router.refresh()
		setState(stateCopy)
	}

	return (
		<>
			<form
				method="POST"
				className="p-5"
				onSubmit={handleSubmit(onValidInput, onInvalidInput)}
			>
				<div className="grid grid-cols-1 pb-12 border-b gap-x-8 gap-y-10 border-gray-900/10 md:grid-cols-3">
					<div>
						<h2 className="text-base font-semibold leading-7 text-gray-900">
							Estendi abbonamento
						</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">
							Da questa pagina puoi estendere {"l'"} abbonamento
							di un utente esistente, inserisci tutte le
							informazioni necessarie.
						</p>
					</div>

					<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
						<div className="col-span-full">
							<SubscriptionManagerUserComboBox
								control={{
									control,
									name: "user",
									rules: { required: true },
								}}
								users={users}
							/>
						</div>
						<div className="col-span-full">
							<FormSelect
								label="Estendi per"
								items={[...DURATIONS]}
								control={{
									control,
									name: "extendFor",
									rules: { required: true },
								}}
							/>
						</div>
						<div className="col-span-full">
							<CheckBox
								id="sendEmailForSubscriptionExtension"
								control={{ control, name: "sendEmail" }}
								title="Mail"
								description="Invia mail di conferma all'utente"
							/>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-end mt-6 gap-x-6">
					<button
						type="submit"
						className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Estendi
					</button>
				</div>
			</form>
			{/* Global notification live region, render this permanently at the end of the document */}
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col px-4 py-20 pointer-events-none gap-y-5 sm:items-start"
			>
				{state.submited.show && (
					<Notification
						text={state.submited.message}
						callback={{
							text: "annulla",
							fn: () => {
								console.log("undo this")

								// hide notification
								let stateCopy = { ...state }
								stateCopy.submited.show = false
								setState(stateCopy)
							},
						}}
						countdown={{
							duration: 5,
							onCountdownEnd: async () => {
								//extend line DB CALL
								await ExtendSubscription(getValues())

								// hide notification
								// change state on the current page (NOT IN the component)
								// hide notification
								let stateCopy = { ...state }
								stateCopy.submited.show = false
								setState(stateCopy)
							},
						}}
					/>
				)}
				{state.error.show && (
					<Notification
						text={state.error.message}
						countdown={{
							onCountdownEnd: () => {
								// hide notification
								let stateCopy = { ...state }
								stateCopy.error.show = false
								setState(stateCopy)
							},
							show: false,
						}}
					/>
				)}
				{state.success.show && (
					<Notification
						text={state.success.message}
						countdown={{
							onCountdownEnd: () => {
								let stateCopy = { ...state }
								stateCopy.error.show = false
								stateCopy.success.show = false
								setState(stateCopy)
							},
							show: false,
						}}
					/>
				)}
				{state.email.show && (
					<Notification
						text={state.email.message}
						countdown={{
							onCountdownEnd: () => {
								let stateCopy = { ...state }
								stateCopy.email.show = false
								setState(stateCopy)
							},
							show: false,
						}}
					/>
				)}
			</div>
		</>
	)
}
