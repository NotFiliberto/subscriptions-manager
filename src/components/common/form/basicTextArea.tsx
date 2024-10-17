import React from "react"
import {
    FieldValues,
    FieldPath,
    UseControllerProps,
    useController,
} from "react-hook-form"

export type BasicTextAreaPropos<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    label?: {
        id: string
        text: string
    }
    defaultValue?: string
    required?: boolean
    rows?: number
    control: UseControllerProps<TFieldValues, TName>
}

export default function BasicTextArea<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    label,
    defaultValue,
    required,
    rows,
    control,
}: BasicTextAreaPropos<TFieldValues, TName>) {
    const { field } = useController(control)
    return (
        <div>
            {label && (
                <label
                    htmlFor={label.id}
                    className="block mb-2 text-sm font-medium leading-6 text-gray-900"
                >
                    {label.text}
                </label>
            )}

            <div className="mt-2">
                <textarea
                    rows={rows}
                    id={label?.id}
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={defaultValue}
                    required={required}
                    {...field}
                />
            </div>
        </div>
    )
}
