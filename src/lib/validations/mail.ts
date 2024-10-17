import { z } from "zod"

// NOTE ComboBoxUser type hardcoded
export const MailReceiverSchema = z.object({
    diff: z.number(),
    email: z.string().email(),
    username: z.string(),
    subscription: z.object({
        id: z.string(),
        notes: z.string().optional(),
        expirationDate: z.date().or(z.string().pipe(z.coerce.date())),
        paymentDate: z.date().or(z.string().pipe(z.coerce.date())),
    }),
})

export const userOptionSchema = z.object({
    value: z.string(),
    label: z.string(),
    user: MailReceiverSchema,
})

export type MailReceiver = z.infer<typeof MailReceiverSchema>

export const sendMailsInputSchema = z.object({
    from: z.string().email(),
    to: userOptionSchema.array(),
    subject: z.string().min(1, "Inserisci l' oggetto della mail"),
    content: z.string().min(1, "Inserisci il messaggio della mail"),
})

export type SendMailFormInput = z.infer<typeof sendMailsInputSchema>
