export function paginate<T>(
    items: Array<T>,
    pageNumber: number,
    pageSize: number
) {
    const startIndex = (pageNumber - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
}
