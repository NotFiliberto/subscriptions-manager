"use client"

import BasicTextArea from "@/components/common/form/basicTextArea"
import FormSelect from "@/components/common/form/formSelect"
import InputText from "@/components/common/form/inputText"
import Notification from "@/components/common/notification"
import SubscriptionManagerDatepicker from "@/components/subscriptionManagerDatepicker"
import {
	DURATIONS,
	SUBSCRIPTION_TYPE,
	USER_NOTIFICATION_STATUS,
} from "@/lib/global-variables"
import { AllNotificationsStates } from "@/lib/types/notifications"
import { formatMACAddress } from "@/lib/utils"
import {
	AddSubscriptionForm,
	addSubscriptionInputSchema,
} from "@/lib/validations/user"
import { addSubscription } from "@/server/actions/subscriptions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { FieldErrors, useForm } from "react-hook-form"
import { defaultAddSubscriptionInputData } from "./formConfig"

const initialState: AllNotificationsStates = {
	submited: { show: false, message: "Aggiungo il nuovo abbonamento..." },
	error: { show: false, message: "❌ Errore" },
	success: {
		show: false,
		message: "✅ Abbonamento aggiunto con successo al database!",
	},
}

export default function AddLine() {
	const [state, setState] = useState<AllNotificationsStates>(initialState)

	// form control
	const { handleSubmit, control, getValues, reset, setValue } =
		useForm<AddSubscriptionForm>({
			defaultValues: defaultAddSubscriptionInputData,
			resolver: zodResolver(addSubscriptionInputSchema),
			mode: "onChange", // check validation onChange event
		})

	const { pending } = useFormStatus()

	// called if the user input is valid
	function onValidInput(data: AddSubscriptionForm) {
		//show submited notification with timer to cancel the operation

		let stateCopy = { ...state }
		stateCopy.submited.show = true
		setState(stateCopy)
	}

	// async call to db
	async function addSubscriptionToDB(subscriptionToAdd: AddSubscriptionForm) {
		let stateCopy = { ...state }
		try {
			const subscription = await addSubscription(subscriptionToAdd) // call the action

			stateCopy.success.show = true
			reset()
		} catch (error) {
			stateCopy.error.show = true
			stateCopy.error.message =
				"❌ Errore durante l'aggiunta dell'abbonamento."
		}
		setState(stateCopy)
	}

	// called if the user input is NOT valid
	function onInvalidInput(fields: FieldErrors<AddSubscriptionForm>) {}

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
							Nuovo abbonamento
						</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">
							Da questa pagina puoi creare un nuovo abbonamento,
							inserisci tutte le informazioni necessarie.
						</p>
					</div>

					<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
						<div className="sm:col-span-3">
							<InputText
								label={{ id: "username", text: "Username" }}
								type="text"
								control={{
									control,
									name: "username",
									rules: { required: true },
								}}
							/>
						</div>

						<div className="sm:col-span-3">
							<InputText
								label={{ id: "password", text: "Password" }}
								type="text"
								control={{
									control,
									name: "password",
									rules: { required: true },
								}}
							/>
						</div>

						<div className="sm:col-span-4">
							<InputText
								label={{ id: "email", text: "Indirizzo email" }}
								type="email"
								control={{
									control,
									name: "email",
									rules: { required: true },
								}}
							/>
						</div>

						<div className="sm:col-span-3">
							<FormSelect
								items={SUBSCRIPTION_TYPE.map((s) => ({
									title: s,
								}))}
								label="Tipo abbonamento"
								control={{
									control,
									name: "type",
									rules: { required: true },
								}}
							/>
						</div>
						<div className="sm:col-span-3">
							<FormSelect
								items={[...USER_NOTIFICATION_STATUS]}
								control={{
									control,
									name: "userNotified",
									rules: { required: true },
								}}
								label="Notificato"
							/>
							<p className="mt-1 text-sm text-gray-500">
								Metti {'"Si"'} se hai già inviato la mail di
								conferma
							</p>
						</div>

						<div className="col-span-full">
							<FormSelect
								label="Durata"
								items={[...DURATIONS]}
								control={{
									control,
									name: "duration",
									rules: { required: true },
								}}
							/>
						</div>

						<div className="col-span-full">
							<SubscriptionManagerDatepicker
								label={{
									id: "subscriptionPeriod",
									text: "Data di pagamento",
								}}
								formName="subscriptionPeriod"
								control={control}
								defaultValue={
									defaultAddSubscriptionInputData.subscriptionPeriod
								}
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
										required:
											!addSubscriptionInputSchema.shape.macAddress.isOptional(),
										onChange(event) {
											const macAddress =
												getValues("macAddress")
											setValue(
												"macAddress",
												formatMACAddress(
													event.target.value
												)
											)
										},
									},
								}}
							/>
						</div>

						<div className="col-span-full">
							<BasicTextArea
								label={{ id: "notes", text: "Note aggiuntive" }}
								rows={4}
								control={{ control, name: "notes" }}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end mt-6 gap-x-6">
					{/* {state.submited.show ? "yes" : "no"} */}
					<button
						type="submit"
						aria-disabled={pending}
						className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Aggiungi
					</button>
				</div>
			</form>

			{/* Global notification live region, render this permanently at the end of the document */}
			<div
				aria-live="assertive"
				className="fixed inset-0 flex flex-col gap-y-5 px-4 py-20 pointer-events-none sm:items-start"
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
								await addSubscriptionToDB(getValues())

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
			</div>
		</>
	)
}
