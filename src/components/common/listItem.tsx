export type ListItemProps = {
    title: string
    content: React.ReactNode | string
}
export function ListItem({ title, content }: ListItemProps) {
    return (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
                {title}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {content}
            </dd>
        </div>
    )
}
