export type BadgeProps = {
	text: string
	color: string
}

export default function Badge(props: BadgeProps) {
	const { text, color } = props
	return (
		<span
			className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-700 ring-1 ring-inset ring-${color}-600/10`}
		>
			{text}
		</span>
	)
}
