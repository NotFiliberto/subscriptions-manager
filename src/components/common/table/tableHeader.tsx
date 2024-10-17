import { ArrowSmallDownIcon, ArrowSmallUpIcon } from "@heroicons/react/20/solid"
import { TableColumn, TableHeaderProps, isStandardColumn } from "./types"

export default function TableHeader<TData>({
    columns,
    sortColumn,
    onSort,
}: TableHeaderProps<TData>) {
    function raiseSort(path: keyof TData) {
        if (sortColumn.path === path)
            //swap
            sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc"
        else {
            //different path
            sortColumn.path = path
            sortColumn.order = "asc"
        }
        onSort(sortColumn)
    }

    function renderSortIcon(column: TableColumn<TData>) {
        if (!isStandardColumn<TData>(column)) return null

        if (column.path !== sortColumn.path) return null
        if (sortColumn.order === "asc")
            return <ArrowSmallUpIcon width={20} className="inline" />
        return <ArrowSmallDownIcon width={20} className="inline" />
    }

    function setStyles(column: TableColumn<TData>, columnIndex: number) {
        let styles = `text-left px-3`

        if (!isStandardColumn<TData>(column)) {
            //style for custom columns
            styles = `${styles} ${
                columnIndex === 0 ? "pl-4 sm:pl-0 " : ""
            } relative py-3 py-3.5 text-sm font-semibold text-gray-900 cursor-not-allowed `
        } else {
            // default style for every text column
            styles = `${styles} px-3 py-3.5 text-sm font-semibold text-gray-900 cursor-pointer `

            //add additional styles
            styles = `${styles} ${column.additionalClasses ?? ""} `
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
        <thead>
            <tr>
                {columns.map((column, columnIndex) => {
                    const className = setStyles(column, columnIndex)

                    if (!isStandardColumn<TData>(column))
                        return (
                            <th
                                key={columnIndex}
                                scope="col"
                                className={className}
                            >
                                {column.label}
                            </th>
                        )

                    return (
                        <th
                            key={columnIndex}
                            scope="col"
                            className={className}
                            onClick={() => raiseSort(column.path)}
                        >
                            {column.label} {renderSortIcon(column)}
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
}
