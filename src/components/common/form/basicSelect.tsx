import React from "react"

export type BasicSelectProps<T extends string | number> = {
    items: Array<T>
    defaultValue?: T
    onSelect: (selectedItem: T) => void
}

export default function BasicSelect<T extends string | number>({
    items,
    defaultValue,
    onSelect,
}: BasicSelectProps<T>) {
    function raiseChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value as T
        onSelect(value)
    }

    if (items.length === 0) return null

    return (
        <select
            className="inline rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm sm:leading-6"
            defaultValue={defaultValue}
            onChange={(e) => raiseChange(e)}
        >
            {items.map((item, index) => (
                <option key={index}>{item}</option>
            ))}
        </select>
    )
}
