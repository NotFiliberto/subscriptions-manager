import { classNames } from "@/components/utils"
import { ADD_USER, EXTEND_SUBSCRIPTION } from "@/lib/subscriptionManagerRoutes"

const actions = [
	{
		title: "Aggiungi abbonamento/utente",
		href: ADD_USER.href,
		icon: ADD_USER.icon,
		iconForeground: "text-teal-700",
		iconBackground: "bg-teal-50",
		description:
			"Da questa pagina puoi aggiungere un nuovo utente al database.",
	},
	{
		title: "Estendi abbonamento",
		href: EXTEND_SUBSCRIPTION.href,
		icon: EXTEND_SUBSCRIPTION.icon,
		iconForeground: "text-orange-700",
		iconBackground: "bg-orange-50",
		description:
			"Da qui puoi estendere la durata o rinnovare l' abbonamento di un utente.",
	},
]

export default function Subscriptions() {
	return (
		<>
			<div className="py-10 pl-5 sm:pl-10">
				<h2 className="text-2xl font-semibold">Abbonamenti</h2>
				<p>Scegli cosa vuoi fare.</p>
			</div>
			<div className=" divide-gray-200 overflow-hidden rounded-lg grid sm:grid-cols-2 sm:px-10 align-middle px-5 gap-5">
				{actions.map((action, actionIdx) => (
					<div
						key={action.title}
						className={classNames(
							actionIdx === 0
								? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
								: "",
							actionIdx === 1 ? "sm:rounded-tr-lg" : "",
							actionIdx === actions.length - 2
								? "sm:rounded-bl-lg"
								: "",
							actionIdx === actions.length - 1
								? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
								: "",
							"group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
						)}
					>
						<div>
							<span
								className={classNames(
									action.iconBackground,
									action.iconForeground,
									"inline-flex rounded-lg p-3 ring-4 ring-white"
								)}
							>
								<action.icon
									className="h-6 w-6"
									aria-hidden="true"
								/>
							</span>
						</div>
						<div className="mt-8">
							<h3 className="text-base font-semibold leading-6 text-gray-900">
								<a
									href={action.href}
									className="focus:outline-none"
								>
									{/* Extend touch target to entire panel */}
									<span
										className="absolute inset-0"
										aria-hidden="true"
									/>
									{action.title}
								</a>
							</h3>
							<p className="mt-2 text-sm text-gray-500">
								{action.description}
							</p>
						</div>
						<span
							className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
							aria-hidden="true"
						>
							<svg
								className="h-6 w-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
							</svg>
						</span>
					</div>
				))}
			</div>
		</>
	)
}
