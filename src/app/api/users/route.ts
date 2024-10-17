import { prisma } from "@/lib/prisma"
import { omit, pick } from "@/lib/utils"
import { addSubscriptionInputSchema } from "@/lib/validations/user"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import { NextRequest, NextResponse } from "next/server"
import { URLSearchParams } from "url"

function validateGetRequestParams(
	requestSearchParams: URLSearchParams,
	params: string[]
) {
	let valid = true

	for (let i = 0; i < params.length && valid; i++) {
		if (!requestSearchParams.has(params[i])) valid = false
	}

	return valid
}

// get specific users
/* export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)

    const valid = validateGetRequestParams(searchParams, getUserInputKeys)

    if (!valid)
        return new NextResponse("Invalid params", {
            status: 400,
            statusText: "Bad Request",
        })

    const user = await prisma.user.findUnique({
        where: {
            username_password_email: {
                email: searchParams.get("email")!,
                password: searchParams.get("password")!,
                username: searchParams.get("username")!,
            },
        },
    })

    if (!user) return new NextResponse("User not found.", { status: 404 })

    return new NextResponse(JSON.stringify(user), { status: 200 })
} */

export async function GET() {
	const users = await prisma.user.findMany({
		select: {
			username: true,
			email: true,
			subscriptions: { select: { expirationDate: true } },
		},
	})
	return new NextResponse(JSON.stringify(users), { status: 200 })
}

export async function POST(request: NextRequest) {
	const body = await request.json()
	const parsed = addSubscriptionInputSchema.safeParse(body)

	if (!parsed.success)
		return new NextResponse("Invalid body", {
			status: 400,
			statusText: "Bad Request",
		})

	const userToAdd = parsed.data
	try {
		const userData = pick(userToAdd, ["email", "username", "password"])

		const subscriptionData = omit(userToAdd, [
			"email",
			"username",
			"password",
		])

		// calculate expiration date
		const paymentDate = subscriptionData.subscriptionPeriod.startDate
		const expirationDate = new Date(paymentDate)
		expirationDate.setMonth(
			paymentDate.getMonth() + subscriptionData.duration.months
		)

		// add to db
		const addedUser = await prisma.subscription.create({
			data: {
				macAddress: subscriptionData.macAddress,
				notes: subscriptionData.notes,
				userNotificated: subscriptionData.userNotified.notified,
				type: subscriptionData.type.title,
				paymentDate: subscriptionData.subscriptionPeriod.startDate,
				expirationDate,
				user: { create: { ...userData } },
			},
		})

		//TODO add to log table

		return new NextResponse(JSON.stringify(addedUser), { status: 200 })
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2002")
				return new NextResponse("User already exists.", { status: 409 })
		}
		return new NextResponse("Error while adding user", { status: 500 })
	}
}
