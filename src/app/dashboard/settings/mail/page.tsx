import { getEmailSettings } from "@/server/actions/mails"

export default async function Settings() {
    const emailSettings = await getEmailSettings()

    return <pre>{JSON.stringify(emailSettings, null, 4)}</pre>
}
