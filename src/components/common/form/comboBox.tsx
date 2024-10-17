import { useState } from "react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"
import { classNames } from "../../utils"
import {
    FieldPath,
    FieldValues,
    useController,
    UseControllerProps,
} from "react-hook-form"

export type DefaultComboBoxProps = {
    id: string
    title: string
}

export type ComboBoxProps<
    TItem extends DefaultComboBoxProps = DefaultComboBoxProps,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    items: TItem[]
    label?: {
        id: string
        text: string
    }
    control: UseControllerProps<TFieldValues, TName>
}

export default function ComboBox<
    TItem extends DefaultComboBoxProps = DefaultComboBoxProps,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ items, label, control }: ComboBoxProps<TItem, TFieldValues, TName>) {
    const { field, fieldState } = useController(control)

    const [selectedItem, setSelectedItem] = useState<
        typeof field.value | undefined
    >(field.value)

    const [query, setQuery] = useState<string>("")

    const filteredItems =
        query === ""
            ? items
            : items.filter((item) => {
                  return item.title.toLowerCase().includes(query.toLowerCase())
              })

    const { onChange, value, ...rest } = field

    return (
        <Combobox
            as="div"
            defaultValue={selectedItem}
            onChange={(newSelectedItem) => {
                onChange(newSelectedItem) // from react-hook-form
                setSelectedItem(newSelectedItem) //internal state
            }}
            {...rest}
        >
            {label && (
                <Combobox.Label className="block mb-2 text-sm font-medium leading-6 text-gray-900">
                    {label.text}
                </Combobox.Label>
            )}
            <div className="relative">
                <Combobox.Input
                    className=" w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => {
                        setQuery(event.target.value)
                    }}
                    displayValue={(item: TItem) => item.title}
                />

                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                    <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                {/* no items matched query */}
                {filteredItems.length === 0 && query !== "" ? (
                    <div className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <p className="relative cursor-default select-none py-2 pl-8 pr-4">
                            Nessuna opzione disponibile
                        </p>
                    </div>
                ) : (
                    /* show valid optios */
                    <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredItems.map((item) => (
                            <Combobox.Option
                                key={item.id}
                                value={item}
                                className={({ active }) =>
                                    classNames(
                                        "relative cursor-default select-none py-2 pl-8 pr-4",
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900"
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                "block truncate",
                                                selected ? "font-semibold" : ""
                                            )}
                                        >
                                            {item.title}
                                        </span>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                                    active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                )}
                                            >
                                                <CheckIcon
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
            {fieldState.error?.type === "required" && (
                <div className="mt-2 text-sm text-red-600">
                    <p>Seleziona un opzione</p>
                </div>
            )}
        </Combobox>
    )
}
