"use client"

import React from "react"

type CatFactLoaderProps = {
    children: React.ReactNode
}

export default function CatFactLoader({ children }: CatFactLoaderProps) {
    return <div>{children}</div>
}
