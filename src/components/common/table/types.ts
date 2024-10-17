export type SortColumn<TData> = {
    path: keyof TData
    order: "asc" | "desc"
}

export interface Column<TData> {
    hidden: boolean
}

export interface StandardColumn<TData> extends Column<TData> {
    __type: "standard"
    label: string
    additionalClasses?: string
    path: keyof TData
}

export interface CustomColumn<TData> extends Column<TData> {
    __type: "custom"
    key: string
    label?: string
    content: (...parameters: any[]) => React.ReactNode
}

export type TableColumn<TData> = StandardColumn<TData> | CustomColumn<TData>

export function isStandardColumn<TData>(
    column: Column<TData>
): column is StandardColumn<TData> {
    return (<StandardColumn<TData>>column).path !== undefined
}

export type TableHeaderProps<TData> = {
    columns: (StandardColumn<TData> | CustomColumn<TData>)[]
    sortColumn: SortColumn<TData>
    onSort: (sm: SortColumn<TData>) => void
}

export type TableBodyProps<TData> = {
    data: TData[]
    columns: TableColumn<TData>[]
}

export type BasicTDataProps = {
    id: string
}

export type TableProps<TData extends BasicTDataProps> = {
    columns: TableColumn<TData>[]
    sortColumn: SortColumn<TData>
    onSort: (sm: SortColumn<TData>) => void
    data: TData[]
}
