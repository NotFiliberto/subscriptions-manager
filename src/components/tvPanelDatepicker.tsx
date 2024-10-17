import { useState } from "react"
import { Control, Controller } from "react-hook-form"
import { default as ReactTailwindCssDatepicker } from "react-tailwindcss-datepicker"
import { DateValueType } from "react-tailwindcss-datepicker/dist/types"

export type TVPanelDatapickerProps = {
    control: Control<any>
    formName: string
    required?: boolean
    placeholder?: string
    defaultValue?: DateValueType
    label?: {
        id: string
        text: string
    }
    asSingle?: boolean
}

export default function TVPanelDatepicker({
    control,
    formName,
    required = false,
    placeholder,
    defaultValue,
    label,
    asSingle,
}: TVPanelDatapickerProps) {
    const [date, setDate] = useState<DateValueType | undefined>(defaultValue)

    const singleDate = asSingle !== undefined ? asSingle : true

    function convertDateToDateValueType(date: Date): DateValueType {
        const dateValueType: DateValueType = { endDate: date, startDate: date }
        return dateValueType
    }

    return (
        <div>
            {label && (
                <label
                    htmlFor={label.id}
                    className="text-sm block mb-2 font-medium leading-6 text-gray-900"
                >
                    {label.text}
                </label>
            )}
            <>
                <Controller
                    control={control}
                    name={formName}
                    rules={{
                        required,
                    }}
                    //defaultValue={defaultValue}
                    render={({ field, fieldState }) => (
                        <>
                            <ReactTailwindCssDatepicker
                                placeholder={placeholder}
                                inputName={formName}
                                value={date ?? null}
                                onChange={(newDate) => {
                                    const date: DateValueType = {
                                        startDate:
                                            newDate?.startDate !== undefined
                                                ? newDate.startDate?.toLocaleString() !==
                                                  undefined
                                                    ? new Date(
                                                          newDate.startDate.toLocaleString()
                                                      )
                                                    : null
                                                : null,
                                        endDate:
                                            newDate?.endDate !== undefined
                                                ? newDate.endDate?.toLocaleString() !==
                                                  undefined
                                                    ? new Date(
                                                          newDate.endDate.toLocaleString()
                                                      )
                                                    : null
                                                : null,
                                    }
                                    field.onChange(date)
                                    setDate(date)
                                }}
                                useRange={!singleDate}
                                asSingle={singleDate}
                                displayFormat={"DD/MM/YYYY"}
                                inputId={label?.id}
                            />
                            {fieldState.error && (
                                <div className="mt-2 text-sm text-red-600">
                                    <p>Inserisci una data valida</p>
                                </div>
                            )}
                        </>
                    )}
                />
            </>
        </div>
    )
}
