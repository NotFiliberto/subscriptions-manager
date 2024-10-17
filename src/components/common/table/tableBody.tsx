import { get } from "lodash"
import {
    BasicTDataProps,
    isStandardColumn,
    TableBodyProps,
    TableColumn,
} from "./types"

export default function TableBody<TData extends BasicTDataProps>({
    data,
    columns,
}: TableBodyProps<TData>) {
    function renderCell<TData>(item: TData, column: TableColumn<TData>) {
        if (!isStandardColumn<TData>(column)) {
            return column.content(item)
        }
        return get(item, column.path) //get nested key of an object with lodash
    }

    function createKey(item: TData, column: TableColumn<TData>) {
        let add = !isStandardColumn<TData>(column) ? column.key : column.path
        return item.id + String(add)
    }

    function setStyles(column: TableColumn<TData>, columnIndex: number) {
        let styles = `text-left px-3`

        if (!isStandardColumn<TData>(column)) {
            //style for custom columns
            styles = `${styles} py-4 text-sm sm:pr-0 place-items-start text-gray-500 `
        } else {
            // default style for every text column
            styles = `${styles} py-4 text-sm text-gray-500 `

            //add additional styles
            styles = `${styles} ${column.additionalClasses ?? ""}`
        }

        if (columnIndex > 0) {
            /* if (columnIndex === 1) styles = `${styles} sm:table-cell`
            else styles = `${styles} lg:table-cell` */
            styles = `${styles} sm:table-cell`
        }

        if (column.hidden) styles = `hidden ${styles}`
        return styles
    }

    return (
        <tbody className="divide-y divide-gray-200">
            {data.map((item, itemIndex) => {
                let wrapColumn = false

                return (
                    <tr
                        key={item.id}
                        className={`${
                            itemIndex % 2 == 0 ? "" : "bg-gray-200"
                        } hover:bg-indigo-100`}
                    >
                        {columns.map((column, columnIndex) => {
                            const key = createKey(item, column)
                            if (!column.hidden && !wrapColumn) {
                                //render a cell with all hidden columns for responsive rendering

                                wrapColumn = true

                                const hiddenColumns = columns.filter(
                                    (c) => c.hidden === true
                                )

                                return (
                                    <td
                                        key={key}
                                        className="w-full py-4 pl-4 pr-3 text-sm font-medium max-w-0 sm:w-auto sm:max-w-none sm:pl-0"
                                    >
                                        {renderCell<TData>(item, column)}
                                        <dl className="font-normal lg:hidden">
                                            {hiddenColumns.map(
                                                (hc, hcIndex) => {
                                                    return (
                                                        <dd
                                                            key={key + hcIndex}
                                                            className={`mt-1 text-gray-700 word-wrap ${
                                                                hcIndex === 0
                                                                    ? "sm:hidden"
                                                                    : "sm:hidden" //TODO better fix
                                                            }`}
                                                        >
                                                            {renderCell<TData>(
                                                                item,
                                                                hc
                                                            )}
                                                        </dd>
                                                    )
                                                }
                                            )}
                                        </dl>
                                    </td>
                                )
                            }

                            const className = setStyles(column, columnIndex)

                            return (
                                <td key={key} className={className}>
                                    <dd className="mt-1 word-wrap text-gray-500 ">
                                        {renderCell(item, column)}
                                    </dd>
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
        </tbody>
    )
}
