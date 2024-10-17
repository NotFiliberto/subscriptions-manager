import { Providers } from "@/lib/query-provider"
import "./globals.css"

import { Inter } from "next/font/google"

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
})

// Create a client

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`h-full bg-gray-100 ${inter.className}`}>
            <body
                className={`h-full ${
                    process.env.NODE_ENV === "development"
                        ? "debug-screens"
                        : ""
                }`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
