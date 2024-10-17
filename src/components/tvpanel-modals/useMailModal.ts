import { SendMailFormInput } from "@/lib/validations/mail"
import { useState } from "react"

export default function useMailModal() {
    const [visible, setVisible] = useState(false)
    const [mailFields, setMailFields] = useState<SendMailFormInput>()
    function toggle() {
        setVisible(!visible)
    }
    return { toggle, visible, mailFields, setMailFields }
}
