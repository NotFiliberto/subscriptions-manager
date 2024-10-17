"use client"

import { PuffLoader } from "react-spinners"

export default function BounceLoader() {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <PuffLoader className="text-gray-800" size={100} />
        </div>
    )
}
