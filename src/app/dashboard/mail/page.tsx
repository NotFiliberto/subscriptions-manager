import { getAllUsers } from "@/server/actions/users"
import { Suspense } from "react"
import SendMailsForm from "./SendMailsForm"

export default async function SendMails() {
    const users = await getAllUsers()

    return (
        <Suspense fallback={<div>loading users...</div>}>
            <SendMailsForm users={users} />
        </Suspense>
    )
}
