import { ComboBoxUser } from "@/lib/types/tvpanel"
import { getStatusColor } from "@/lib/utils"
import { Combobox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { orderBy } from "lodash"
import { useState } from "react"
import {
    FieldPath,
    FieldValues,
    UseControllerProps,
    useController,
} from "react-hook-form"
import { classNames } from "./utils"

export type TVPanelUserComboBoxProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    users: Array<ComboBoxUser & { diff: number }>
    label?: {
        id: string
        text: string
    }
    control: UseControllerProps<TFieldValues, TName>
}

export default function TVPanelUserComboBox<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ users, label, control }: TVPanelUserComboBoxProps<TFieldValues, TName>) {
    const { field, fieldState } = useController(control)

    const [selectedUser, setSelectedUser] = useState<ComboBoxUser | undefined>(
        field.value
    )

    const [query, setQuery] = useState<string>("")

    // filter users based on input query
    const filteredUsers =
        query === ""
            ? users
            : users.filter((user) => {
                  return (
                      user.username
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                      user.email.includes(query.toLowerCase())
                  )
              })

    // TODO order by expiration date diff > 0 and all expireted subscription at the end
    const sortedUsers = orderBy<ComboBoxUser>(
        filteredUsers,
        [(user) => user.diff >= 0, "diff"],
        "desc"
    )

    const { onChange, value, ...rest } = field

    return (
        <Combobox
            as="div"
            defaultValue={selectedUser}
            onChange={(user) => {
                onChange(user) // from react-hook-form
                setSelectedUser(user) //internal state
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
                    displayValue={(user: ComboBoxUser) => user.email}
                />

                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                    <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                {sortedUsers.length === 0 && query !== "" ? (
                    <div className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <p className="relative cursor-default select-none py-2 pl-8 pr-4">
                            Nessuna opzione disponibile
                        </p>
                    </div>
                ) : (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {sortedUsers.map((user, index) => {
                            // calculate the number of days before the end of the user subscription

                            const statusColor = getStatusColor(user.diff)
                            //remove extra property
                            return (
                                <Combobox.Option
                                    key={`${user.email}_${user.username}_${index}`}
                                    value={user}
                                    className={({ active }) =>
                                        classNames(
                                            "relative cursor-default select-none py-2 pl-3 pr-9",
                                            active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900"
                                        )
                                    }
                                >
                                    {({ active, selected }) => (
                                        <>
                                            <div className="flex items-center">
                                                <span
                                                    className={classNames(
                                                        "inline-block h-2 w-2 flex-shrink-0 rounded-full",
                                                        statusColor,
                                                        selected
                                                            ? "animate-pulse"
                                                            : ""
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                <div className="flex-col break-all ml-3">
                                                    <div
                                                        className={classNames(
                                                            selected
                                                                ? "font-semibold"
                                                                : ""
                                                        )}
                                                    >
                                                        {user.email}
                                                    </div>

                                                    <span
                                                        className={classNames(
                                                            "text-gray-500",
                                                            active
                                                                ? "text-indigo-200"
                                                                : "text-gray-500"
                                                        )}
                                                    >
                                                        Username:{" "}
                                                        {user.username}
                                                    </span>
                                                    <div
                                                        className={classNames(
                                                            "text-gray-500",
                                                            active
                                                                ? "text-indigo-200"
                                                                : "text-gray-500"
                                                        )}
                                                    >
                                                        {user.diff > 0
                                                            ? "Scade il: "
                                                            : "Scaduto il: "}
                                                        {user.subscription.expirationDate.toLocaleDateString(
                                                            "it-IT"
                                                        )}
                                                    </div>

                                                    {user.subscription.notes !==
                                                        "" && (
                                                        <div
                                                            className={classNames(
                                                                "text-gray-500",
                                                                active
                                                                    ? "text-indigo-200"
                                                                    : "text-gray-500",
                                                                "italic"
                                                            )}
                                                        >
                                                            {
                                                                user
                                                                    .subscription
                                                                    .notes
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {selected && (
                                                <span
                                                    className={classNames(
                                                        "absolute inset-y-0 right-0 flex items-center pr-4",
                                                        active
                                                            ? "text-white"
                                                            : "text-indigo-600"
                                                    )}
                                                >
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            )
                        })}
                    </Combobox.Options>
                )}
            </div>

            {fieldState.error && (
                <div className="mt-2 text-sm text-red-600">
                    <p>Seleziona un opzione</p>
                </div>
            )}
        </Combobox>
    )
}
