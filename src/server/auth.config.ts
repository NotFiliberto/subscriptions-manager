import { clientLogger } from "@/lib/logger/clientLogger"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

export const credentialsSchema = z.object({
    email: z.string().or(z.string().email()), //email or username
    password: z.string(),
})

export const authConfig = {
    session: {
        strategy: "jwt",
    },
    pages: { signIn: "/signIn" },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "admin",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)

                try {
                    const user = credentialsSchema.parse(credentials)
                    if (
                        user.email === process.env.DASHBOARD_USER &&
                        user.password === process.env.DASHBOARD_PASSWORD
                    )
                        return {
                            id: "777",
                            username: user.email,
                            email: user.email,
                        }

                    clientLogger({
                        level: "error",
                        message: "Wrong credentials",
                        object: { user },
                    })

                    return null
                } catch (error) {
                    clientLogger({
                        level: "error",
                        message: "Error on sign in",
                        object: { error },
                    })
                    return null
                }
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        jwt({ token, user }) {
            //token will contain some extra properities but i could not override the type so fuck off

            if (user) {
                //console.log("logged in callback", user)
                token.user = { ...user }
            }

            return token //add user data to token
        },
        async session({ session, token }) {
            if (session.user) {
                const { id, email, ...user } = token.user
                session.user = {
                    id: "some id here", // not needed for this app
                    email: "", // not needed for this app
                    ...user,
                    address: "INDIRIZZO RCC", // additional prop only for testing
                    emailVerified: new Date(),
                }
            }

            return session
        },

        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")

            const isSignOut = nextUrl.pathname.toLowerCase().includes("signout")

            if (isOnDashboard && !isSignOut) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn && !isSignOut) {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }
            return true
        },
    },
    events: {
        signOut(message) {
            clientLogger({
                level: "info",
                message: "User logging out...",
                object: { user: message },
            })
        },
        signIn(message) {
            clientLogger({
                level: "info",
                message: "User logged in",
                object: { user: message },
            })
        },
    },
} satisfies NextAuthConfig
