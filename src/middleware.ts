import NextAuth from "next-auth"
import { authConfig } from "./server/auth.config"
//export { default } from "next-auth/middleware"
/* import { withAuth } from "next-auth/middleware"

export const config = {
    matcher: ["/", "/dashboard/:path*", "/api/:path*", "/signIn"],
}

export default withAuth(
    async function middleware(req: NextRequest) {
        const pathname = req.nextUrl.pathname

        // Manage route protection
        const isAuth = await getToken({ req })
        const isSignInPage = pathname.startsWith("/signIn")

        const sensitiveRoutes = ["/dashboard"]
        const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
            pathname.startsWith(route)
        )

        if (isSignInPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url))
            }

            return NextResponse.next()
        }

        if (!isAuth && isAccessingSensitiveRoute) {
            return NextResponse.redirect(new URL("/signIn", req.url))
        }

        if (pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
    },
    {
        callbacks: {
            async authorized() {
                return true
            },
        },
    }
) */
export const config = {
    matcher: ["/", "/dashboard/:path*", "/api/:path*", "/signIn"],
}

export default NextAuth(authConfig).auth
