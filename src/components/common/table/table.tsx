import TableBody from "./tableBody"
import TableHeader from "./tableHeader"
import { TableProps } from "./types"

export default function Table<TData extends { id: string }>({
    columns,
    onSort,
    sortColumn,
    data,
}: TableProps<TData>) {
    return (
        <table className="min-w-full divide-y divide-gray-300">
            <TableHeader
                columns={columns}
                sortColumn={sortColumn}
                onSort={onSort}
            />
            <TableBody data={data} columns={columns} />
        </table>
    )
}
