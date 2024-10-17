import {
    FieldPath,
    FieldValues,
    useController,
    UseControllerProps,
} from "react-hook-form"

export type CheckBoxProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    id: string
    title?: string
    description?: string
    control: UseControllerProps<TFieldValues, TName>
}

export default function CheckBox<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ id, title, description, control }: CheckBoxProps<TFieldValues, TName>) {
    const { field, fieldState } = useController(control)

    return (
        <div className="relative flex items-start">
            <div className="flex h-6 items-center">
                <input
                    id={id}
                    aria-describedby="comments-description"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    {...field}
                />
            </div>
            <div className="ml-3 text-sm leading-6">
                <label htmlFor={id} className="font-medium text-gray-900">
                    {title}
                </label>{" "}
                {description && (
                    <span id={`${id}-description`} className="text-gray-500">
                        {description}
                    </span>
                )}
            </div>
            {fieldState.error && (
                <div className="mt-2 text-sm text-red-600">
                    <p>{fieldState.error.message}</p>
                </div>
            )}
        </div>
    )
}
