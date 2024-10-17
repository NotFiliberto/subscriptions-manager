"use client"

import CatFact from "./CatFact"
import CatFactLoader from "./CatFactLoader"

export default function TestPage() {
    return (
        <CatFactLoader>
            <CatFact />
        </CatFactLoader>
    )
}
