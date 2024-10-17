// default value should be provided when you use this component
import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid"
import React, { Fragment, useState } from "react"
import { classNames } from "../../utils"
import {
    FieldValues,
    FieldPath,
    UseControllerProps,
    useController,
} from "react-hook-form"

// every generic items must have this property
export type GenericItem = {
    title: string
}

export type FormSelectProps<
    TItem extends GenericItem = GenericItem,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    items: Array<TItem>
    label?: string
    control: UseControllerProps<TFieldValues, TName>
}

export default function FormSelect<
    TItem extends GenericItem = GenericItem,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ items, label, control }: FormSelectProps<TItem, TFieldValues, TName>) {
    const { field } = useController(control)

    // without this internal state, component can't determinate if an item is selected or not
    const [selectedItem, setSelectedItem] = useState<typeof field.value>(
        field.value
    )

    // if no items do not render
    if (items.length === 0) return null

    const selectedItemTitle = (field.value as TItem).title
    const { value, onChange, ...rest } = field

    return (
        <Listbox
            value={selectedItem}
            onChange={(newSelectedItem) => {
                onChange(newSelectedItem) // from react-hook-form
                setSelectedItem(newSelectedItem) //internal state
            }}
            {...rest}
        >
            {({ open }) => (
                <>
                    <div className="relative">
                        {label && (
                            <Listbox.Label className="block mb-2 text-sm font-medium leading-6 text-gray-900">
                                {label}
                            </Listbox.Label>
                        )}
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">
                                {selectedItemTitle}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronUpDownIcon
                                    className="w-5 h-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {items.map((item, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                            classNames(
                                                active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-8 pr-4"
                                            )
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={classNames(
                                                        selected
                                                            ? "font-semibold"
                                                            : "font-normal",
                                                        "block truncate"
                                                    )}
                                                >
                                                    {item.title}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active
                                                                ? "text-white"
                                                                : "text-indigo-600",
                                                            "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                                        )}
                                                    >
                                                        <CheckIcon
                                                            className="w-5 h-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
