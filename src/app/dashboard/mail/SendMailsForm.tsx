"use client"
import { Label, Legend } from "@/components/catalyst-ui-kit/fieldset"
import { Input } from "@/components/catalyst-ui-kit/input"
import { Text } from "@/components/catalyst-ui-kit/text"
import { Textarea } from "@/components/catalyst-ui-kit/textarea"
import Badge from "@/components/common/badge"
import useMailModal from "@/components/subscription-manager-modals/useMailModal"
import { ComboBoxUser } from "@/lib/types/subscription-manager"
import { SendMailFormInput, sendMailsInputSchema } from "@/lib/validations/mail"
import { Fieldset, Field as HeadlessField } from "@headlessui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormStatus } from "react-dom"
import { useForm } from "react-hook-form"
import ConfirmSendMailModal from "./ConfirmSendMailModal"
import ComboBoxMultiSelectTest from "./subscriptionManagerComboBoxMultiSelectTest"

export default function SendMailsForm({ users }: { users: ComboBoxUser[] }) {
	const { visible: isMailModalVisibile, toggle } = useMailModal()

	// form control
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
		getValues,
		reset,
	} = useForm<SendMailFormInput>({
		//defaultValues: defaultAddSubscriptionInputData,
		resolver: zodResolver(sendMailsInputSchema),
		mode: "onSubmit", // check validation onChange event
		defaultValues: {
			from: process.env.NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS,
		},
	})

	const onSubmit = async (data: SendMailFormInput) => {
		toggle()
	}

	return (
		<>
			<form className="p-5" onSubmit={handleSubmit(onSubmit)}>
				<div className=" pb-12 border-b gap-x-8 gap-y-10 border-gray-900/10">
					<Fieldset>
						<div className="mb-16">
							<div className="flex gap-4">
								<Legend className="text-base font-semibold leading-7 text-gray-900">
									Invia nuova mail
								</Legend>
								<Badge color="red" text="Disabled" />
							</div>
							<Text>
								Da questa pagina puoi inviare direttamente una
								mail a uno o più utenti contemporaneamente.
							</Text>
						</div>

						<div
							data-slot="control"
							className="grid grid-cols-1 items-center gap-x-4 gap-y-6 sm:grid-cols-12"
						>
							{/* Sender field */}
							<HeadlessField className="grid grid-cols-[subgrid] sm:col-span-12">
								<Label
									className={
										"text-sm font-medium leading-6 text-gray-900 text-pretty sm:col-span-2"
									}
								>
									Da:
								</Label>
								<Input
									className="mt-3 sm:col-span-10 sm:mt-0"
									{...register("from")}
									disabled
								/>
							</HeadlessField>

							<HeadlessField className="grid grid-cols-[subgrid] sm:col-span-12">
								{/* Recipients */}
								<Label
									className={
										"text-sm font-medium leading-6 text-gray-900 text-pretty sm:col-span-2"
									}
								>
									A:
								</Label>
								<div className="mt-3 sm:col-span-10 sm:mt-0">
									<ComboBoxMultiSelectTest
										control={{
											control: control,
											name: "to",
											rules: { required: true },
										}}
										users={users}
									/>
								</div>
							</HeadlessField>

							<HeadlessField className="grid grid-cols-[subgrid] sm:col-span-12">
								<Label
									className={
										"text-sm font-medium leading-6 text-gray-900 text-pretty sm:col-span-2"
									}
								>
									Oggetto:
								</Label>
								<div className="mt-3 sm:col-span-10 sm:mt-0">
									<Input
										className="mt-3 sm:col-span-10 sm:mt-0"
										{...register("subject", {
											required: true,
										})}
									/>
									<p className="text-red-600 text-sm">
										{errors.subject?.message}
									</p>
								</div>
							</HeadlessField>

							<HeadlessField className="grid grid-cols-[subgrid] sm:col-span-12">
								<Label
									className={
										"text-sm font-medium leading-6 text-gray-900 text-pretty sm:col-span-2"
									}
								>
									Messaggio
								</Label>
								<div className="mt-3 sm:col-span-10 sm:mt-0">
									<Textarea
										{...register("content", {
											required: true,
										})}
									/>
									<p className="text-red-600 text-sm">
										{errors.content?.message}
									</p>
								</div>
							</HeadlessField>
						</div>
					</Fieldset>
				</div>

				<div className="flex items-center justify-end mt-6 gap-x-6">
					<SendMailsButton />
				</div>
			</form>
			{isMailModalVisibile && (
				<ConfirmSendMailModal
					visible={isMailModalVisibile}
					toggle={() => toggle()}
					mailFields={getValues()}
					reset={reset}
				/>
			)}
		</>
	)
}

function SendMailsButton() {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			aria-disabled={pending}
			disabled
		>
			Invia
		</button>
	)
}
