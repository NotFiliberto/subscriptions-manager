export type PaginationProps = {
    itemsCount: number
    pageSize: number
    onPageChange: (page: number) => void
    currentPage: number
}

export default function Pagination({
    itemsCount,
    pageSize,
    onPageChange,
    currentPage,
}: PaginationProps) {
    const totalPages = Math.ceil(itemsCount / pageSize)

    if (totalPages === 1) return null
    const pages = Array.from(
        { length: totalPages },
        (value, index) => index + 1
    )

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
                <a
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                        const previusPage =
                            ((currentPage + totalPages - 2) % totalPages) + 1
                        onPageChange(previusPage)
                    }}
                >
                    Precedente
                </a>
                <a
                    className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                        const nextPage = (currentPage % totalPages) + 1
                        onPageChange(nextPage)
                    }}
                >
                    Successiva
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">{pageSize}</span> of{" "}
                        <span className="font-medium">{itemsCount}</span>{" "}
                        results
                    </p>
                </div>
                <div>
                    <nav
                        className="inline-flex -space-x-px rounded-md shadow-sm isolate"
                        aria-label="Pagination"
                    >
                        {pages.map((page) => (
                            <a
                                href="#"
                                key={page}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    page === currentPage
                                        ? "bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                }`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
