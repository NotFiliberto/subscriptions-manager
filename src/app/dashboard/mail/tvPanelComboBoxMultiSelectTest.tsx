import formatUsersForMultiSelect, {
    UserOption,
} from "@/lib/tvpanel/formatUsersForMultiSelect"
import { ComboBoxUser } from "@/lib/types/tvpanel"
import { useState } from "react"
import {
    FieldPath,
    FieldValues,
    UseControllerProps,
    useController,
} from "react-hook-form"
import Select from "react-tailwindcss-select"

export type SelectUserValue = UserOption[]

export type ComboBoxMultiSelectTestProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    users: ComboBoxUser[]
    control: UseControllerProps<TFieldValues, TName>
}

export default function ComboBoxMultiSelectTest<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    users: comboBoxUsers,
    control,
}: ComboBoxMultiSelectTestProps<TFieldValues, TName>) {
    const { field, fieldState } = useController(control)

    const { onChange } = field

    const [user, setUser] = useState<SelectUserValue>(field.value)

    const handleChange = (value: SelectUserValue) => {
        /*  if (value[value.length - 1].value == GROUPS.ALL.value) {
            console.log("select all triggered")
        } */
        onChange(value)
        setUser(value)
    }

    const formattedusers = formatUsersForMultiSelect(comboBoxUsers)

    return (
        <>
            <Select
                value={user}
                onChange={(val) => handleChange(val as UserOption[])}
                options={formattedusers}
                primaryColor={"indigo"}
                isMultiple
                isClearable
                isSearchable
                placeholder="Seleziona destinatari..."
            />
            {fieldState.error && (
                <div className="mt-2 text-sm text-red-600">
                    <p>{fieldState.error.message}</p>
                </div>
            )}
        </>
    )
}
