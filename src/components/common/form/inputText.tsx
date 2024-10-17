import { ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { type HTMLInputTypeAttribute } from "react"
import {
    FieldPath,
    FieldValues,
    UseControllerProps,
    useController,
} from "react-hook-form"

export type InputTextProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    type: HTMLInputTypeAttribute
    placeholder?: string
    description?: string
    control: UseControllerProps<TFieldValues, TName>
    label?: {
        id: string
        text: string
        classNames?: string
        inline?: boolean
    }
    classNames?: string
}

export default function InputText<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    type,
    placeholder,
    description,
    control,
    label,
    classNames,
}: InputTextProps<TFieldValues, TName>) {
    const { field, fieldState } = useController(control)

    const labelInlineClass = label?.inline ? "inline" : ""

    const inputBorderStyles =
        (fieldState.error &&
            "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500") ||
        "ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600"

    return (
        <div className={`${label?.inline ? "flex" : "flex-col"} w-full gap-4`}>
            {label && (
                <label
                    htmlFor={label.id}
                    className={`text-sm block mb-2 font-medium leading-6 text-gray-900 ${labelInlineClass} ${label.classNames}`}
                >
                    {label.text}
                </label>
            )}
            <div
                className={`relative rounded-md shadow-sm w-full ${labelInlineClass}`}
            >
                <input
                    type={type}
                    id={label?.id}
                    className={`w-full rounded-md border-0 py-1.5 pr-10 ${inputBorderStyles} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${labelInlineClass} ${classNames} `}
                    placeholder={placeholder}
                    aria-invalid={(fieldState.error && "true") || "false"}
                    aria-describedby={`${field.name}-error`}
                    {...field}
                />
                {fieldState.error && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ExclamationCircleIcon
                            className="w-5 h-5 text-red-500"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </div>

            {fieldState.error && (
                <div className="mt-2 text-sm text-red-600">
                    <p>{fieldState.error.message}</p>
                </div>
            )}

            {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
        </div>
    )
}
